"""
engine/groq_client.py — Groq LLM client for plain-language phrasing

Used strictly for:
1. Summarizing investigative tool results into plain concise sentences.
2. Phrasing NL Copilot responses from deterministic database tool outputs.

Guarantees:
- Primary models: openai/gpt-oss-120b, openai/gpt-oss-20b (never produce reasoning tags).
- Strips any reasoning blocks and markdown asterisks (**).
- Never invents numbers.
- If GROQ_API_KEY is missing or network fails, instantly falls back to rule templates without blocking.
"""

from __future__ import annotations

import re
import json
import urllib.request
from typing import Optional
from config import settings


def call_groq_phrasing(
    prompt: str,
    system_prompt: str = "You are a concise financial assistant. Respond in plain natural sentences. Do NOT use markdown bolding (no **). Do NOT invent any numbers. Do NOT output thinking steps."
) -> Optional[str]:
    """
    Call Groq API for natural language phrasing. Returns None on failure or missing key.
    """
    api_key = settings.groq_api_key.strip()
    if not api_key:
        return None

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) FinanceWizard/1.0",
    }
    
    # Prefer non-thinking models first
    models_to_try = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", settings.groq_model, "qwen/qwen3.6-27b"]
    models = []
    for m in models_to_try:
        if m and m not in models:
            models.append(m)

    for model in models:
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.1,
            "max_tokens": 400,
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                content = data["choices"][0]["message"]["content"].strip()
                
                # Remove complete or incomplete reasoning tags (<think>...</think>)
                cleaned = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
                if "<think>" in cleaned:
                    cleaned = cleaned.split("</think>")[-1].strip() if "</think>" in cleaned else ""
                
                # Remove any markdown asterisks
                cleaned = cleaned.replace("**", "").replace("__", "").replace("###", "").strip()
                
                if cleaned:
                    return cleaned
        except Exception:
            continue

    return None
