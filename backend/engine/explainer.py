"""
engine/explainer.py — Phase 5: Grounded Explanation Engine & Rupee Validator

Generates human-readable, mathematically grounded explanations for all 74 transactions.
Includes a Rupee Validator that verifies every mentioned ₹ amount exists in the underlying record.
"""

from __future__ import annotations

import re
from typing import Any


def generate_explanation(record: dict[str, Any]) -> str:
    """
    Generate an audit-proof, deterministic explanation for a classified record.
    """
    order_id = record["order_id"]
    category = record["category"]
    gross = record["gross_amount"]
    expected = record["ledger_expected"]
    actual = record["effective_bank"]
    diff = record["difference"]
    mdr = record["mdr_fee"]
    gst = record["gst_on_mdr"]
    tds = record["tds_amount"]
    utr = record.get("utr") or "UNAVAILABLE"
    delay = record.get("delay_days", 0)

    # ── Category 1: MATCHED ───────────────────────────────────────────────────
    if category == "MATCHED":
        return (
            f"Clean 3-way reconciliation: Gross invoice ₹{gross:,.2f} less MDR fee (₹{mdr:,.2f}), "
            f"GST (₹{gst:,.2f}), and TDS (₹{tds:,.2f}) perfectly matches bank deposit of ₹{actual:,.2f} "
            f"under UTR {utr} with zero discrepancy."
        )

    # ── Category 2: FEE_DEDUCTION ─────────────────────────────────────────────
    if category == "FEE_DEDUCTION":
        fee_sum = round(mdr + gst, 2)
        return (
            f"Ledger omitted payment gateway processing charges: MDR (2% = ₹{mdr:,.2f}) and GST on MDR "
            f"(18% = ₹{gst:,.2f}) totaling ₹{fee_sum:,.2f}. Bank credit of ₹{actual:,.2f} matches net payout."
        )

    # ── Category 3: TAX_DEDUCTION ─────────────────────────────────────────────
    if category == "TAX_DEDUCTION":
        return (
            f"Ledger omitted Section 194-O statutory TDS deduction (1% = ₹{tds:,.2f}). "
            f"Expected payout was ₹{expected:,.2f}, and bank deposit received was ₹{actual:,.2f}."
        )

    # ── Category 4: ROUNDING ──────────────────────────────────────────────────
    if category == "ROUNDING":
        return (
            f"Gateway floating-point rounding variance of ₹{abs(diff):,.2f} detected on Gross ₹{gross:,.2f}. "
            f"Within automatic approval threshold (≤ ₹5.00)."
        )

    # ── Category 5: TIMING_DELAY ──────────────────────────────────────────────
    if category == "TIMING_DELAY":
        severity = "Soft" if delay <= 5 else "Extended"
        return (
            f"{severity} settlement delay: Funds arrived on T+{delay} days (expected T+2). "
            f"Disbursed amount of ₹{actual:,.2f} matches invoice net perfectly; held pending cycle verification."
        )

    # ── Category 6: PARTIAL_PAYMENT ───────────────────────────────────────────
    if category == "PARTIAL_PAYMENT":
        pct = round((actual / expected) * 100, 1) if expected > 0 else 0.0
        return (
            f"Partial tranche payout: Received ₹{actual:,.2f} ({pct}%) against expected net of ₹{expected:,.2f}. "
            f"Unsettled balance of ₹{diff:,.2f} escalated for merchant support follow-up."
        )

    # ── Category 7: UNEXPLAINED ───────────────────────────────────────────────
    if category == "UNEXPLAINED":
        return (
            f"Unreconciled discrepancy of ₹{diff:,.2f} on Gross ₹{gross:,.2f}. "
            f"Calculated standard fees (MDR ₹{mdr:,.2f}, GST ₹{gst:,.2f}, TDS ₹{tds:,.2f}) do not account for this gap."
        )

    # ── Category 8: LUMPED_BATCH_MATCHED ──────────────────────────────────────
    if category == "LUMPED_BATCH_MATCHED":
        return (
            f"Lumped settlement match: Order's net share of ₹{actual:,.2f} (Gross ₹{gross:,.2f}) "
            f"was consolidated into batch UTR {utr} and fully reconciled against shared bank deposit."
        )

    # ── Category 9: EDGE_DELAYED_REFUND ───────────────────────────────────────
    if category == "EDGE_DELAYED_REFUND":
        return (
            f"Delayed customer refund: Primary settlement of ₹{actual:,.2f} was clean. "
            f"A linked post-settlement refund adjustment debit was subsequently recorded in bank records."
        )

    # ── Category 10: EDGE_SPLIT_SETTLEMENT ────────────────────────────────────
    if category == "EDGE_SPLIT_SETTLEMENT":
        return (
            f"Split settlement transfer: Total payout of ₹{actual:,.2f} was disbursed across multiple tranches "
            f"and successfully matched to the single order invoice of ₹{gross:,.2f}."
        )

    # ── Category 11: EDGE_POST_RECON_CHARGEBACK ───────────────────────────────
    if category == "EDGE_POST_RECON_CHARGEBACK":
        return (
            f"Post-reconciliation chargeback: Primary invoice was settled cleanly at ₹{actual:,.2f}, "
            f"followed by an automated dispute clawback debit requiring immediate representment."
        )

    return f"Transaction {order_id} processed with net payout ₹{actual:,.2f}."


def validate_rupee_amounts(text: str, record: dict[str, Any]) -> bool:
    """
    Scans the explanation text for all occurrences of ₹amounts and verifies
    that each amount corresponds to a valid value in the transaction record
    (or derived sum/diff).
    """
    # Extract all numbers preceded by ₹
    matches = re.findall(r"₹([0-9,]+(?:\.[0-9]{2})?)", text)
    if not matches:
        return True

    # Build allowlist of valid numbers from record
    valid_numbers = set()
    for k, v in record.items():
        if isinstance(v, (int, float)):
            valid_numbers.add(round(abs(float(v)), 2))

    # Add derived numbers (sum of MDR+GST, gross-net, etc.)
    mdr = record.get("mdr_fee", 0.0)
    gst = record.get("gst_on_mdr", 0.0)
    tds = record.get("tds_amount", 0.0)
    gross = record.get("gross_amount", 0.0)
    expected = record.get("ledger_expected", 0.0)
    actual = record.get("effective_bank", 0.0)
    diff = record.get("difference", 0.0)

    valid_numbers.add(round(mdr + gst, 2))
    valid_numbers.add(round(mdr + gst + tds, 2))
    valid_numbers.add(round(abs(diff), 2))
    valid_numbers.add(round(abs(expected - actual), 2))

    # Standard policy threshold constants
    valid_numbers.add(5.00)   # Rounding variance policy ceiling
    valid_numbers.add(0.00)   # Zero threshold

    for m in matches:
        val = round(float(m.replace(",", "")), 2)
        if val not in valid_numbers:
            # Allow zero or tiny rounding delta <= 0.02
            if not any(abs(val - vn) <= 0.02 for vn in valid_numbers):
                return False

    return True
