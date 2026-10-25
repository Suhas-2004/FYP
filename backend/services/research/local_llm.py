"""
ICLAS Local Language Model Adapter
Communicates with local Ollama runtime without requiring external or paid API keys.
Features dynamic model discovery, hardware diagnostics, fallback resolution,
and resilient chat/generation pipelines.
"""

import os
import sys
import json
import time
import logging
from typing import Dict, Any, List, Optional
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [ICLAS Local LLM] %(message)s"
)
logger = logging.getLogger("iclas_local_llm")


class LocalLLMError(Exception):
    """Base exception for local LLM runtime issues."""
    pass


class RuntimeUnavailableError(LocalLLMError):
    """Raised when Ollama or local inference engine cannot be contacted."""
    pass


class ModelNotFoundError(LocalLLMError):
    """Raised when the requested model is not downloaded locally."""
    pass


class LocalLLMAdapter:
    """
    Adapter for local LLM inference engines (primarily Ollama).
    Does NOT depend on OpenAI, Anthropic, or any paid cloud API keys.
    """

    def __init__(self, config_path: Optional[str] = None):
        if not config_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            config_path = os.path.join(base_dir, "config", "research_config.json")
        
        self.config_path = config_path
        self.config = self._load_config()
        self.llm_cfg = self.config.get("local_llm", {})

        self.endpoint = self.llm_cfg.get("endpoint", "http://127.0.0.1:11434").rstrip("/")
        self.default_model = self.llm_cfg.get("default_model", "llama3.2:3b")
        self.fallback_models = self.llm_cfg.get("fallback_models", [
            "llama3.2:1b",
            "qwen2.5:0.5b",
            "qwen2.5:3b",
            "mistral:7b",
            "phi3:mini",
            "llama3.1:8b"
        ])
        self.temperature = float(self.llm_cfg.get("temperature", 0.2))
        self.timeout = float(self.llm_cfg.get("timeout_seconds", 60.0))
        self.max_tokens = int(self.llm_cfg.get("max_tokens", 2048))

    def _load_config(self) -> Dict[str, Any]:
        """Loads configuration from JSON file."""
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Failed to load research config: {e}")
        return {}

    def check_runtime(self) -> Dict[str, Any]:
        """
        Detects whether Ollama is active and reachable on the local machine.
        Returns status, response time, and detailed diagnostics.
        """
        start_time = time.time()
        try:
            resp = requests.get(f"{self.endpoint}/api/tags", timeout=4.0)
            elapsed_ms = round((time.time() - start_time) * 1000, 1)

            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("name") for m in data.get("models", [])]
                return {
                    "online": True,
                    "runtime": "Ollama",
                    "endpoint": self.endpoint,
                    "latency_ms": elapsed_ms,
                    "models_count": len(models),
                    "installed_models": models,
                    "message": f"Ollama local runtime is active ({len(models)} model(s) installed)."
                }
            else:
                return {
                    "online": False,
                    "runtime": "Ollama",
                    "endpoint": self.endpoint,
                    "status_code": resp.status_code,
                    "message": f"Ollama returned unexpected status code {resp.status_code}."
                }
        except requests.exceptions.ConnectionError:
            return {
                "online": False,
                "runtime": "Ollama",
                "endpoint": self.endpoint,
                "error": "Connection refused",
                "message": (
                    "Ollama is not running locally. Please verify Ollama is installed "
                    "(https://ollama.com) and start it using the 'ollama serve' command or launching the Ollama desktop app."
                ),
                "troubleshooting": [
                    "Verify Ollama is installed: run 'ollama --version' in terminal",
                    "Start Ollama service: run 'ollama serve'",
                    "Pull an open-source model: run 'ollama pull llama3.2:1b' or 'ollama pull qwen2.5:0.5b'"
                ]
            }
        except Exception as e:
            return {
                "online": False,
                "runtime": "Ollama",
                "endpoint": self.endpoint,
                "error": str(e),
                "message": f"Error contacting local inference engine: {e}"
            }

    def list_installed_models(self) -> List[Dict[str, Any]]:
        """
        Retrieves full metadata for all models currently installed in the local Ollama runtime.
        """
        try:
            resp = requests.get(f"{self.endpoint}/api/tags", timeout=5.0)
            if resp.status_code == 200:
                raw_models = resp.json().get("models", [])
                formatted = []
                for m in raw_models:
                    size_gb = round(m.get("size", 0) / (1024 ** 3), 2)
                    formatted.append({
                        "name": m.get("name"),
                        "model": m.get("model"),
                        "size_gb": size_gb,
                        "digest": m.get("digest", "")[:12],
                        "modified_at": m.get("modified_at")
                    })
                return formatted
        except Exception as e:
            logger.warning(f"Could not retrieve installed models: {e}")
        return []

    def resolve_model(self, requested_model: Optional[str] = None) -> str:
        """
        Resolves the best available local model:
        1. Explicitly requested model (if installed)
        2. Configured default_model (if installed)
        3. Configured fallback_models (in order of priority)
        4. Any installed model available
        If no models are installed, raises ModelNotFoundError with download instructions.
        """
        installed = self.list_installed_models()
        installed_names = [m["name"] for m in installed]
        
        # Helper to match with or without tags (e.g. 'qwen2.5:0.5b' or 'qwen2.5:0.5b-instruct')
        def match_model(target: str) -> Optional[str]:
            target_clean = target.lower().strip()
            for name in installed_names:
                if name.lower() == target_clean or name.lower().startswith(target_clean):
                    return name
            return None

        # 1. Check requested model
        if requested_model:
            matched = match_model(requested_model)
            if matched:
                return matched
            logger.warning(f"Requested model '{requested_model}' not installed locally.")

        # 2. Check default configured model
        matched_default = match_model(self.default_model)
        if matched_default:
            return matched_default

        # 3. Check fallback models
        for fb in self.fallback_models:
            matched_fb = match_model(fb)
            if matched_fb:
                logger.info(f"Using fallback local model: {matched_fb}")
                return matched_fb

        # 4. Check if any model exists at all
        if installed_names:
            first_avail = installed_names[0]
            logger.info(f"Using first available local model: {first_avail}")
            return first_avail

        # 5. No models found
        instructions = self.get_model_download_instructions()
        raise ModelNotFoundError(
            f"No local models are currently installed in Ollama.\n"
            f"To fix this, download a recommended model using the terminal:\n"
            f"  ollama pull llama3.2:1b    (Ultra-fast, ~1.3 GB, 4-8 GB RAM)\n"
            f"  ollama pull qwen2.5:0.5b   (Lightweight, ~400 MB, any PC)\n"
            f"  ollama pull llama3.2:3b    (Recommended standard, ~2.0 GB)\n"
        )

    def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Generates text completion using the local Ollama instance.
        """
        target_model = self.resolve_model(model)
        temp = temperature if temperature is not None else self.temperature

        payload = {
            "model": target_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temp,
                "num_predict": self.max_tokens
            }
        }
        if system_prompt:
            payload["system"] = system_prompt

        start_time = time.time()
        try:
            logger.info(f"Submitting prompt to local model: {target_model}")
            resp = requests.post(
                f"{self.endpoint}/api/generate",
                json=payload,
                timeout=self.timeout
            )
            elapsed_sec = round(time.time() - start_time, 2)

            if resp.status_code == 200:
                data = resp.json()
                eval_count = data.get("eval_count", 0)
                eval_duration = data.get("eval_duration", 0)
                # Calculate tokens per second if available
                tok_per_sec = 0.0
                if eval_duration > 0 and eval_count > 0:
                    tok_per_sec = round(eval_count / (eval_duration / 1e9), 1)

                return {
                    "success": True,
                    "model": target_model,
                    "response": data.get("response", "").strip(),
                    "total_duration_sec": elapsed_sec,
                    "tokens_generated": eval_count,
                    "tokens_per_second": tok_per_sec,
                    "local_inference": True
                }
            else:
                return {
                    "success": False,
                    "error": f"Ollama generation failed (HTTP {resp.status_code}): {resp.text}"
                }
        except requests.exceptions.ConnectionError:
            raise RuntimeUnavailableError(
                f"Could not connect to Ollama at {self.endpoint}. Is 'ollama serve' running?"
            )
        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": f"Inference timed out after {self.timeout}s. For faster responses, consider a smaller model like llama3.2:1b."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Inference error: {str(e)}"
            }

    def chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Executes multi-turn conversation completion using Ollama's chat API.
        """
        target_model = self.resolve_model(model)
        temp = temperature if temperature is not None else self.temperature

        payload = {
            "model": target_model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temp,
                "num_predict": self.max_tokens
            }
        }

        start_time = time.time()
        try:
            logger.info(f"Submitting chat messages to local model: {target_model}")
            resp = requests.post(
                f"{self.endpoint}/api/chat",
                json=payload,
                timeout=self.timeout
            )
            elapsed_sec = round(time.time() - start_time, 2)

            if resp.status_code == 200:
                data = resp.json()
                msg = data.get("message", {})
                eval_count = data.get("eval_count", 0)
                eval_duration = data.get("eval_duration", 0)
                tok_per_sec = 0.0
                if eval_duration > 0 and eval_count > 0:
                    tok_per_sec = round(eval_count / (eval_duration / 1e9), 1)

                return {
                    "success": True,
                    "model": target_model,
                    "message": msg,
                    "content": msg.get("content", "").strip(),
                    "total_duration_sec": elapsed_sec,
                    "tokens_generated": eval_count,
                    "tokens_per_second": tok_per_sec,
                    "local_inference": True
                }
            else:
                return {
                    "success": False,
                    "error": f"Ollama chat failed (HTTP {resp.status_code}): {resp.text}"
                }
        except requests.exceptions.ConnectionError:
            raise RuntimeUnavailableError(
                f"Could not connect to Ollama at {self.endpoint}. Is 'ollama serve' running?"
            )
        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": f"Inference timed out after {self.timeout}s."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Chat error: {str(e)}"
            }

    @staticmethod
    def get_model_download_instructions() -> Dict[str, Any]:
        """
        Provides user instructions for installing open-source models
        and explains hardware considerations (RAM, VRAM, GPU backends).
        """
        return {
            "summary": "ICLAS uses 100% free, local, open-weight models without cloud subscriptions.",
            "recommended_models": [
                {
                    "name": "llama3.2:1b",
                    "command": "ollama pull llama3.2:1b",
                    "size": "1.3 GB",
                    "requirements": "4 GB - 8 GB RAM (runs comfortably on almost any laptop/desktop)",
                    "best_for": "Fast analysis, summarization, low-latency conversational queries"
                },
                {
                    "name": "qwen2.5:0.5b",
                    "command": "ollama pull qwen2.5:0.5b",
                    "size": "397 MB",
                    "requirements": "2 GB RAM (ultra-lightweight test model)",
                    "best_for": "Quick verification, minimal hardware footprint"
                },
                {
                    "name": "llama3.2:3b",
                    "command": "ollama pull llama3.2:3b",
                    "size": "2.0 GB",
                    "requirements": "8 GB - 16 GB RAM or 4 GB GPU VRAM",
                    "best_for": "Balanced synthesis, complex financial reasoning, root-cause extraction"
                },
                {
                    "name": "mistral:7b",
                    "command": "ollama pull mistral:7b",
                    "size": "4.1 GB",
                    "requirements": "16 GB RAM or 6 GB+ GPU VRAM",
                    "best_for": "Deep corporate governance analysis, lengthy report synthesis"
                }
            ],
            "hardware_explanation": (
                "The speed and accuracy of a local AI model depend directly on:\n"
                "1. Model Parameter Size: 1B/3B parameters run at high tokens/second on standard CPUs;\n"
                "   7B/8B parameters perform best when offloaded to GPU VRAM.\n"
                "2. Quantization: Standard 4-bit quantization (Q4_K_M) reduces RAM usage by ~70%\n"
                "   with virtually no loss in corporate reasoning quality.\n"
                "3. Inference Backend: Ollama automatically detects NVIDIA CUDA, AMD ROCm, or Intel CPU\n"
                "   AVX-512 extensions to maximize throughput without manual driver configuration."
            )
        }
