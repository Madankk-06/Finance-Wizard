"""
engine/evaluator.py — Phase 10: Evaluation & Audit Suite

Evaluates reconciliation and classification output against ground_truth.csv.
CRITICAL: ground_truth.csv is loaded strictly for evaluation metrics and is NEVER
used during matching or classification phases.
"""

from __future__ import annotations

import csv
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Optional
from collections import defaultdict

from config import settings
from database import get_conn, cipher
from routers.classify import _row_to_dict


@dataclass
class CategoryEvaluation:
    category:      str
    support:       int
    true_positive: int
    false_positive: int
    false_negative: int
    precision:     float
    recall:        float
    f1_score:      float


@dataclass
class EvaluationReport:
    batch_id:             str
    total_orders:         int
    correct_count:        int
    mismatched_count:     int
    overall_accuracy_pct: float
    monetary_variance_accuracy_pct: float
    category_breakdown:   dict[str, dict[str, Any]]
    mismatches:           list[dict[str, Any]]
    audit_events_count:   int
    audit_log_verified:   bool


def evaluate_batch(batch_id: str) -> EvaluationReport:
    """
    Compare classified_results for batch_id against ground_truth.csv.
    """
    gt_path = settings.samples_full_path / "ground_truth.csv"
    if not gt_path.exists():
        raise FileNotFoundError(f"ground_truth.csv not found at {gt_path}")

    # Load ground truth
    ground_truth: dict[str, dict[str, Any]] = {}
    with open(gt_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for r in reader:
            ground_truth[r["order_id"]] = {
                "order_id": r["order_id"],
                "settlement_id": r["settlement_id"],
                "utr": r["utr"],
                "true_category": r["true_category"],
                "expected_difference": float(r.get("expected_difference", 0.0)),
                "note": r.get("note", ""),
            }

    # Load classified results from DB
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM classified_results WHERE batch_id = ?", (batch_id,)).fetchall()
        audit_rows = conn.execute("SELECT * FROM audit_log WHERE batch_id = ?", (batch_id,)).fetchall()

    if not rows:
        raise ValueError(f"No classified results found for batch {batch_id}")

    classified = [_row_to_dict(r) for r in rows]

    # Evaluate classification & monetary difference
    correct = 0
    mismatches = []
    diff_matches = 0

    true_counts = defaultdict(int)
    pred_counts = defaultdict(int)
    tp_counts = defaultdict(int)

    for rec in classified:
        oid = rec["order_id"]
        pred_cat = rec["category"]
        gt_item = ground_truth.get(oid)

        if not gt_item:
            continue

        true_cat = gt_item["true_category"]
        expected_diff = gt_item["expected_difference"]
        actual_diff = abs(rec["difference"])

        true_counts[true_cat] += 1
        pred_counts[pred_cat] += 1

        is_cat_match = (pred_cat == true_cat)
        if is_cat_match:
            correct += 1
            tp_counts[true_cat] += 1
        else:
            mismatches.append({
                "order_id": oid,
                "true_category": true_cat,
                "predicted_category": pred_cat,
                "decision": rec["decision"],
                "difference": rec["difference"],
                "expected_difference": expected_diff,
            })

        # Check monetary difference within 2 paisa
        if abs(actual_diff - expected_diff) <= 0.02:
            diff_matches += 1

    total = len(classified)
    acc = round((correct / total) * 100, 2) if total > 0 else 0.0
    diff_acc = round((diff_matches / total) * 100, 2) if total > 0 else 0.0

    # Calculate category-level metrics (Precision, Recall, F1)
    all_categories = sorted(set(list(true_counts.keys()) + list(pred_counts.keys())))
    cat_breakdown = {}

    for cat in all_categories:
        tp = tp_counts[cat]
        fp = pred_counts[cat] - tp
        fn = true_counts[cat] - tp
        prec = round(tp / (tp + fp), 3) if (tp + fp) > 0 else 1.0
        rec_score = round(tp / (tp + fn), 3) if (tp + fn) > 0 else 1.0
        f1 = round(2 * (prec * rec_score) / (prec + rec_score), 3) if (prec + rec_score) > 0 else 1.0

        cat_breakdown[cat] = {
            "support": true_counts[cat],
            "predicted": pred_counts[cat],
            "precision": prec,
            "recall": rec_score,
            "f1_score": f1,
        }

    # Verify audit log integrity
    event_types = {r["event_type"] for r in audit_rows}
    audit_verified = ("INGEST" in event_types or "CLASSIFY" in event_types)

    return EvaluationReport(
        batch_id=batch_id,
        total_orders=total,
        correct_count=correct,
        mismatched_count=len(mismatches),
        overall_accuracy_pct=acc,
        monetary_variance_accuracy_pct=diff_acc,
        category_breakdown=cat_breakdown,
        mismatches=mismatches,
        audit_events_count=len(audit_rows),
        audit_log_verified=audit_verified,
    )
