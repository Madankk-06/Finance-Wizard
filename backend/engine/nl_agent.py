"""
engine/nl_agent.py — Phase 8: Autonomous Natural Language Financial Query Agent

Integrates:
1. Dynamic factual context injection from encrypted SQLite batch records (Gross, Net, Fees, Exceptions, Resolution status & notes).
2. Comprehensive financial & domain knowledge (Required files, 4-tier matching, MDR/GST/TDS calculation, counterfactuals).
3. Groq LLM (openai/gpt-oss-120b / openai/gpt-oss-20b) producing accurate, contextual plain-text answers (strictly zero markdown asterisks).
"""

from __future__ import annotations

import re
import json
from typing import Any, Optional
from database import get_conn, cipher
from routers.classify import _row_to_dict
from engine.groq_client import call_groq_phrasing

# Comprehensive System Knowledge Base for Finance Wizard
FINANCE_WIZARD_SYSTEM_KNOWLEDGE = """
You are Finance Wizard, an autonomous reconciliation intelligence platform for multi-source financial auditing (Track 04).

Key Domain & Architecture Facts:
1. Required Source Documents (3 CSV files):
   - Settlement Report (settlement.csv): Payment gateway settlement data containing settlement_id, order_id, payment_id, gross_amount, mdr_fee, gst_on_mdr, tds_amount, net_settlement_amount, settlement_date, merchant_id, status.
   - Bank Statement (bank_statement.csv): Bank feed containing bank_utr, credit_amount, credit_date, narration, account_number.
   - Internal Ledger (ledger.csv): Merchant ERP / OMS records containing order_id, gross_amount, expected_net_settlement, order_date, merchant_id, product_category.

2. Matching Architecture (4 Tiers):
   - Tier 1: Exact join on settlement_id, UTR, order_id, payment_id.
   - Tier 2: Many-to-one (lumped settlements where consolidated batch credit equals sum of orders sharing settlement_id).
   - Tier 3: Split tranches (multi-part settlements).
   - Tier 4: Fuzzy matching (date window +/- 3 days and exact amount tolerance).

3. Fee & Tax Calculation:
   - MDR (Merchant Discount Rate): Standard 2.0% of Gross.
   - GST on MDR: 18% of MDR fee (Goods and Services Tax).
   - TDS: 1.0% of Gross under Section 194-O (Tax Deducted at Source).
   - Expected Net = Gross - MDR - GST - TDS.

4. 11-Priority Classification Rules:
   - APPROVE: MATCHED (0 diff), FEE_DEDUCTION (diff == MDR+GST), TAX_DEDUCTION (diff == TDS), ROUNDING (|diff| <= 5), LUMPED_BATCH_MATCHED, EDGE_DELAYED_REFUND, EDGE_SPLIT_SETTLEMENT.
   - HOLD: TIMING_DELAY (settlement date > T+3 delay, awaiting banking clearance).
   - ESCALATE: PARTIAL_PAYMENT (partial deposit), UNEXPLAINED (unaccounted gap), EDGE_POST_RECON_CHARGEBACK (customer bank clawback).

5. Specialized Engines:
   - Phase 4 Automated Investigative Agent: Diagnoses root causes with 6 forensic tools, generates dispute representment letters.
   - Financial Memory: Indexes variance patterns and user manual approvals into reusable rules.
   - Cash Waterfall & Counterfactual Simulator: Computes Realized Net vs Expected Net, Optimistic / Pessimistic recovery models.
   - Security: AES-256-GCM field encryption at rest.
"""

ASK_SUGGESTIONS = [
    "What files need to be uploaded to run reconciliation?",
    "Why was ORD1055 escalated and how much is missing?",
    "What is our total gross inflow and net bank realization?",
    "How does the 4-pass deterministic match engine work?",
    "How much money is locked in partial payments and disputes?",
    "Show me a breakdown of all fee and tax deductions.",
    "Which orders experienced settlement delays greater than 5 days?",
    "Explain how GST and TDS are calculated on settlements.",
]


# ── Deterministic Query Tools for Active Batches ─────────────────────────────

def tool_get_order(records: list[dict], order_id: str) -> Optional[dict]:
    return next((r for r in records if r["order_id"].upper() == order_id.upper()), None)


def tool_list_escalations(records: list[dict]) -> list[dict]:
    return [r for r in records if r["decision"] == "ESCALATE"]


def tool_sum_pending(records: list[dict]) -> float:
    return round(sum(r["difference"] for r in records if r["decision"] == "ESCALATE" and r["difference"] > 0), 2)


def tool_sum_settled(records: list[dict]) -> float:
    return round(sum(r["effective_bank"] for r in records if r["decision"] == "APPROVE"), 2)


def tool_get_kpis(records: list[dict]) -> dict[str, Any]:
    total = len(records)
    approved = sum(1 for r in records if r["decision"] == "APPROVE")
    held = sum(1 for r in records if r["decision"] == "HOLD")
    escalated = sum(1 for r in records if r["decision"] == "ESCALATE")
    gross = round(sum(r["gross_amount"] for r in records), 2)
    net = round(sum(r["effective_bank"] for r in records), 2)
    match_rate = round((approved / total) * 100, 1) if total > 0 else 0.0
    return {
        "total_orders": total,
        "approved_count": approved,
        "held_count": held,
        "escalated_count": escalated,
        "gross_amount": gross,
        "net_amount": net,
        "match_rate_pct": match_rate,
    }


def tool_get_fee_summary(records: list[dict]) -> dict[str, float]:
    return {
        "total_gross": round(sum(r["gross_amount"] for r in records), 2),
        "total_mdr": round(sum(r["mdr_fee"] for r in records), 2),
        "total_gst": round(sum(r["gst_on_mdr"] for r in records), 2),
        "total_tds": round(sum(r["tds_amount"] for r in records), 2),
    }


# ── Main NL Query Processor ───────────────────────────────────────────────────

def answer_natural_language_query(
    query: str,
    batch_id: Optional[str] = None,
) -> dict[str, Any]:
    """
    Intelligently answers both generic financial questions and live batch/order queries.
    Uses Groq LLM with rich deterministic facts and strict zero-markdown plain text formatting.
    """
    q = query.strip()

    # 1. Retrieve batch records if batch_id is active
    records: list[dict] = []
    if batch_id:
        with get_conn() as conn:
            rows = conn.execute("SELECT * FROM classified_results WHERE batch_id = ?", (batch_id,)).fetchall()
            records = [_row_to_dict(r) for r in rows]

    # 2. Check for specific Order ID mention (e.g. ORD1055)
    order_match = re.search(r"\b(ORD\d{3,5})\b", q, re.IGNORECASE)
    target_order: Optional[dict] = None
    target_oid: Optional[str] = None
    if order_match:
        target_oid = order_match.group(1).upper()
        if records:
            target_order = tool_get_order(records, target_oid)

    # 3. Assemble dynamic context packet
    context_lines = []
    if records:
        kpis = tool_get_kpis(records)
        fees = tool_get_fee_summary(records)
        escalated_list = tool_list_escalations(records)
        resolved_list = [r for r in records if r.get("resolved")]
        
        context_lines.append(f"Active Reconciled Batch: {batch_id[:8]} with {kpis['total_orders']} total records.")
        esc_summaries = []
        for r in escalated_list:
            is_res = r.get("resolved", False)
            esc_summaries.append(f"{r['order_id']} ({r['category']}, diff ₹{r['difference']:.2f}, resolved={is_res})")
        context_lines.append(f"Escalated Orders ({len(escalated_list)}): {', '.join(esc_summaries)}")
        
        if resolved_list:
            res_summaries = []
            for r in resolved_list:
                r_note = r.get("resolved_note", "Resolved by analyst")
                res_summaries.append(f"{r['order_id']} (Note: '{r_note}')")
            context_lines.append(f"User Resolved Orders: {'; '.join(res_summaries)}")

        if target_order:
            t_utr = target_order.get("utr") or "Pending"
            t_res = target_order.get("resolved", False)
            t_note = target_order.get("resolved_note") or "None"
            t_log = json.dumps(target_order.get("agent_reasoning_log") or [])
            context_lines.append(
                f"TARGET ORDER SPECIFICS: Order ID: {target_order['order_id']}, Category: {target_order['category']}, Decision: {target_order['decision']}, "
                f"Gross: ₹{target_order['gross_amount']:,.2f}, Expected Net: ₹{target_order['ledger_expected']:,.2f}, Actual Received: ₹{target_order['effective_bank']:,.2f} under UTR {t_utr}, "
                f"Difference: ₹{target_order['difference']:,.2f}, Resolved: {t_res}, "
                f"Resolved Note: '{t_note}', "
                f"Investigation Log: {t_log}"
            )
        elif target_oid:
            context_lines.append(f"TARGET ORDER: {target_oid} was NOT found in this batch of {len(records)} records.")
    else:
        context_lines.append("No active reconciliation batch is currently loaded in this session.")

    context_str = "\n".join(context_lines)

    # 4. Build System & User Prompts for Groq LLM
    system_prompt = (
        f"{FINANCE_WIZARD_SYSTEM_KNOWLEDGE}\n\n"
        "You are Finance Wizard, an expert AI financial reconciliation assistant.\n"
        "You answer conceptual financial questions, system workflow questions, and specific batch/order questions with absolute precision.\n"
        "Rules:\n"
        "- Respond in plain natural sentences (2-4 sentences).\n"
        "- Do NOT use markdown bolding (no **). Do NOT use asterisks.\n"
        "- If the user asks a general or conceptual financial question (e.g. 'what is GST', 'what is MDR', 'how does TDS work', 'what files do I upload'), give a clear, accurate explanation.\n"
        "- If the user asks about the current batch, order figures, or escalations, use ONLY the verified facts from the Context.\n"
        "- If an order is resolved, explicitly mention that it is resolved and cite the user's resolution note.\n"
        "- If the user asks about a specific order that is not in context and no batch is loaded, tell them to upload files and reconcile first."
    )

    user_prompt = f"Context Information:\n{context_str}\n\nUser Question: {query}"

    # 5. Call Groq LLM for intelligent, grounded response
    groq_answer = call_groq_phrasing(user_prompt, system_prompt=system_prompt)

    if groq_answer:
        # Clean any remaining markdown bolding if any
        cleaned_answer = groq_answer.replace("**", "").replace("__", "").replace("###", "").strip()
        
        response_payload = {
            "query": query,
            "answer": cleaned_answer,
            "intent": "GROQ_FINANCIAL_AI",
            "sources": [target_oid] if target_oid else [],
            "numbers": {},
        }
        if target_order:
            response_payload["order_id"] = target_oid
            response_payload["data"] = target_order
            response_payload["numbers"] = {
                "gross": target_order["gross_amount"],
                "expected": target_order["ledger_expected"],
                "actual": target_order["effective_bank"],
                "difference": target_order["difference"],
                "resolved": target_order.get("resolved", False),
            }
        return response_payload

    # 6. Fallback (Only if Groq is completely offline)
    fallback_answer = (
        f"Finance Wizard reconciles multi-source financial feeds across Settlement Reports, Bank Statements, and Ledgers. "
        f"For batch {batch_id[:8] if batch_id else 'None'}, you can ask about specific order IDs, fee deductions, or cash positions."
    )
    return {
        "query": query,
        "answer": fallback_answer,
        "intent": "FALLBACK",
        "sources": [],
        "numbers": {},
    }
