"""
ICLAS Phase 3 Acceptance Verification Script
Tests all acceptance criteria for:
1. Local AI runtime connectivity
2. Local model text generation (no cloud/paid API keys)
3. Allowed public web source retrieval (SEC EDGAR & permitted web resources)
4. Title and readable content extraction (Trafilatura, BeautifulSoup, JSON parser)
5. Responsible restriction and error handling for unpermitted sources
"""

import os
import sys
import json
import time

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from collector import ResponsibleCollector
from local_llm import LocalLLMAdapter


def run_all_tests():
    print("=" * 80)
    print("  ICLAS PHASE 3 INFRASTRUCTURE VERIFICATION")
    print("  Public-Web Data Collection & Local AI Runtime (No Paid API Keys)")
    print("=" * 80)
    
    results = {
        "ac1_runtime_reachable": False,
        "ac2_model_generation": False,
        "ac3_permitted_retrieval": False,
        "ac4_content_extraction": False,
        "ac5_error_handling": False
    }

    # ---------------------------------------------------------
    # TEST 1: Check Local AI Runtime Connectivity (AC 1)
    # ---------------------------------------------------------
    print("\n[TEST 1] Verifying Local AI Runtime Connectivity (Ollama)...")
    llm = LocalLLMAdapter()
    runtime_status = llm.check_runtime()
    print(f"Runtime Status: {json.dumps(runtime_status, indent=2)}")
    
    if runtime_status.get("online"):
        results["ac1_runtime_reachable"] = True
        print(">>> SUCCESS: Local AI runtime (Ollama) reached successfully.")
    else:
        print(">>> FAILED: Could not reach Ollama runtime.")

    # ---------------------------------------------------------
    # TEST 2: Generate Response with Installed Local Model (AC 2)
    # ---------------------------------------------------------
    print("\n[TEST 2] Verifying Model Inference & Generation (Zero Paid API Keys)...")
    try:
        active_model = llm.resolve_model()
        print(f"Resolved active local model: '{active_model}'")
        
        test_prompt = "In 2 concise bullet points, what are the primary early indicators of corporate liquidity distress?"
        print(f"Prompt: \"{test_prompt}\"")
        
        gen_result = llm.generate(
            prompt=test_prompt,
            system_prompt="You are a senior corporate turnaround analyst for ICLAS. Respond clearly and concisely.",
            model=active_model,
            temperature=0.2
        )
        
        if gen_result.get("success"):
            results["ac2_model_generation"] = True
            print(f">>> SUCCESS: Model '{gen_result.get('model')}' generated response in {gen_result.get('total_duration_sec')}s "
                  f"({gen_result.get('tokens_generated')} tokens @ {gen_result.get('tokens_per_second')} tok/sec):")
            print("-" * 60)
            print(gen_result.get("response"))
            print("-" * 60)
        else:
            print(f">>> FAILED: Generation error: {gen_result.get('error')}")
    except Exception as e:
        print(f">>> FAILED: Model generation threw exception: {e}")

    # ---------------------------------------------------------
    # TEST 3 & 4: Retrieve Allowed Public Source & Extract Content (AC 3 & 4)
    # ---------------------------------------------------------
    print("\n[TEST 3 & 4] Verifying Allowed Public Corporate Source Collection & Extraction...")
    collector = ResponsibleCollector()
    
    # Official SEC EDGAR Public Filing Submissions API (Apple Inc. CIK 0000320193)
    # Uses official SEC User-Agent header (no SEC API key required)
    target_url = "https://data.sec.gov/submissions/CIK0000320193.json"
    print(f"Testing permitted public source (SEC EDGAR): {target_url}")
    print(f"Identifying User-Agent: {collector.sec_ua}")
    
    fetch_result = collector.fetch_url(target_url, force_refresh=True)
    
    print(f"Fetch Status: {fetch_result.get('status')}")
    print(f"Status Code: {fetch_result.get('status_code')}")
    print(f"Domain: {fetch_result.get('domain')}")
    print(f"Title Extracted: '{fetch_result.get('title')}'")
    print(f"Content Type: {fetch_result.get('content_type')}")
    print(f"Downloaded Bytes: {fetch_result.get('byte_size')}")
    
    if fetch_result.get("status") in ("success", "cached") and fetch_result.get("status_code") == 200:
        results["ac3_permitted_retrieval"] = True
        print(">>> SUCCESS: Permitted public source retrieved successfully without API keys.")
    else:
        print(f">>> FAILED: Could not retrieve permitted source: {fetch_result.get('error')}")
        
    content_len = len(fetch_result.get("content", ""))
    if content_len > 100 and fetch_result.get("title"):
        results["ac4_content_extraction"] = True
        print(f">>> SUCCESS: Extracted clean readable text ({content_len} characters) and title.")
        print("-" * 60)
        print("Content Preview:")
        preview = fetch_result.get("content", "")[:500]
        print(preview + ("..." if len(fetch_result.get("content", "")) > 500 else ""))
        print("-" * 60)
    else:
        print(">>> FAILED: Content extraction returned empty or incomplete data.")

    # HTML Web Extraction verification
    print("\n[TEST 3b] Verifying HTML Web Page Extraction (Trafilatura & BeautifulSoup)...")
    html_url = "https://huggingface.co/datasets"
    print(f"Testing permitted HTML page: {html_url}")
    html_result = collector.fetch_url(html_url, force_refresh=True)
    print(f"HTML Fetch Status: {html_result.get('status')}, Title: '{html_result.get('title')}', Bytes: {html_result.get('byte_size')}")

    # ---------------------------------------------------------
    # TEST 5: Verify Error Handling for Blocked / Unavailable Sources (AC 5)
    # ---------------------------------------------------------
    print("\n[TEST 5] Verifying Rejection and Useful Errors for Unpermitted / Unavailable Sources...")
    blocked_url = "https://unauthorized-random-website.org/leaks"
    print(f"Testing unpermitted domain: {blocked_url}")
    
    blocked_result = collector.fetch_url(blocked_url)
    print(f"Blocked URL Result Status: {blocked_result.get('status')}")
    print(f"Error Message: {blocked_result.get('error')}")
    
    if blocked_result.get("status") == "blocked" and "permitted public source registry" in blocked_result.get("error", ""):
        results["ac5_error_handling"] = True
        print(">>> SUCCESS: Indiscriminate web collection blocked with clear, informative error.")
    else:
        print(">>> FAILED: Unpermitted domain was not properly rejected.")

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------
    print("\n" + "=" * 80)
    print("  VERIFICATION SUMMARY")
    print("=" * 80)
    all_passed = True
    for ac, passed in results.items():
        status = "PASSED [OK]" if passed else "FAILED [X]"
        print(f"  {ac.upper():<30} : {status}")
        if not passed:
            all_passed = False
            
    print("=" * 80)
    if all_passed:
        print("ALL 5 ACCEPTANCE CRITERIA MET SUCCESSFULLY!")
    else:
        print("SOME TESTS DID NOT PASS. Review the logs above.")
    print("=" * 80)
    
    return all_passed


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
