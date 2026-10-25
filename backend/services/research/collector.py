"""
ICLAS Public-Web Research Data Collector
Responsible, compliant web data collection module for corporate research.
Enforces domain whitelisting, SEC EDGAR compliance, robots.txt, rate limits,
streaming size limits, content-type checks, and persistent caching.
"""

import os
import sys
import json
import time
import hashlib
import logging
import urllib.parse
import urllib.robotparser
from typing import Dict, Any, Optional, List
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
import feedparser
import trafilatura

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [ICLAS Collector] %(message)s"
)
logger = logging.getLogger("iclas_collector")


class ResponsibleCollector:
    """
    Polite, responsible HTTP collector designed specifically for public corporate intelligence.
    Adheres strictly to RFC standards, domain whitelists, SEC EDGAR User-Agent rules,
    and site-specific rate limits.
    """

    def __init__(self, config_path: Optional[str] = None):
        # Resolve config path
        if not config_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            config_path = os.path.join(base_dir, "config", "research_config.json")
        
        self.config_path = config_path
        self.config = self._load_config()

        self.collection_cfg = self.config.get("responsible_collection", {})
        self.permitted_domains = set(self.config.get("permitted_domains", []))
        
        # User Agents
        self.default_ua = self.collection_cfg.get(
            "user_agent", 
            "ICLAS-Corporate-Intelligence/1.0 (Academic Advisory System; research@iclas-advisor.org)"
        )
        self.sec_ua = self.collection_cfg.get(
            "sec_edgar_user_agent",
            "ICLAS-Corporate-Intelligence research@iclas-advisor.org"
        )
        
        # Limits and Timeouts
        self.conn_timeout = float(self.collection_cfg.get("connection_timeout", 10.0))
        self.read_timeout = float(self.collection_cfg.get("read_timeout", 15.0))
        self.max_retries = int(self.collection_cfg.get("max_retries", 3))
        self.retry_backoff = float(self.collection_cfg.get("retry_backoff_factor", 1.5))
        self.min_delay = float(self.collection_cfg.get("min_request_delay_seconds", 1.0))
        self.max_size_bytes = int(self.collection_cfg.get("max_response_size_bytes", 5242880)) # 5MB
        self.allowed_types = self.collection_cfg.get("allowed_content_types", [
            "text/html", "application/xml", "text/xml", "application/rss+xml", "application/atom+xml", "application/json"
        ])
        
        # Cache setup
        self.cache_enabled = self.collection_cfg.get("cache_enabled", True)
        self.cache_ttl = int(self.collection_cfg.get("cache_ttl_seconds", 86400)) # 24 hrs
        cache_rel_dir = self.collection_cfg.get("cache_dir", "data/research_cache")
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.cache_dir = os.path.join(base_dir, cache_rel_dir)
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # State tracking: polite per-domain delays & robots.txt cache
        self._last_domain_request: Dict[str, float] = {}
        self._robot_parsers: Dict[str, urllib.robotparser.RobotFileParser] = {}
        
        # Build resilient requests session
        self.session = self._create_resilient_session()

    def _load_config(self) -> Dict[str, Any]:
        """Loads configuration from JSON file."""
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Failed to load research config from {self.config_path}: {e}")
        return {}

    def _create_resilient_session(self) -> requests.Session:
        """Configures requests Session with automatic backoff retry logic."""
        session = requests.Session()
        retry_strategy = Retry(
            total=self.max_retries,
            backoff_factor=self.retry_backoff,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "HEAD"]
        )
        adapter = HTTPAdapter(max_retries=retry_strategy, pool_connections=10, pool_maxsize=10)
        session.mount("https://", adapter)
        session.mount("http://", adapter)
        return session

    def _get_domain(self, url: str) -> str:
        """Extracts lowercase domain from URL."""
        parsed = urllib.parse.urlparse(url)
        netloc = parsed.netloc.lower()
        if ":" in netloc:
            netloc = netloc.split(":")[0]
        return netloc

    def is_domain_permitted(self, domain: str) -> bool:
        """
        Validates if domain or parent domain is registered in permitted_domains list.
        Prevents indiscriminate web scraping.
        """
        domain = domain.lower()
        if domain in self.permitted_domains:
            return True
        for permitted in self.permitted_domains:
            if domain == permitted or domain.endswith("." + permitted):
                return True
        return False

    def check_robots_allowed(self, url: str) -> bool:
        """
        Fetches and evaluates robots.txt for domain if enabled.
        Accommodates official SEC EDGAR API policy which permits automated
        access to data.sec.gov endpoints using identifying User-Agents.
        """
        if not self.collection_cfg.get("respect_robots_txt", True):
            return True
        
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower()
        
        # SEC EDGAR developer data endpoint (data.sec.gov) permits programmatic research access
        # with an identifying User-Agent under SEC FAIR access rules (<= 10 req/sec)
        if "data.sec.gov" in domain or ("sec.gov" in domain and "/submissions/" in url):
            return True

        scheme = parsed.scheme or "https"
        robots_url = f"{scheme}://{domain}/robots.txt"

        if domain not in self._robot_parsers:
            rp = urllib.robotparser.RobotFileParser()
            try:
                rp.set_url(robots_url)
                rp.read()
                self._robot_parsers[domain] = rp
            except Exception as e:
                logger.warning(f"Could not read robots.txt from {robots_url}: {e}. Proceeding cautiously.")
                return True

        rp = self._robot_parsers[domain]
        ua = self.sec_ua if ("sec.gov" in domain) else self.default_ua
        allowed = rp.can_fetch(ua, url)
        return allowed

    def _apply_domain_rate_limit(self, domain: str):
        """Ensures site-specific polite delay between consecutive requests."""
        now = time.time()
        last_req = self._last_domain_request.get(domain, 0.0)
        elapsed = now - last_req
        if elapsed < self.min_delay:
            sleep_duration = self.min_delay - elapsed
            logger.info(f"Applying polite rate-limit delay for {domain}: {sleep_duration:.2f}s")
            time.sleep(sleep_duration)
        self._last_domain_request[domain] = time.time()

    def _get_cache_path(self, url: str) -> str:
        """Calculates cache file path using SHA-256 hash of normalized URL."""
        norm_url = url.strip()
        url_hash = hashlib.sha256(norm_url.encode("utf-8")).hexdigest()
        return os.path.join(self.cache_dir, f"{url_hash}.json")

    def _read_from_cache(self, url: str) -> Optional[Dict[str, Any]]:
        """Reads cached result if file exists and has not expired."""
        if not self.cache_enabled:
            return None
        cache_file = self._get_cache_path(url)
        if not os.path.exists(cache_file):
            return None
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            cached_time = data.get("cached_at", 0)
            if (time.time() - cached_time) < self.cache_ttl:
                data["cached"] = True
                logger.info(f"Cache hit for URL: {url}")
                return data
            else:
                logger.info(f"Cache expired for URL: {url}")
        except Exception as e:
            logger.warning(f"Error reading cache for {url}: {e}")
        return None

    def _write_to_cache(self, url: str, data: Dict[str, Any]):
        """Persists successful research collection result to cache."""
        if not self.cache_enabled:
            return
        cache_file = self._get_cache_path(url)
        try:
            data_to_save = dict(data)
            data_to_save["cached_at"] = time.time()
            data_to_save["cached"] = False # Saved state
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(data_to_save, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.warning(f"Failed writing cache for {url}: {e}")

    def fetch_url(self, url: str, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Safely and responsibly fetches an allowed public web resource.
        Validates domain, robots.txt, size limit, content-type, and caches the result.
        """
        # Validate URL scheme
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return {
                "url": url,
                "status": "error",
                "error": f"Invalid URL scheme '{parsed.scheme}'. Only HTTP and HTTPS are permitted."
            }

        domain = self._get_domain(url)

        # 1. Domain whitelist check
        if not self.is_domain_permitted(domain):
            error_msg = f"Domain '{domain}' is not in the permitted public source registry. Indiscriminate scraping is disabled."
            logger.warning(f"Access rejected: {error_msg}")
            return {
                "url": url,
                "domain": domain,
                "status": "blocked",
                "status_code": 403,
                "error": error_msg,
                "permitted": False
            }

        # 2. Check cache
        if not force_refresh:
            cached_data = self._read_from_cache(url)
            if cached_data:
                return cached_data

        # 3. Check robots.txt
        if not self.check_robots_allowed(url):
            error_msg = f"Fetching URL '{url}' is restricted by the site's robots.txt policy."
            logger.warning(error_msg)
            return {
                "url": url,
                "domain": domain,
                "status": "blocked",
                "status_code": 403,
                "error": error_msg,
                "robots_allowed": False
            }

        # 4. Enforce polite delay
        self._apply_domain_rate_limit(domain)

        # 5. Header setup (specialized User-Agent for SEC EDGAR)
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": self.sec_ua if ("sec.gov" in domain) else self.default_ua
        }

        # 6. Stream request with size limits and timeouts
        try:
            logger.info(f"Fetching public source: {url}")
            response = self.session.get(
                url,
                headers=headers,
                timeout=(self.conn_timeout, self.read_timeout),
                stream=True,
                allow_redirects=True
            )

            if response.status_code != 200:
                return {
                    "url": url,
                    "domain": domain,
                    "status": "error",
                    "status_code": response.status_code,
                    "error": f"HTTP {response.status_code}: {response.reason}"
                }

            # Content-Type verification
            raw_content_type = response.headers.get("Content-Type", "")
            base_content_type = raw_content_type.split(";")[0].strip().lower()
            if base_content_type and not any(ct in base_content_type for ct in self.allowed_types):
                return {
                    "url": url,
                    "domain": domain,
                    "status": "error",
                    "status_code": response.status_code,
                    "error": f"Content-Type '{base_content_type}' is not an allowed text/feed format."
                }

            # Size limit check from Content-Length header
            content_length = response.headers.get("Content-Length")
            if content_length and int(content_length) > self.max_size_bytes:
                return {
                    "url": url,
                    "domain": domain,
                    "status": "error",
                    "status_code": response.status_code,
                    "error": f"Resource size ({content_length} bytes) exceeds limit ({self.max_size_bytes} bytes)."
                }

            # Stream chunks to avoid memory spikes
            bytes_downloaded = 0
            chunks = []
            for chunk in response.iter_content(chunk_size=16384):
                if chunk:
                    bytes_downloaded += len(chunk)
                    if bytes_downloaded > self.max_size_bytes:
                        response.close()
                        return {
                            "url": url,
                            "domain": domain,
                            "status": "error",
                            "error": f"Stream aborted: payload exceeded maximum limit of {self.max_size_bytes} bytes."
                        }
                    chunks.append(chunk)

            raw_bytes = b"".join(chunks)
            encoding = response.encoding or response.apparent_encoding or "utf-8"
            raw_text = raw_bytes.decode(encoding, errors="replace")

            # 7. Extract content
            result = self._extract_content(url, domain, raw_text, base_content_type)
            result["status"] = "success"
            result["status_code"] = response.status_code
            result["byte_size"] = bytes_downloaded
            result["cached"] = False
            result["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

            # 8. Save to cache
            self._write_to_cache(url, result)
            return result

        except requests.exceptions.Timeout as e:
            logger.error(f"Timeout connecting to {url}: {e}")
            return {
                "url": url,
                "domain": domain,
                "status": "error",
                "error": f"Connection/Read timeout exceeded ({self.conn_timeout}s / {self.read_timeout}s)."
            }
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error fetching {url}: {e}")
            return {
                "url": url,
                "domain": domain,
                "status": "error",
                "error": f"Network request failed: {str(e)}"
            }
        except Exception as e:
            logger.error(f"Unexpected error processing {url}: {e}")
            return {
                "url": url,
                "domain": domain,
                "status": "error",
                "error": f"Processing error: {str(e)}"
            }

    def _extract_content(self, url: str, domain: str, raw_text: str, content_type: str) -> Dict[str, Any]:
        """
        Parses HTML or RSS/Atom feed to extract clean structured text and title.
        Uses trafilatura for articles, falling back to BeautifulSoup (lxml).
        """
        # Case A: JSON Data (e.g. SEC EDGAR Submissions API or Company Facts)
        if "json" in content_type or raw_text.strip().startswith("{") or raw_text.strip().startswith("["):
            try:
                json_data = json.loads(raw_text)
                
                # Check if this is SEC EDGAR submissions JSON
                if isinstance(json_data, dict) and ("cik" in json_data or "filings" in json_data):
                    company_name = json_data.get("name", "Unknown Entity")
                    cik = json_data.get("cik", "")
                    sic = json_data.get("sic", "")
                    sic_desc = json_data.get("sicDescription", "")
                    fiscal_year_end = json_data.get("fiscalYearEnd", "")
                    state = json_data.get("stateOfIncorporation", "")
                    title = f"SEC EDGAR: {company_name} (CIK: {cik})"
                    
                    recent_filings = json_data.get("filings", {}).get("recent", {})
                    forms = recent_filings.get("form", [])[:10]
                    filing_dates = recent_filings.get("filingDate", [])[:10]
                    doc_descs = recent_filings.get("primaryDocDescription", [])[:10]
                    
                    md_lines = [
                        f"# {title}",
                        f"- **Standard Industrial Classification (SIC):** {sic} - {sic_desc}",
                        f"- **State of Incorporation:** {state}",
                        f"- **Fiscal Year End:** {fiscal_year_end}",
                        "\n### Recent SEC Regulatory Filings (10-K, 10-Q, 8-K):",
                        "| Form | Filing Date | Description |",
                        "| :--- | :--- | :--- |"
                    ]
                    for f, d, desc in zip(forms, filing_dates, doc_descs):
                        md_lines.append(f"| **{f}** | {d} | {desc or 'Regulatory Report'} |")
                    
                    formatted_content = "\n".join(md_lines)
                    return {
                        "url": url,
                        "domain": domain,
                        "content_type": "json/sec-edgar",
                        "title": title,
                        "content": formatted_content,
                        "excerpt": f"{company_name} (CIK: {cik}) - SIC {sic}: {sic_desc}. Found {len(forms)} recent filings.",
                        "metadata": {
                            "cik": cik,
                            "entity_name": company_name,
                            "filings_count": len(forms)
                        }
                    }

                # Generic JSON
                title = f"Data Object from {domain}"
                formatted_content = f"# Data from {domain}\n```json\n" + json.dumps(json_data, indent=2)[:4000] + "\n```"
                return {
                    "url": url,
                    "domain": domain,
                    "content_type": "application/json",
                    "title": title,
                    "content": formatted_content,
                    "excerpt": str(json_data)[:300],
                    "metadata": {"keys": list(json_data.keys()) if isinstance(json_data, dict) else []}
                }
            except Exception as e:
                logger.warning(f"Failed parsing JSON response: {e}")

        # Case B: RSS / Atom Feed
        if "xml" in content_type or "rss" in content_type or "atom" in content_type or "<rss" in raw_text[:200] or "<feed" in raw_text[:200]:
            feed = feedparser.parse(raw_text)
            feed_title = feed.feed.get("title", f"Feed from {domain}")
            entries = []
            full_text_parts = [f"# {feed_title}\n"]
            for entry in feed.entries[:15]: # top 15 entries
                item_title = entry.get("title", "Untitled")
                item_link = entry.get("link", "")
                item_summary = entry.get("summary", "")
                published = entry.get("published", "")
                
                # Clean html from summary if present
                clean_summary = BeautifulSoup(item_summary, "html.parser").get_text(strip=True) if item_summary else ""
                
                entries.append({
                    "title": item_title,
                    "link": item_link,
                    "published": published,
                    "summary": clean_summary
                })
                full_text_parts.append(f"### {item_title}\n- **Date:** {published}\n- **Link:** {item_link}\n- **Summary:** {clean_summary}\n")

            return {
                "url": url,
                "domain": domain,
                "content_type": "rss/atom",
                "title": feed_title,
                "content": "\n".join(full_text_parts),
                "excerpt": full_text_parts[1] if len(full_text_parts) > 1 else "",
                "entries": entries,
                "metadata": {
                    "entry_count": len(entries),
                    "feed_version": getattr(feed, "version", "unknown")
                }
            }

        # Case B: Standard Web Page / Corporate Report / Announcement
        # 1. Try Trafilatura for primary article text
        extracted_text = trafilatura.extract(
            raw_text,
            url=url,
            include_links=True,
            include_tables=True,
            favor_precision=True
        )

        # 2. Extract Title and Metadata using BeautifulSoup
        soup = BeautifulSoup(raw_text, "lxml")
        title = ""
        if soup.title and soup.title.string:
            title = soup.title.string.strip()
        elif soup.find("h1"):
            title = soup.find("h1").get_text(strip=True)
        else:
            title = f"Document from {domain}"

        # If trafilatura produced good text, use it
        if extracted_text and len(extracted_text.strip()) > 100:
            content = extracted_text.strip()
            excerpt = content[:400] + ("..." if len(content) > 400 else "")
            return {
                "url": url,
                "domain": domain,
                "content_type": "html/article",
                "title": title,
                "content": content,
                "excerpt": excerpt,
                "metadata": {
                    "extractor": "trafilatura",
                    "has_tables": ("|" in content or "\t" in content)
                }
            }

        # Fallback to BeautifulSoup clean text extraction for pages with non-standard layout (e.g. IR tables/filing info)
        for tag in soup(["script", "style", "noscript", "svg", "nav", "footer"]):
            tag.decompose()

        paragraphs = [p.get_text(strip=True) for p in soup.find_all(["p", "h1", "h2", "h3", "h4", "li"]) if p.get_text(strip=True)]
        fallback_content = "\n\n".join(paragraphs)
        if not fallback_content:
            fallback_content = soup.get_text(separator="\n", strip=True)

        # Cap length to reasonable size
        if len(fallback_content) > 15000:
            fallback_content = fallback_content[:15000] + "\n\n[Content truncated for analysis...]"

        excerpt = fallback_content[:400] + ("..." if len(fallback_content) > 400 else "")

        return {
            "url": url,
            "domain": domain,
            "content_type": "html/generic",
            "title": title,
            "content": fallback_content,
            "excerpt": excerpt,
            "metadata": {
                "extractor": "beautifulsoup_lxml"
            }
        }
