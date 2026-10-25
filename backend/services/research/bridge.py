"""
ICLAS Research Bridge CLI
Exposes responsible public-web collection and local LLM runtime features
as a clean JSON CLI & stdin interface for backend routers and services.
"""

import os
import sys
import json
import argparse

# Ensure current directory is accessible
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from collector import ResponsibleCollector
from local_llm import LocalLLMAdapter


def handle_payload(payload: dict):
    collector = ResponsibleCollector()
    llm = LocalLLMAdapter()

    action = payload.get("action") or payload.get("command")

    if action == "check":
        runtime = llm.check_runtime()
        installed = llm.list_installed_models()
        guidance = llm.get_model_download_instructions()
        return {
            "runtime": runtime,
            "installed_models": installed,
            "guidance": guidance
        }

    elif action == "hardware":
        return llm.get_model_download_instructions()

    elif action == "sources":
        return {
            "permitted_domains": sorted(list(collector.permitted_domains)),
            "curated_feeds": collector.config.get("curated_public_feeds", []),
            "responsible_policy": {
                "rate_limit_delay_seconds": collector.min_delay,
                "max_response_size_bytes": collector.max_size_bytes,
                "sec_edgar_user_agent": collector.sec_ua,
                "default_user_agent": collector.default_ua,
                "cache_ttl_seconds": collector.cache_ttl
            }
        }

    elif action == "fetch":
        url = payload.get("url")
        refresh = payload.get("refresh", False)
        if not url:
            return {"status": "error", "error": "URL parameter missing in request payload"}
        return collector.fetch_url(url, force_refresh=refresh)

    elif action == "generate":
        prompt = payload.get("prompt", "")
        system = payload.get("system")
        model = payload.get("model")
        temp = payload.get("temperature", 0.2)
        return llm.generate(
            prompt=prompt,
            system_prompt=system,
            model=model,
            temperature=temp
        )

    elif action == "chat":
        messages = payload.get("messages", [])
        model = payload.get("model")
        temp = payload.get("temperature", 0.2)
        return llm.chat(
            messages=messages,
            model=model,
            temperature=temp
        )

    else:
        return {"status": "error", "error": f"Unknown action: {action}"}


def main():
    # If stdin is not a tty and has content, read JSON from stdin
    if not sys.stdin.isatty():
        try:
            stdin_content = sys.stdin.read().strip()
            if stdin_content:
                payload = json.loads(stdin_content)
                result = handle_payload(payload)
                print(json.dumps(result, indent=2))
                return
        except Exception as e:
            print(json.dumps({"status": "error", "error": f"Failed reading stdin: {str(e)}"}, indent=2))
            sys.exit(1)

    # Otherwise fallback to CLI arguments
    parser = argparse.ArgumentParser(description="ICLAS Public-Web & Local AI Bridge")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")

    subparsers.add_parser("check", help="Check local LLM runtime and installed models")
    subparsers.add_parser("hardware", help="Get hardware, VRAM, and model guidance")
    subparsers.add_parser("sources", help="List permitted domains and curated public feeds")

    fetch_parser = subparsers.add_parser("fetch", help="Responsibly fetch public source")
    fetch_parser.add_argument("--url", required=True, help="URL to fetch")
    fetch_parser.add_argument("--refresh", action="store_true", help="Force cache refresh")

    gen_parser = subparsers.add_parser("generate", help="Generate response via local LLM")
    gen_parser.add_argument("--prompt", required=True, help="Prompt text")
    gen_parser.add_argument("--system", default=None, help="System instructions")
    gen_parser.add_argument("--model", default=None, help="Model name")
    gen_parser.add_argument("--temp", type=float, default=0.2, help="Temperature")

    chat_parser = subparsers.add_parser("chat", help="Chat with local LLM")
    chat_parser.add_argument("--messages", required=True, help="JSON encoded array of messages")
    chat_parser.add_argument("--model", default=None, help="Model name")
    chat_parser.add_argument("--temp", type=float, default=0.2, help="Temperature")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    try:
        if args.command == "check":
            res = handle_payload({"action": "check"})
        elif args.command == "hardware":
            res = handle_payload({"action": "hardware"})
        elif args.command == "sources":
            res = handle_payload({"action": "sources"})
        elif args.command == "fetch":
            res = handle_payload({"action": "fetch", "url": args.url, "refresh": args.refresh})
        elif args.command == "generate":
            res = handle_payload({"action": "generate", "prompt": args.prompt, "system": args.system, "model": args.model, "temperature": args.temp})
        elif args.command == "chat":
            res = handle_payload({"action": "chat", "messages": json.loads(args.messages), "model": args.model, "temperature": args.temp})
        
        print(json.dumps(res, indent=2))
    except Exception as e:
        print(json.dumps({"status": "error", "error": str(e)}, indent=2))
        sys.exit(1)


if __name__ == "__main__":
    main()
