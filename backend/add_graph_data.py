"""
Build DS-6: Company relationship graph dataset.
Creates graph_data.json with nodes + edges AND patches graph_links into each company in companies_data.json.
Run: python add_graph_data.py
"""
import json, os

COMPANIES_PATH = os.path.join(os.path.dirname(__file__), 'data', 'companies_data.json')
GRAPH_PATH     = os.path.join(os.path.dirname(__file__), 'data', 'graph_data.json')

# ── Relationship types ──────────────────────────────────────────────────────
# competitor | supplier | partner | investor | acquirer | subsidiary | rival_vc

RAW_EDGES = [
  # Apple
  ("apple",    "googl",    "competitor",  "Compete in smartphone OS, cloud, and AI assistants"),
  ("apple",    "msft",     "competitor",  "Compete in enterprise productivity, cloud, and PC"),
  ("apple",    "meta",     "competitor",  "Compete in AR/VR hardware (Vision Pro vs Quest)"),
  ("apple",    "samsung",  "supplier",    "Samsung supplies OLED displays for iPhone"),
  ("apple",    "tsmc",     "supplier",    "TSMC exclusively fabricates Apple Silicon (M/A series)"),
  ("apple",    "nvda",     "rival_vc",    "Nvidia dominates AI chips Apple is designing in-house"),

  # Netflix
  ("netflix",  "disney",   "competitor",  "Direct streaming rivals — both compete for subscriber share"),
  ("netflix",  "amzn",     "competitor",  "Amazon Prime Video competes for streaming audience"),
  ("netflix",  "meta",     "competitor",  "Meta Reels and short video erodes Netflix screen time"),
  ("netflix",  "googl",    "competitor",  "YouTube Premium and YouTube compete for ad-supported video"),

  # Tesla
  ("tesla",    "rivian",   "competitor",  "Compete directly in EV pickup trucks (Cybertruck vs R1T)"),
  ("tesla",    "nvda",     "rival_vc",    "Tesla builds own AI chips (Dojo) competing with NVIDIA"),
  ("tesla",    "ford",     "competitor",  "Ford F-150 Lightning competes with Tesla Cybertruck"),
  ("tesla",    "msft",     "partner",     "Azure cloud powers Tesla's telematics and fleet analytics"),

  # Block (XYZ)
  ("block",    "pypl",     "competitor",  "Square POS and Cash App compete with PayPal and Venmo"),
  ("block",    "v",        "competitor",  "Compete in merchant payment acquiring and card networks"),
  ("block",    "ma",       "competitor",  "Compete in global merchant payment processing"),

  # PayPal
  ("paypal",   "block",    "competitor",  "Venmo vs Cash App — direct competition in P2P payments"),
  ("paypal",   "v",        "partner",     "PayPal issues Visa-branded cards for wallet users"),
  ("paypal",   "ma",       "partner",     "PayPal uses Mastercard network for card processing"),
  ("paypal",   "amzn",     "partner",     "PayPal accepted as payment method on Amazon"),

  # Meta
  ("meta",     "googl",    "competitor",  "Compete in digital advertising — combined 50%+ global ad share"),
  ("meta",     "twitter",  "competitor",  "Threads directly competes with X/Twitter for microblogging"),
  ("meta",     "snapchat", "competitor",  "Instagram Stories copied Snapchat; compete for Gen Z attention"),
  ("meta",     "msft",     "rival_vc",    "Meta Quest vs Microsoft Mesh — compete in enterprise metaverse"),
  ("meta",     "nvda",     "partner",     "NVIDIA supplies H100 GPUs for Meta's AI model training"),

  # Microsoft
  ("msft",     "googl",    "competitor",  "Compete in cloud (Azure vs GCP), productivity (Office vs Workspace), and AI (Copilot vs Gemini)"),
  ("msft",     "amzn",     "competitor",  "Azure and AWS compete for enterprise cloud market share"),
  ("msft",     "nvda",     "partner",     "Microsoft Azure is the largest NVIDIA cloud GPU customer"),
  ("msft",     "meta",     "rival_vc",    "Teams vs Meta Workplace; competing enterprise communication platforms"),
  ("msft",     "zoom",     "competitor",  "Teams has effectively bundled and commoditized Zoom in SMB/mid-market"),

  # NVIDIA
  ("nvda",     "intel",    "competitor",  "Compete in data center compute; NVIDIA GPUs vs Intel CPUs/Gaudi"),
  ("nvda",     "amzn",     "partner",     "AWS is NVIDIA's largest cloud infrastructure customer"),
  ("nvda",     "msft",     "partner",     "Azure CoreWeave and Microsoft SuperCloud run on NVIDIA H100 clusters"),
  ("nvda",     "meta",     "partner",     "Meta runs 350,000+ H100 GPUs on NVIDIA silicon"),
  ("nvda",     "googl",    "rival_vc",    "Google TPUs compete directly with NVIDIA GPUs for AI workloads"),

  # Google / Alphabet
  ("googl",    "amzn",     "competitor",  "GCP vs AWS in cloud; compete in e-commerce ads and smart home"),
  ("googl",    "meta",     "competitor",  "Compete for ~50% of global digital advertising spend"),
  ("googl",    "msft",     "competitor",  "Compete in search (Bing AI vs Google), cloud, and productivity"),
  ("googl",    "nvda",     "rival_vc",    "TPU v5 chips compete with NVIDIA H100 for AI training workloads"),

  # Amazon
  ("amzn",     "msft",     "competitor",  "AWS vs Azure — world's top two cloud platforms"),
  ("amzn",     "googl",    "competitor",  "AWS vs GCP; compete in e-commerce ads and logistics"),
  ("amzn",     "walmart",  "competitor",  "Amazon.com and Walmart.com compete in US e-commerce and grocery"),
  ("amzn",     "rivian",   "partner",     "Amazon invested $700M in Rivian and ordered 100,000 delivery vans"),

  # Alibaba
  ("alibaba",  "amzn",     "competitor",  "Compete in global e-commerce and cloud (Alibaba Cloud vs AWS)"),
  ("alibaba",  "meta",     "rival_vc",    "Alibaba and Meta compete for SE Asia digital advertising"),
  ("alibaba",  "softbank", "investor",    "SoftBank invested $20M in 1999 Alibaba Seed round (200,000x return)"),
  ("alibaba",  "walmart",  "rival_vc",    "Alibaba JD.com ecosystem competes with Walmart's Flipkart in India"),

  # SoftBank
  ("softbank", "alibaba",  "investor",    "SoftBank's $20M Alibaba 1999 investment returned $60B+ (greatest VC return ever)"),
  ("softbank", "uber",     "investor",    "SoftBank invested $7.7B in Uber (largest single tech investment at time)"),
  ("softbank", "wework",   "investor",    "SoftBank led WeWork investment ($18.5B total); complete write-down"),
  ("softbank", "nvda",     "partner",     "SoftBank owns ARM Holdings (IPO 2023) — NVIDIA designs on ARM architecture"),

  # Zoom
  ("zoom",     "msft",     "competitor",  "Microsoft Teams bundled free in Office 365 — displaced Zoom in SMB"),
  ("zoom",     "googl",    "competitor",  "Google Meet bundled free in Workspace — competes for consumer/SME"),
  ("zoom",     "meta",     "rival_vc",    "Meta Horizon Workrooms and WhatsApp video compete for social video"),

  # Twitter / X
  ("twitter",  "meta",     "competitor",  "Threads directly threatens X's microblogging position"),
  ("twitter",  "snapchat", "competitor",  "Compete for Gen Z short-form content and creator monetization"),
  ("twitter",  "googl",    "rival_vc",    "YouTube Shorts competes with X video for creator monetization"),

  # Snapchat
  ("snapchat", "meta",     "competitor",  "Instagram Stories and Reels directly copied Snapchat's innovations"),
  ("snapchat", "twitter",  "competitor",  "Compete for Gen Z attention and short-form content creators"),
  ("snapchat", "googl",    "rival_vc",    "YouTube competes for Snapchat's Gen Z video audience"),

  # Boeing
  ("boeing",   "ge_aerospace", "partner", "GE Aviation (GE Aerospace) manufactures LEAP engines for Boeing 737 MAX"),
  ("boeing",   "msft",     "partner",     "Microsoft Azure powers Boeing's digital twin and design simulation"),
  ("boeing",   "intel",    "rival_vc",    "Intel aerospace avionics compete with Honeywell in Boeing avionics supply"),

  # GE / GE Aerospace
  ("general_electric", "boeing",    "partner",    "GE Aviation LEAP engines power Boeing 737 MAX and 777X fleets"),
  ("general_electric", "msft",      "partner",    "Microsoft Azure powers GE Predix industrial IoT platform"),
  ("general_electric", "softbank",  "rival_vc",   "GE Capital and SoftBank Vision Fund competed in industrial tech investment"),

  # Intel
  ("intel",    "nvda",     "competitor",  "Compete in data center AI chips (Gaudi vs H100) and GPU market"),
  ("intel",    "msft",     "partner",     "Microsoft Windows runs on Intel x86; long-standing foundational partnership"),
  ("intel",    "amzn",     "rival_vc",    "AWS Graviton custom ARM chips compete with Intel server CPUs"),
  ("intel",    "tsmc",     "rival_vc",    "Intel Foundry competes with TSMC for external semiconductor manufacturing"),
  ("intel",    "apple",    "rival_vc",    "Apple switched from Intel to TSMC-made M-series chips in 2020"),

  # Kodak
  ("kodak",    "fujifilm", "competitor",  "Fujifilm and Kodak competed in film, then diverged — Fujifilm survived via healthcare pivot"),
  ("kodak",    "canon",    "competitor",  "Canon's digital cameras accelerated Kodak's film market collapse"),
  ("kodak",    "googl",    "rival_vc",    "Google Images and smartphone cameras replaced Kodak's consumer print market"),

  # Nokia
  ("nokia",    "apple",    "competitor",  "Apple iPhone displaced Nokia as dominant smartphone maker 2007-2012"),
  ("nokia",    "msft",     "partner",     "Nokia adopted Windows Phone OS in 2011 — strategic partnership that failed"),
  ("nokia",    "samsung",  "competitor",  "Samsung Android phones competed with Nokia Symbian in emerging markets"),
  ("nokia",    "ericsson", "competitor",  "Ericsson and Nokia compete head-to-head in 5G infrastructure globally"),

  # Sears
  ("sears",    "amzn",     "competitor",  "Amazon e-commerce destroyed Sears' retail value proposition"),
  ("sears",    "walmart",  "competitor",  "Walmart's physical and digital retail dominance contributed to Sears' collapse"),

  # Uber
  ("uber",     "lyft",     "competitor",  "Lyft and Uber compete in US ride-hailing — Uber dominant at 68% market share"),
  ("uber",     "googl",    "partner",     "Google Maps powers Uber's routing; Google Ventures invested $258M in Uber"),
  ("uber",     "softbank", "investor",    "SoftBank invested $7.7B in Uber, becoming largest shareholder"),
  ("uber",     "amzn",     "rival_vc",    "Amazon Logistics competes with Uber Eats in last-mile delivery"),

  # WeWork
  ("wework",   "softbank", "investor",    "SoftBank led $18.5B investment in WeWork — largest single startup investment"),
  ("wework",   "regus",    "competitor",  "IWG/Regus competes with WeWork in flexible office space globally"),

  # Peloton
  ("peloton",  "apple",    "partner",     "Peloton app available on Apple TV; Apple Fitness+ competes with Peloton content"),
  ("peloton",  "amzn",     "rival_vc",    "Amazon Halo and Echo Fitness hardware compete with Peloton's connected fitness"),
  ("peloton",  "googl",    "rival_vc",    "Google Fitbit and YouTube Fitness compete with Peloton"),

  # Rivian
  ("rivian",   "tesla",    "competitor",  "R1T pickup and R1S SUV compete with Tesla Cybertruck and Model X"),
  ("rivian",   "amzn",     "partner",     "Amazon invested $700M and ordered 100,000 Rivian electric delivery vans"),
  ("rivian",   "ford",     "rival_vc",    "F-150 Lightning EV competes with Rivian R1T in electric pickup segment"),
  ("rivian",   "vw",       "partner",     "Volkswagen invested $5B in Rivian for EV software and platform sharing"),

  # SVB
  ("svb",      "hsbc",     "acquirer",    "HSBC acquired SVB's UK subsidiary for £1 to protect UK tech startup deposits"),
  ("svb",      "first_citizens", "acquirer", "First Citizens BancShares acquired SVB's US banking assets from FDIC at discount"),

  # Theranos
  ("theranos", "walgreens","partner",     "Walgreens signed exclusive partnership to deploy Theranos blood test kiosks in 40 stores"),
  ("theranos", "safeway",  "partner",     "Safeway invested $350M to host Theranos wellness centres in stores"),

  # Disney
  ("disney",   "netflix",  "competitor",  "Disney+ competes directly with Netflix for streaming subscribers globally"),
  ("disney",   "amzn",     "competitor",  "Amazon Prime Video and Disney+ compete for streaming and live sports"),
  ("disney",   "comcast",  "rival_vc",    "Peacock (NBC Universal/Comcast) competes with Disney+ for streaming"),
  ("disney",   "apple",    "partner",     "Disney+ available on Apple TV; Disney content in Apple TV+ bundle"),

  # FTX
  ("ftx",      "binance",  "competitor",  "Binance and FTX competed as the world's two largest crypto exchanges — Binance liquidated FTT triggering FTX collapse"),
  ("ftx",      "coinbase", "competitor",  "FTX and Coinbase competed for institutional and retail crypto trading volume"),

  # Walmart
  ("walmart",  "amzn",     "competitor",  "Walmart and Amazon compete across e-commerce, grocery, and cloud (AWS vs Walmart Connect)"),
  ("walmart",  "googl",    "partner",     "Walmart partnered with Google for voice commerce via Google Assistant"),
  ("walmart",  "flipkart", "acquirer",    "Walmart acquired Flipkart (India) for $16B in 2018"),

  # Visa
  ("v",        "ma",       "competitor",  "Visa and Mastercard compete in global card network duopoly"),
  ("v",        "pypl",     "partner",     "PayPal issues Visa cards and uses Visa network for card transactions"),
  ("v",        "block",    "competitor",  "Block/Square competes with Visa in merchant acquiring"),

  # Mastercard
  ("ma",       "v",        "competitor",  "Mastercard and Visa are direct network competitors processing $15T+ annually"),
  ("ma",       "pypl",     "partner",     "PayPal uses Mastercard network and issues co-branded Mastercard debit"),

  # JPMorgan
  ("jpm",      "bac",      "competitor",  "JPMorgan Chase and Bank of America compete in consumer banking, investment banking, and wealth management"),
  ("jpm",      "wfc",      "competitor",  "Wells Fargo and JPMorgan compete in US consumer banking and mortgage"),
  ("jpm",      "svb",      "rival_vc",    "JPMorgan acquired some SVB customer accounts after FDIC seizure"),
  ("jpm",      "v",        "partner",     "JPMorgan issues Visa credit cards and partners on Chase Sapphire ecosystem"),

  # AT&T
  ("t",        "msft",     "partner",     "AT&T uses Microsoft Azure for 5G edge computing and enterprise cloud"),
  ("t",        "amzn",     "partner",     "AT&T and AWS partner on 5G network edge computing infrastructure"),

  # HSBC
  ("hsbc",     "jpm",      "competitor",  "HSBC and JPMorgan compete in investment banking and trade finance globally"),
  ("hsbc",     "svb",      "acquirer",    "HSBC UK acquired SVB UK for £1 to protect British startup deposits"),
]

# ── Map id → company data ───────────────────────────────────────────────────
def build_graph():
    with open(COMPANIES_PATH, 'r', encoding='utf-8') as f:
        companies = json.load(f)

    id_map = {c['id']: c for c in companies}

    # Build unique node list from known companies only
    known_ids = set(id_map.keys())

    # All node IDs that appear in edges (could include external like tsmc, samsung)
    all_node_ids = set()
    for src, tgt, rel, desc in RAW_EDGES:
        all_node_ids.add(src)
        all_node_ids.add(tgt)

    # Build nodes
    SECTOR_COLORS = {
        "Technology":     "#6366f1",
        "Media":          "#ec4899",
        "Retail":         "#f59e0b",
        "Automobile":     "#10b981",
        "FinTech":        "#3b82f6",
        "Finance":        "#0ea5e9",
        "Real Estate":    "#84cc16",
        "Healthcare":     "#ef4444",
        "Consumer Goods": "#f97316",
        "Manufacturing":  "#8b5cf6",
        "External":       "#94a3b8",
    }

    EXTERNAL_NODES = {
        "samsung":       {"name": "Samsung",        "sector": "Technology",  "ticker": "005930.KS"},
        "tsmc":          {"name": "TSMC",            "sector": "Technology",  "ticker": "TSM"},
        "fujifilm":      {"name": "Fujifilm",        "sector": "Technology",  "ticker": "FUJIY"},
        "canon":         {"name": "Canon",           "sector": "Technology",  "ticker": "CAJ"},
        "ford":          {"name": "Ford Motor",      "sector": "Automobile",  "ticker": "F"},
        "lyft":          {"name": "Lyft",            "sector": "Technology",  "ticker": "LYFT"},
        "ericsson":      {"name": "Ericsson",        "sector": "Technology",  "ticker": "ERIC"},
        "regus":         {"name": "IWG/Regus",       "sector": "Real Estate", "ticker": "IWG.L"},
        "vw":            {"name": "Volkswagen",      "sector": "Automobile",  "ticker": "VWAGY"},
        "walgreens":     {"name": "Walgreens",       "sector": "Retail",      "ticker": "WBA"},
        "safeway":       {"name": "Safeway",         "sector": "Retail",      "ticker": "PRIVATE"},
        "comcast":       {"name": "Comcast/NBCUniversal","sector":"Media",    "ticker": "CMCSA"},
        "binance":       {"name": "Binance",         "sector": "FinTech",     "ticker": "PRIVATE"},
        "coinbase":      {"name": "Coinbase",        "sector": "FinTech",     "ticker": "COIN"},
        "flipkart":      {"name": "Flipkart",        "sector": "Retail",      "ticker": "PRIVATE"},
        "first_citizens":{"name": "First Citizens",  "sector": "Finance",     "ticker": "FCNCA"},
        "ge_aerospace":  {"name": "GE Aerospace",    "sector": "Manufacturing","ticker":"GE"},
    }

    nodes = []
    for nid in sorted(all_node_ids):
        if nid in id_map:
            c = id_map[nid]
            nodes.append({
                "id":     nid,
                "label":  c.get("name", nid),
                "ticker": c.get("ticker", ""),
                "sector": c.get("sector", "Technology"),
                "color":  SECTOR_COLORS.get(c.get("sector","Technology"), "#94a3b8"),
                "market_cap": c.get("market_cap",""),
                "is_internal": True,
            })
        elif nid in EXTERNAL_NODES:
            ext = EXTERNAL_NODES[nid]
            nodes.append({
                "id":     nid,
                "label":  ext["name"],
                "ticker": ext["ticker"],
                "sector": ext["sector"],
                "color":  SECTOR_COLORS.get(ext["sector"], "#94a3b8"),
                "market_cap": "",
                "is_internal": False,
            })
        else:
            nodes.append({
                "id":     nid,
                "label":  nid.replace("_"," ").title(),
                "ticker": "",
                "sector": "External",
                "color":  SECTOR_COLORS["External"],
                "market_cap": "",
                "is_internal": False,
            })

    # Build edges
    EDGE_COLORS = {
        "competitor": "#ef4444",
        "supplier":   "#10b981",
        "partner":    "#3b82f6",
        "investor":   "#f59e0b",
        "acquirer":   "#8b5cf6",
        "subsidiary": "#06b6d4",
        "rival_vc":   "#f97316",
    }

    edges = []
    for i, (src, tgt, rel, desc) in enumerate(RAW_EDGES):
        edges.append({
            "id":          f"e{i:03d}",
            "source":      src,
            "target":      tgt,
            "relationship": rel,
            "label":       rel.replace("_"," ").title(),
            "description": desc,
            "color":       EDGE_COLORS.get(rel, "#94a3b8"),
        })

    # ── Patch graph_links into each company ───────────────────────────────
    # Build adjacency: id → list of {target, relationship, description}
    adj = {c['id']: [] for c in companies}
    for src, tgt, rel, desc in RAW_EDGES:
        if src in adj:
            target_name = tgt.replace("_"," ").title()
            if tgt in id_map:
                target_name = id_map[tgt].get("name", target_name)
            elif tgt in EXTERNAL_NODES:
                target_name = EXTERNAL_NODES[tgt]["name"]
            adj[src].append({"target_id": tgt, "target_name": target_name, "relationship": rel, "description": desc})
        if tgt in adj:
            source_name = src.replace("_"," ").title()
            if src in id_map:
                source_name = id_map[src].get("name", source_name)
            elif src in EXTERNAL_NODES:
                source_name = EXTERNAL_NODES[src]["name"]
            adj[tgt].append({"target_id": src, "target_name": source_name, "relationship": rel, "description": desc})

    for c in companies:
        c['graph_links'] = adj.get(c['id'], [])

    # Save patched companies
    with open(COMPANIES_PATH, 'w', encoding='utf-8') as f:
        json.dump(companies, f, indent=2, ensure_ascii=False)
    print(f"Patched graph_links into {len(companies)} companies.")
    for c in companies:
        print(f"  {c['name']:30s} -> {len(c['graph_links'])} links")

    # Save graph dataset
    graph_data = {
        "meta": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "internal_nodes": sum(1 for n in nodes if n['is_internal']),
            "external_nodes": sum(1 for n in nodes if not n['is_internal']),
            "relationship_types": list(EDGE_COLORS.keys()),
            "edge_color_legend": EDGE_COLORS,
            "sector_color_legend": SECTOR_COLORS,
        },
        "nodes": nodes,
        "edges": edges,
    }
    with open(GRAPH_PATH, 'w', encoding='utf-8') as f:
        json.dump(graph_data, f, indent=2, ensure_ascii=False)

    print(f"\nGraph saved: {len(nodes)} nodes, {len(edges)} edges -> {GRAPH_PATH}")
    print("Relationship breakdown:")
    rel_counts = {}
    for e in edges:
        rel_counts[e['relationship']] = rel_counts.get(e['relationship'], 0) + 1
    for rel, cnt in sorted(rel_counts.items(), key=lambda x: -x[1]):
        print(f"  {rel:15s}: {cnt}")

if __name__ == '__main__':
    build_graph()
