"""
engine/classifier.py — Phase 3: Classify + APPROVE / HOLD / ESCALATE

Input:  MatchResult list from engine.matcher (one row per settlement order)
Output: ClassifiedResult list — every order gets exactly one category + decision

Rules (deterministic, evaluated in priority order):
──────────────────────────────────────────────────────────────────────────────
  effective_bank = settlement_net   (for LUMPED orders — bank_credit is whole batch)
                 = bank_credit      (for DIRECT / FUZZY / SPLIT)
  difference     = round(ledger_expected − effective_bank, 2)
  fee_gap        = mdr_fee + gst_on_mdr
  tax_gap        = tds_amount
  delay_days     = settlement_date − ledger_recorded_date (calendar days)

Priority   Category                     Condition                         Decision
  1        EDGE_POST_RECON_CHARGEBACK   linked_debit has CHARGEBACK       ESCALATE
  2        EDGE_DELAYED_REFUND          linked_debit has REFUND           APPROVE
  3        LUMPED_BATCH_MATCHED         mt=LUMPED  |diff|≤0.50            APPROVE
  4        EDGE_SPLIT_SETTLEMENT        mt=SPLIT   |diff|≤0.50            APPROVE
  5        MATCHED                      |diff|≤0.50  delay≤3              APPROVE
  6        TIMING_DELAY                 |diff|≤0.50  delay>3
                                        (soft ≤5 d / hard >5 d)           HOLD
  7        FEE_DEDUCTION                |diff − fee_gap|≤1.00             APPROVE
  8        TAX_DEDUCTION                |diff − tax_gap|≤1.00             APPROVE
  9        ROUNDING                     0.50 < |diff| ≤ 5.00              APPROVE
  10       PARTIAL_PAYMENT              diff/ledger_expected > 0.20       ESCALATE
  11       UNEXPLAINED                  everything else                   ESCALATE
──────────────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Optional

from engine.matcher import MatchResult

# ── Thresholds ────────────────────────────────────────────────────────────────

MATCHED_TOL         = 0.50    # ₹ — treat as "no difference"
FEE_FORMULA_TOL     = 1.00    # ₹ — formula match window
ROUNDING_MAX        = 5.00    # ₹ — small-variance ceiling
PARTIAL_PCT         = 0.20    # 20 % of ledger_expected


# ── Output type ───────────────────────────────────────────────────────────────

@dataclass
class ClassifiedResult:
    # ── identity
    order_id:       str
    settlement_id:  str
    payment_id:     str
    merchant_id:    str
    utr:            Optional[str]

    # ── match provenance
    match_type:     str          # DIRECT | LUMPED | SPLIT | FUZZY

    # ── amounts
    gross_amount:   float
    mdr_fee:        float
    gst_on_mdr:     float
    tds_amount:     float
    settlement_net: float        # per-order net from settlement report
    bank_credit:    float        # raw bank credit (full batch for LUMPED)
    effective_bank: float        # bank credit to use for comparison
    ledger_expected: float
    difference:     float        # ledger_expected − effective_bank

    # ── dates
    settlement_date:      str
    bank_credit_date:     str
    ledger_recorded_date: str
    delay_days:           int

    # ── classification
    category:   str    # see Priority table above
    decision:   str    # APPROVE | HOLD | ESCALATE
    confidence: float  # 1.0 = formula match, 0.85 = heuristic, 0.70 = fallback

    narration:  str


# ── Main entry point ──────────────────────────────────────────────────────────

def classify(match_results: list[MatchResult]) -> list[ClassifiedResult]:
    out: list[ClassifiedResult] = []
    for r in match_results:
        out.append(_classify_one(r))
    return out


def _classify_one(r: MatchResult) -> ClassifiedResult:
    # 1. Effective bank credit
    effective_bank = r.settlement_net if r.match_type == "LUMPED" else r.bank_credit

    # 2. Key signals
    diff      = round(r.ledger_expected - effective_bank, 2)
    abs_diff  = abs(diff)
    fee_gap   = round(r.mdr_fee + r.gst_on_mdr, 2)
    tax_gap   = round(r.tds_amount, 2)
    narration_upper = (r.narration or "").upper()
    debit_narr_upper = (r.linked_debit_narration or "").upper()

    # 3. Timing delay
    delay_days = _delay(r.settlement_date, r.ledger_recorded_date)

    # 4. Classification (priority order)

    # P1 — EDGE_POST_RECON_CHARGEBACK (linked debit says CHARGEBACK)
    if "CHARGEBACK" in debit_narr_upper or ("CHARGEBACK" in narration_upper and abs_diff <= MATCHED_TOL):
        return _make(r, effective_bank, diff, delay_days,
                     "EDGE_POST_RECON_CHARGEBACK", "ESCALATE", 0.95)

    # P2 — EDGE_DELAYED_REFUND (linked debit says REFUND)
    if "REFUND" in debit_narr_upper:
        return _make(r, effective_bank, diff, delay_days,
                     "EDGE_DELAYED_REFUND", "APPROVE", 0.95)

    # P3 — LUMPED_BATCH_MATCHED
    if r.match_type == "LUMPED" and abs_diff <= MATCHED_TOL:
        return _make(r, effective_bank, diff, delay_days,
                     "LUMPED_BATCH_MATCHED", "APPROVE", 1.0)

    # P4 — EDGE_SPLIT_SETTLEMENT
    if r.match_type == "SPLIT" and abs_diff <= MATCHED_TOL:
        return _make(r, effective_bank, diff, delay_days,
                     "EDGE_SPLIT_SETTLEMENT", "APPROVE", 1.0)

    # P5 — MATCHED  (diff ≈ 0, normal timing)
    if abs_diff <= MATCHED_TOL and delay_days <= 3:
        return _make(r, effective_bank, diff, delay_days,
                     "MATCHED", "APPROVE", 1.0)

    # P6 — TIMING_DELAY  (diff ≈ 0 but late)
    if abs_diff <= MATCHED_TOL and delay_days > 3:
        return _make(r, effective_bank, diff, delay_days,
                     "TIMING_DELAY", "HOLD", 1.0)

    # P7 — FEE_DEDUCTION  (diff ≈ MDR + GST)
    if abs(diff - fee_gap) <= FEE_FORMULA_TOL and diff > 0:
        return _make(r, effective_bank, diff, delay_days,
                     "FEE_DEDUCTION", "APPROVE", 1.0)

    # P8 — TAX_DEDUCTION  (diff ≈ TDS)
    if abs(diff - tax_gap) <= FEE_FORMULA_TOL and diff > 0:
        return _make(r, effective_bank, diff, delay_days,
                     "TAX_DEDUCTION", "APPROVE", 1.0)

    # P9 — ROUNDING  (tiny variance, abs ≤ ₹5)
    if MATCHED_TOL < abs_diff <= ROUNDING_MAX:
        return _make(r, effective_bank, diff, delay_days,
                     "ROUNDING", "APPROVE", 0.85)

    # P10 — PARTIAL_PAYMENT  (large fraction missing)
    if r.ledger_expected > 0 and diff / r.ledger_expected > PARTIAL_PCT:
        return _make(r, effective_bank, diff, delay_days,
                     "PARTIAL_PAYMENT", "ESCALATE", 0.90)

    # P11 — UNEXPLAINED  (no known pattern)
    return _make(r, effective_bank, diff, delay_days,
                 "UNEXPLAINED", "ESCALATE", 0.70)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _delay(settle_date: str, record_date: str) -> int:
    try:
        return (date.fromisoformat(settle_date) - date.fromisoformat(record_date)).days
    except (ValueError, TypeError):
        return 0


def _make(
    r: MatchResult,
    effective_bank: float,
    diff: float,
    delay_days: int,
    category: str,
    decision: str,
    confidence: float,
) -> ClassifiedResult:
    return ClassifiedResult(
        order_id=r.order_id,
        settlement_id=r.settlement_id,
        payment_id=r.payment_id,
        merchant_id=r.merchant_id,
        utr=r.utr,
        match_type=r.match_type,
        gross_amount=r.gross_amount,
        mdr_fee=r.mdr_fee,
        gst_on_mdr=r.gst_on_mdr,
        tds_amount=r.tds_amount,
        settlement_net=r.settlement_net,
        bank_credit=r.bank_credit,
        effective_bank=effective_bank,
        ledger_expected=r.ledger_expected,
        difference=diff,
        settlement_date=r.settlement_date,
        bank_credit_date=r.bank_credit_date,
        ledger_recorded_date=r.ledger_recorded_date,
        delay_days=delay_days,
        category=category,
        decision=decision,
        confidence=confidence,
        narration=r.narration,
    )
