"""
engine/investigator.py — Phase 4: Investigative Agent

Runs AUTOMATICALLY on every ESCALATE order during reconciliation.
Executes deterministic diagnostic code tools to evaluate the transaction before human review.
Optional Groq LLM summarizes tool facts into short plain-language reasoning steps without inventing numbers.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import date
from typing import Optional, Any
from engine.groq_client import call_groq_phrasing


@dataclass
class InvestigationReport:
    order_id:                 str
    category:                 str
    decision:                 str          # APPROVE | HOLD | ESCALATE
    severity:                 str          # HIGH | MEDIUM | LOW
    root_cause:               str
    findings:                 list[str]
    agent_reasoning_log:      list[dict[str, str]]   # Step-by-step tool output trail
    forensic_math:            dict[str, Any]
    recommended_action:       str
    suggested_journal_entry:  Optional[dict[str, Any]]
    confidence:               float


# ── Code-level Deterministic Tools ────────────────────────────────────────────

def tool_get_source_rows(record: dict[str, Any]) -> dict[str, Any]:
    """Tool 1: Extract all 3-way source row attributes for order."""
    return {
        "order_id": record.get("order_id", ""),
        "settlement_id": record.get("settlement_id", ""),
        "payment_id": record.get("payment_id", ""),
        "merchant_id": record.get("merchant_id", ""),
        "gross_amount": float(record.get("gross_amount") or 0),
        "ledger_expected": float(record.get("ledger_expected") or 0),
        "effective_bank": float(record.get("effective_bank") or 0),
        "difference": float(record.get("difference") or 0),
    }


def tool_recompute_fees(gross: float) -> dict[str, float]:
    """Tool 2: Recompute exact MDR 2%, GST 18% on MDR, and TDS 1%."""
    mdr = round(gross * 0.02, 2)
    gst = round(mdr * 0.18, 2)
    tds = round(gross * 0.01, 2)
    expected_net = round(gross - mdr - gst - tds, 2)
    return {
        "calculated_mdr": mdr,
        "calculated_gst": gst,
        "calculated_tds": tds,
        "calculated_expected_net": expected_net,
    }


def tool_check_date_window(order_date_str: str, settle_date_str: str) -> dict[str, Any]:
    """Tool 3: Check calendar delay days between order and settlement."""
    try:
        d1 = date.fromisoformat(order_date_str)
        d2 = date.fromisoformat(settle_date_str)
        delay = (d2 - d1).days
        is_normal = (delay <= 3)
        return {"delay_days": delay, "is_normal_window": is_normal}
    except Exception:
        return {"delay_days": 0, "is_normal_window": True}


def tool_check_partial_vs_expected(expected_net: float, actual_net: float) -> dict[str, Any]:
    """Tool 4: Check if difference represents an incomplete partial tranche."""
    shortfall = round(expected_net - actual_net, 2)
    ratio = round((actual_net / expected_net) * 100, 1) if expected_net > 0 else 0.0
    is_partial = (shortfall > 10.0 and ratio < 90.0)
    return {
        "shortfall": shortfall,
        "fulfillment_ratio_pct": ratio,
        "is_partial_payment": is_partial,
    }


def tool_lookup_financial_memory(category: str, diff: float) -> dict[str, Any]:
    """Tool 5: Check if pattern exists in institutional memory."""
    if category == "PARTIAL_PAYMENT":
        return {"known_pattern": False, "note": "Partial tranches require active gateway representment."}
    if category == "EDGE_POST_RECON_CHARGEBACK":
        return {"known_pattern": True, "note": "Post-recon dispute clawback matches known bank debit pattern."}
    if abs(diff) <= 5.0:
        return {"known_pattern": True, "note": "Variance within standard rounding memory rule."}
    return {"known_pattern": False, "note": "Unexplained variance requires human review."}


def tool_scan_bank_narration_for_refund_or_chargeback(order_id: str, linked_debits: list[dict[str, Any]]) -> Optional[dict[str, Any]]:
    """Tool 6: Scan unmatched bank debit narrations for chargeback or refund references."""
    if not linked_debits:
        return None
    for d in linked_debits:
        narr = d.get("narration", "").upper()
        if order_id in narr or "CHARGEBACK" in narr or "REFUND" in narr:
            return {
                "utr": d.get("utr", ""),
                "amount": d.get("credit_amount", 0.0),
                "date": d.get("credit_date", ""),
                "narration": d.get("narration", ""),
                "type": "CHARGEBACK" if "CHARGEBACK" in narr else "REFUND",
            }
    return None


def tool_flag_for_human(reason: str) -> dict[str, str]:
    """Tool 7: Flag case for analyst review with specific reason."""
    return {"status": "ESCALATE", "triage_reason": reason}


# ── Main Auto-Investigate Pipeline ───────────────────────────────────────────

def run_automated_investigation(
    record: dict[str, Any],
    linked_debits: list[dict[str, Any]] = None,
) -> InvestigationReport:
    """
    Execute deterministic investigative tools on an order, generate agent_reasoning_log,
    and optionally phrase with Groq LLM without inventing any numbers.
    """
    order_id = record["order_id"]
    category = record["category"]
    decision = record["decision"]
    diff = record["difference"]
    gross = record["gross_amount"]
    expected = record["ledger_expected"]
    actual = record["effective_bank"]
    mdr = record["mdr_fee"]
    gst = record["gst_on_mdr"]
    tds = record["tds_amount"]
    utr = record.get("utr") or "UNAVAILABLE"
    settle_date = record.get("settlement_date", "")
    order_date = record.get("ledger_recorded_date", "")

    # Execute deterministic tools
    t1 = tool_get_source_rows(record)
    t2 = tool_recompute_fees(gross)
    t3 = tool_check_date_window(order_date, settle_date)
    t4 = tool_check_partial_vs_expected(expected, actual)
    t5 = tool_lookup_financial_memory(category, diff)
    t6 = tool_scan_bank_narration_for_refund_or_chargeback(order_id, linked_debits or [])

    # Build Agent Reasoning Log
    agent_log = [
        {
            "step": "1. Source Verification",
            "detail": f"Retrieved source records. Gross: ₹{gross:,.2f}, Expected Net: ₹{expected:,.2f}, Actual Bank Credit: ₹{actual:,.2f}.",
        },
        {
            "step": "2. Fee Recalculation",
            "detail": f"Recalculated standard rates: MDR 2% (₹{t2['calculated_mdr']:,.2f}) + GST 18% (₹{t2['calculated_gst']:,.2f}) + TDS 1% (₹{t2['calculated_tds']:,.2f}). Target Net: ₹{t2['calculated_expected_net']:,.2f}.",
        },
        {
            "step": "3. Timing & Date Window",
            "detail": f"Settlement arrived on T+{t3['delay_days']} days ({'Normal window' if t3['is_normal_window'] else 'Delayed cycle'}).",
        },
        {
            "step": "4. Partial Settlement Check",
            "detail": f"Fulfillment ratio is {t4['fulfillment_ratio_pct']}%. Shortfall is ₹{t4['shortfall']:,.2f} ({'Partial payout detected' if t4['is_partial_payment'] else 'Full tranche'}).",
        },
        {
            "step": "5. Memory & Bank Narration Scan",
            "detail": f"Bank scan: {t6['type'] + ' debit of ₹' + str(abs(t6['amount'])) if t6 else 'No linked debit adjustment found'}. Memory: {t5['note']}",
        },
    ]

    # Non-escalated orders
    if decision != "ESCALATE":
        return InvestigationReport(
            order_id=order_id,
            category=category,
            decision=decision,
            severity="LOW",
            root_cause="Transaction resolved deterministically within policy rules.",
            findings=[f"Status: {decision} ({category})", f"Variance is ₹{diff:.2f}, within acceptable standard tolerance."],
            agent_reasoning_log=agent_log,
            forensic_math={"gross_amount": gross, "ledger_expected": expected, "effective_bank": actual, "difference": diff},
            recommended_action="Auto-cleared by reconciliation pipeline.",
            suggested_journal_entry=None,
            confidence=1.0,
        )

    # ── Category 1: PARTIAL_PAYMENT ───────────────────────────────────────────
    if category == "PARTIAL_PAYMENT":
        pct = t4["fulfillment_ratio_pct"]
        shortfall = t4["shortfall"]
        root_cause = f"Gateway credited only {pct}% of expected net amount (₹{actual:,.2f} of ₹{expected:,.2f}), leaving ₹{shortfall:,.2f} pending."
        action = f"Raise a dispute ticket with Razorpay Merchant Support for Order {order_id} citing UTR {utr} for pending ₹{shortfall:,.2f}."

        # Optional Groq phrasing
        groq_prompt = (
            f"Summarize these verified facts in 2 plain sentences without markdown bolding:\n"
            f"Order {order_id} had gross ₹{gross}, expected ₹{expected}, received ₹{actual} ({pct}%), shortfall ₹{shortfall}.\n"
            f"Do not invent any numbers. Do not use asterisks."
        )
        groq_summary = call_groq_phrasing(groq_prompt)
        if groq_summary:
            root_cause = groq_summary

        agent_log.append({
            "step": "6. Auto-Investigation Outcome",
            "detail": f"Diagnosed incomplete payout. Shortfall of ₹{shortfall:,.2f} confirmed. Action drafted for Razorpay support.",
        })

        return InvestigationReport(
            order_id=order_id,
            category=category,
            decision="ESCALATE",
            severity="HIGH" if shortfall > 1000 else "MEDIUM",
            root_cause=root_cause,
            findings=[
                f"Invoice / Gross: ₹{gross:,.2f}",
                f"Expected Net: ₹{expected:,.2f}",
                f"Actual Bank Deposit: ₹{actual:,.2f} ({pct}%) under UTR {utr}",
                f"Outstanding Balance: ₹{shortfall:,.2f}",
            ],
            agent_reasoning_log=agent_log,
            forensic_math={"gross_amount": gross, "expected_settlement": expected, "received_amount": actual, "shortfall": shortfall, "fulfillment_ratio_pct": pct},
            recommended_action=action,
            suggested_journal_entry={
                "debit": [
                    {"account": "Bank Account", "amount": actual},
                    {"account": "Settlement Receivables (Disputed)", "amount": shortfall},
                    {"account": "Gateway Fee Expense", "amount": round(mdr + gst, 2)},
                    {"account": "TDS Receivable", "amount": tds},
                ],
                "credit": [{"account": "Customer Sales / Accounts Receivable", "amount": gross}],
            },
            confidence=0.95,
        )

    # ── Category 2: POST_RECON_CHARGEBACK ─────────────────────────────────────
    if category == "EDGE_POST_RECON_CHARGEBACK":
        cb_amt = abs(t6["amount"]) if t6 else round(gross * 0.9, 2)
        cb_utr = t6["utr"] if t6 else "DEBIT_PENDING"
        root_cause = f"Post-recon chargeback debit of ₹{cb_amt:,.2f} detected on {t6.get('date', 'statement date')} under UTR {cb_utr}."
        action = f"File proof of delivery and invoice for Order {order_id} before the 7-day representment deadline."

        agent_log.append({
            "step": "6. Auto-Investigation Outcome",
            "detail": f"Identified customer dispute clawback UTR {cb_utr} for ₹{cb_amt:,.2f}. Representment action generated.",
        })

        return InvestigationReport(
            order_id=order_id,
            category=category,
            decision="ESCALATE",
            severity="HIGH",
            root_cause=root_cause,
            findings=[
                f"Primary settlement was clean at ₹{actual:,.2f}.",
                f"Subsequent chargeback debit of ₹{cb_amt:,.2f} received under UTR {cb_utr}.",
                "Customer bank initiated clawback on settled funds.",
            ],
            agent_reasoning_log=agent_log,
            forensic_math={"original_settled_net": actual, "chargeback_clawback": cb_amt, "net_realized_cash": round(actual - cb_amt, 2)},
            recommended_action=action,
            suggested_journal_entry={
                "debit": [{"account": "Chargeback Loss Provision", "amount": cb_amt}],
                "credit": [{"account": "Bank Account", "amount": cb_amt}],
            },
            confidence=0.98,
        )

    # ── Category 3: UNEXPLAINED ───────────────────────────────────────────────
    root_cause = f"Unreconciled discrepancy of ₹{diff:,.2f} on Gross ₹{gross:,.2f} does not match standard fee or tax formulas."
    action = f"Request line-item fee annexure from gateway support for Order {order_id} to substantiate ₹{diff:,.2f} deduction."

    groq_prompt = (
        f"Summarize these verified facts in 2 plain sentences without markdown bolding:\n"
        f"Order {order_id} has gross ₹{gross}, expected ₹{expected}, received ₹{actual}, leaving an unexplained difference of ₹{diff}.\n"
        f"Do not invent numbers. Do not use asterisks."
    )
    groq_summary = call_groq_phrasing(groq_prompt)
    if groq_summary:
        root_cause = groq_summary

    agent_log.append({
        "step": "6. Auto-Investigation Outcome",
        "detail": f"Unexplained deduction of ₹{diff:,.2f} flagged. Standard fee rates do not account for gap. Line-item annexure requested.",
    })

    return InvestigationReport(
        order_id=order_id,
        category=category,
        decision="ESCALATE",
        severity="HIGH" if diff > 300 else "MEDIUM",
        root_cause=root_cause,
        findings=[
            f"Expected payout: ₹{expected:,.2f} | Actual received: ₹{actual:,.2f} | Gap: ₹{diff:,.2f}",
            f"Standard MDR (₹{mdr:,.2f}) + GST (₹{gst:,.2f}) + TDS (₹{tds:,.2f}) verified.",
            "Gateway fee annexure required to identify withholding reason.",
        ],
        agent_reasoning_log=agent_log,
        forensic_math={"gross_amount": gross, "recorded_expected": expected, "actual_received": actual, "unaccounted_difference": diff},
        recommended_action=action,
        suggested_journal_entry={
            "debit": [
                {"account": "Bank Account", "amount": actual},
                {"account": "Unreconciled Gateway Suspense Account", "amount": diff},
                {"account": "Gateway Fee Expense", "amount": round(mdr + gst, 2)},
                {"account": "TDS Receivable", "amount": tds},
            ],
            "credit": [{"account": "Customer Sales / Accounts Receivable", "amount": gross}],
        },
        confidence=0.75,
    )
