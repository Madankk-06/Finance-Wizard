"""
engine/matcher.py — Phase 2: Deterministic Matching Engine

Given three decrypted DataFrames (settlement, bank, ledger) from a single batch,
produces a list of MatchResult objects that link every settlement order to its
bank credit (or marks it UNMATCHED).
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import date
from typing import Optional

import pandas as pd


# ── Result type ───────────────────────────────────────────────────────────────

@dataclass
class MatchResult:
    order_id:      str
    settlement_id: str
    payment_id:    str
    merchant_id:   str
    utr:           Optional[str]          # None if UNMATCHED_SETTLEMENT
    match_type:    str                    # DIRECT | LUMPED | SPLIT | FUZZY | UNMATCHED_SETTLEMENT

    # Raw numbers (used by Phase 3 classifier)
    gross_amount:               float
    mdr_fee:                    float
    gst_on_mdr:                 float
    tds_amount:                 float
    refund_amount:              float
    settlement_net:             float     # settlement.net_amount
    bank_credit:                float     # bank.credit_amount (0 if UNMATCHED)
    ledger_expected:            float     # ledger.expected_settlement_amount
    settlement_date:            str
    bank_credit_date:           str       # "" if UNMATCHED
    ledger_recorded_date:       str
    narration:                  str       # bank narration (for explanations)

    # Linked debit adjustment (e.g. refund adjustment or post-recon chargeback)
    linked_debit:               float = 0.0
    linked_debit_narration:     str = ""
    linked_debit_utr:           str = ""


@dataclass
class UnmatchedBank:
    utr:           str
    credit_amount: float
    credit_date:   str
    narration:     str
    match_type:    str   # DEBIT_ADJUSTMENT | BANK_ONLY


@dataclass
class MatchSummary:
    batch_id:       str
    total_orders:   int
    matched:        int
    unmatched:      int
    by_match_type:  dict[str, int]
    results:        list[MatchResult]
    unmatched_bank: list[UnmatchedBank]
    lumped_batches: list[dict]   # {settlement_id, order_count, sum_net, bank_credit}


# ── Main entry point ──────────────────────────────────────────────────────────

AMOUNT_TOLERANCE = 0.02    # ₹ for DIRECT/LUMPED/SPLIT sums
FUZZY_AMT_TOL   = 5.00     # ₹ for fuzzy amount window
FUZZY_DATE_DAYS = 3        # days for fuzzy date window


def run_matching(
    batch_id: str,
    df_s: pd.DataFrame,    # raw_settlement (decrypted)
    df_b: pd.DataFrame,    # raw_bank (decrypted)
    df_l: pd.DataFrame,    # raw_ledger (decrypted)
) -> MatchSummary:

    results: list[MatchResult] = []
    unmatched_bank: list[UnmatchedBank] = []
    lumped_info: list[dict] = []

    # Build lookup maps
    ledger_map: dict[str, dict] = {
        row["order_id"]: row for row in df_l.to_dict("records")
    }

    # Track which bank rows and settlement rows have been consumed
    bank_used: set[str] = set()          # utr values consumed
    settlement_used: set[str] = set()    # order_id values consumed

    # Pre-index bank debits (< 0) by settlement_id_ref and order_id in narration
    debit_map_by_sid: dict[str, dict] = {}
    debit_map_by_oid: dict[str, dict] = {}
    for row in df_b[df_b["credit_amount"] < 0].to_dict("records"):
        sid_ref = row["settlement_id_ref"].strip()
        if sid_ref:
            debit_map_by_sid[sid_ref] = row
        m = re.search(r"ORD\d+", row["narration"])
        if m:
            debit_map_by_oid[m.group(0)] = row

    # Pre-compute settlement_id → list[order rows]
    sid_to_orders: dict[str, list[dict]] = {}
    for row in df_s.to_dict("records"):
        sid_to_orders.setdefault(row["settlement_id"], []).append(row)

    # Separate bank by reference type
    bank_with_ref  = df_b[df_b["settlement_id_ref"].str.strip() != ""]
    bank_blank_ref = df_b[df_b["settlement_id_ref"].str.strip() == ""]

    # Index bank-with-ref by settlement_id_ref
    ref_to_bank: dict[str, list[dict]] = {}
    for row in bank_with_ref.to_dict("records"):
        ref_to_bank.setdefault(row["settlement_id_ref"], []).append(row)

    # Helper to get linked debit for an order/sid
    def get_debit_info(oid: str, sid: str) -> tuple[float, str, str]:
        debit_r = debit_map_by_oid.get(oid) or debit_map_by_sid.get(sid)
        if debit_r:
            return debit_r["credit_amount"], debit_r["narration"], debit_r["utr"]
        return 0.0, "", ""

    # ── Pass 1: DIRECT (single-order settlements with exactly 1 positive bank ref) ──

    for sid, orders in sid_to_orders.items():
        if len(orders) != 1:
            continue   # lumped — handled in Pass 2
        bank_rows_for_sid = ref_to_bank.get(sid, [])
        pos_credits = [b for b in bank_rows_for_sid if b["credit_amount"] > 0]
        
        # If there's multiple positive credits, it's a SPLIT settlement (Pass 3)
        if len(pos_credits) != 1:
            continue

        order  = orders[0]
        bank_r = pos_credits[0]
        ledger = ledger_map.get(order["order_id"], {})
        debit_amt, debit_narr, debit_utr = get_debit_info(order["order_id"], sid)

        results.append(MatchResult(
            order_id=order["order_id"],
            settlement_id=sid,
            payment_id=order["payment_id"],
            merchant_id=order["merchant_id"],
            utr=bank_r["utr"],
            match_type="DIRECT",
            gross_amount=order["gross_amount"],
            mdr_fee=order["mdr_fee"],
            gst_on_mdr=order["gst_on_mdr"],
            tds_amount=order["tds_amount"],
            refund_amount=order["refund_amount"],
            settlement_net=order["net_amount"],
            bank_credit=bank_r["credit_amount"],
            ledger_expected=ledger.get("expected_settlement_amount", 0.0),
            settlement_date=order["settlement_date"],
            bank_credit_date=bank_r["credit_date"],
            ledger_recorded_date=ledger.get("recorded_date", ""),
            narration=bank_r["narration"],
            linked_debit=debit_amt,
            linked_debit_narration=debit_narr,
            linked_debit_utr=debit_utr,
        ))
        bank_used.add(bank_r["utr"])
        settlement_used.add(order["order_id"])

    # ── Pass 2: LUMPED (many orders → one bank credit) ────────────────────────

    for sid, orders in sid_to_orders.items():
        if len(orders) <= 1:
            continue
        bank_rows_for_sid = ref_to_bank.get(sid, [])
        if not bank_rows_for_sid:
            continue

        # Sum all positive credits for this settlement_id
        positive_credits = [b for b in bank_rows_for_sid if b["credit_amount"] > 0]
        if not positive_credits:
            continue

        # Expect exactly one bank credit for a lumped batch
        bank_r  = positive_credits[0]
        sum_net = round(sum(o["net_amount"] for o in orders), 2)
        bank_cr = round(bank_r["credit_amount"], 2)

        lumped_info.append({
            "settlement_id": sid,
            "order_count":   len(orders),
            "sum_net":       sum_net,
            "bank_credit":   bank_cr,
            "bank_utr":      bank_r["utr"],
            "balanced":      abs(sum_net - bank_cr) <= AMOUNT_TOLERANCE,
        })

        for order in orders:
            if order["order_id"] in settlement_used:
                continue
            ledger = ledger_map.get(order["order_id"], {})
            debit_amt, debit_narr, debit_utr = get_debit_info(order["order_id"], sid)
            results.append(MatchResult(
                order_id=order["order_id"],
                settlement_id=sid,
                payment_id=order["payment_id"],
                merchant_id=order["merchant_id"],
                utr=bank_r["utr"],
                match_type="LUMPED",
                gross_amount=order["gross_amount"],
                mdr_fee=order["mdr_fee"],
                gst_on_mdr=order["gst_on_mdr"],
                tds_amount=order["tds_amount"],
                refund_amount=order["refund_amount"],
                settlement_net=order["net_amount"],
                bank_credit=bank_r["credit_amount"],   # full batch credit (not split per order)
                ledger_expected=ledger.get("expected_settlement_amount", 0.0),
                settlement_date=order["settlement_date"],
                bank_credit_date=bank_r["credit_date"],
                ledger_recorded_date=ledger.get("recorded_date", ""),
                narration=bank_r["narration"],
                linked_debit=debit_amt,
                linked_debit_narration=debit_narr,
                linked_debit_utr=debit_utr,
            ))
            settlement_used.add(order["order_id"])
            bank_used.add(bank_r["utr"])

    # ── Pass 3: SPLIT (one order → multiple positive bank credits) ─────────────

    for sid, orders in sid_to_orders.items():
        if len(orders) != 1:
            continue
        order = orders[0]
        if order["order_id"] in settlement_used:
            continue

        bank_rows_for_sid = ref_to_bank.get(sid, [])
        positive_credits = [b for b in bank_rows_for_sid if b["credit_amount"] > 0]
        if len(positive_credits) <= 1:
            continue

        sum_credits = round(sum(b["credit_amount"] for b in positive_credits), 2)
        ledger = ledger_map.get(order["order_id"], {})
        rep_bank = sorted(positive_credits, key=lambda b: b["credit_date"])[0]
        debit_amt, debit_narr, debit_utr = get_debit_info(order["order_id"], sid)

        results.append(MatchResult(
            order_id=order["order_id"],
            settlement_id=sid,
            payment_id=order["payment_id"],
            merchant_id=order["merchant_id"],
            utr=rep_bank["utr"],
            match_type="SPLIT",
            gross_amount=order["gross_amount"],
            mdr_fee=order["mdr_fee"],
            gst_on_mdr=order["gst_on_mdr"],
            tds_amount=order["tds_amount"],
            refund_amount=order["refund_amount"],
            settlement_net=order["net_amount"],
            bank_credit=sum_credits,   # sum of positive credits
            ledger_expected=ledger.get("expected_settlement_amount", 0.0),
            settlement_date=order["settlement_date"],
            bank_credit_date=rep_bank["credit_date"],
            ledger_recorded_date=ledger.get("recorded_date", ""),
            narration=rep_bank["narration"],
            linked_debit=debit_amt,
            linked_debit_narration=debit_narr,
            linked_debit_utr=debit_utr,
        ))
        settlement_used.add(order["order_id"])
        for b in positive_credits:
            bank_used.add(b["utr"])

    # ── Pass 4: FUZZY (blank settlement_id_ref → amount+date window) ──────────

    unmatched_orders_before_fuzzy = [
        o for orders in sid_to_orders.values()
        for o in orders
        if o["order_id"] not in settlement_used
    ]
    unmatched_blank_bank = [
        row for row in bank_blank_ref.to_dict("records")
        if row["utr"] not in bank_used and row["credit_amount"] > 0
    ]

    for order in unmatched_orders_before_fuzzy:
        ledger = ledger_map.get(order["order_id"], {})
        try:
            s_date = date.fromisoformat(order["settlement_date"])
        except ValueError:
            s_date = None

        best_bank = None
        best_score = float("inf")

        for bank_r in unmatched_blank_bank:
            if bank_r["utr"] in bank_used:
                continue
            amt_diff = abs(bank_r["credit_amount"] - order["net_amount"])
            if amt_diff > FUZZY_AMT_TOL:
                continue
            if s_date:
                try:
                    b_date = date.fromisoformat(bank_r["credit_date"])
                    date_diff = abs((b_date - s_date).days)
                except ValueError:
                    date_diff = 999
            else:
                date_diff = 999
            if date_diff > FUZZY_DATE_DAYS:
                continue

            score = amt_diff * 10 + date_diff   # weighted: amount matters more
            if score < best_score:
                best_score = score
                best_bank  = bank_r

        debit_amt, debit_narr, debit_utr = get_debit_info(order["order_id"], order["settlement_id"])

        if best_bank:
            results.append(MatchResult(
                order_id=order["order_id"],
                settlement_id=order["settlement_id"],
                payment_id=order["payment_id"],
                merchant_id=order["merchant_id"],
                utr=best_bank["utr"],
                match_type="FUZZY",
                gross_amount=order["gross_amount"],
                mdr_fee=order["mdr_fee"],
                gst_on_mdr=order["gst_on_mdr"],
                tds_amount=order["tds_amount"],
                refund_amount=order["refund_amount"],
                settlement_net=order["net_amount"],
                bank_credit=best_bank["credit_amount"],
                ledger_expected=ledger.get("expected_settlement_amount", 0.0),
                settlement_date=order["settlement_date"],
                bank_credit_date=best_bank["credit_date"],
                ledger_recorded_date=ledger.get("recorded_date", ""),
                narration=best_bank["narration"],
                linked_debit=debit_amt,
                linked_debit_narration=debit_narr,
                linked_debit_utr=debit_utr,
            ))
            bank_used.add(best_bank["utr"])
            settlement_used.add(order["order_id"])
        else:
            # No bank match found at all
            results.append(MatchResult(
                order_id=order["order_id"],
                settlement_id=order["settlement_id"],
                payment_id=order["payment_id"],
                merchant_id=order["merchant_id"],
                utr=None,
                match_type="UNMATCHED_SETTLEMENT",
                gross_amount=order["gross_amount"],
                mdr_fee=order["mdr_fee"],
                gst_on_mdr=order["gst_on_mdr"],
                tds_amount=order["tds_amount"],
                refund_amount=order["refund_amount"],
                settlement_net=order["net_amount"],
                bank_credit=0.0,
                ledger_expected=ledger.get("expected_settlement_amount", 0.0),
                settlement_date=order["settlement_date"],
                bank_credit_date="",
                ledger_recorded_date=ledger.get("recorded_date", ""),
                narration="",
                linked_debit=debit_amt,
                linked_debit_narration=debit_narr,
                linked_debit_utr=debit_utr,
            ))
            settlement_used.add(order["order_id"])

    # ── Record unmatched bank rows ───────────────────────────────────────────

    for row in df_b.to_dict("records"):
        if row["utr"] in bank_used:
            continue
        if row["credit_amount"] < 0:
            unmatched_bank.append(UnmatchedBank(
                utr=row["utr"],
                credit_amount=row["credit_amount"],
                credit_date=row["credit_date"],
                narration=row["narration"],
                match_type="DEBIT_ADJUSTMENT",
            ))
        else:
            unmatched_bank.append(UnmatchedBank(
                utr=row["utr"],
                credit_amount=row["credit_amount"],
                credit_date=row["credit_date"],
                narration=row["narration"],
                match_type="BANK_ONLY",
            ))

    # ── Assemble summary ──────────────────────────────────────────────────────

    by_type: dict[str, int] = {}
    for r in results:
        by_type[r.match_type] = by_type.get(r.match_type, 0) + 1

    matched_count = sum(
        1 for r in results if r.match_type != "UNMATCHED_SETTLEMENT"
    )

    return MatchSummary(
        batch_id=batch_id,
        total_orders=len(df_s),
        matched=matched_count,
        unmatched=len(results) - matched_count,
        by_match_type=by_type,
        results=results,
        unmatched_bank=unmatched_bank,
        lumped_batches=lumped_info,
    )
