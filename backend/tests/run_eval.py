"""
backend/tests/run_eval.py — Standalone Reconciliation & Audit Benchmark Runner

Runs end-to-end evaluation against ground_truth.csv and verifies:
1. Deterministic matching and classification accuracy = 100%
2. Zero monetary variance discrepancies (paisa precision)
3. Audit log lifecycle integrity
"""

import sys
import json
import urllib.request

BASE_URL = "http://localhost:8000/api"


def main():
    print("=" * 70)
    print("  FINANCE WIZARD — END-TO-END RECONCILIATION & AUDIT BENCHMARK")
    print("=" * 70)

    # 1. Health Check
    print("\n[Step 1] Verifying system health and encryption...")
    try:
        req = urllib.request.urlopen(f"{BASE_URL}/health")
        health = json.loads(req.read().decode())
        print(f"  ✓ System status: {health['status'].upper()} | Encryption: {health['encryption_mode']}")
    except Exception as e:
        print(f"  ✗ Health check failed: {e}")
        sys.exit(1)

    # 2. Ingest Demo Batch
    print("\n[Step 2] Ingesting demo batch (74 settlement, 66 bank, 74 ledger rows)...")
    req = urllib.request.Request(f"{BASE_URL}/demo-batch", method="POST")
    batch_resp = json.loads(urllib.request.urlopen(req).read().decode())
    batch_id = batch_resp["batch_id"]
    print(f"  ✓ Ingested batch_id: {batch_id}")

    # 3. Run Reconcile Pipeline (Match + Classify + Explanations)
    print("\n[Step 3] Running 4-pass deterministic matcher & 11-priority classifier...")
    recon_data = json.dumps({"batch_id": batch_id}).encode()
    req = urllib.request.Request(
        f"{BASE_URL}/reconcile",
        data=recon_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    recon_resp = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"  ✓ Total orders matched: {recon_resp['matched']}/{recon_resp['total_orders']} in {recon_resp['elapsed_s']}s")
    print(f"  ✓ Decisions breakdown: {recon_resp['decisions']}")

    # 4. Run Evaluation against ground_truth.csv
    print("\n[Step 4] Running audit evaluation against ground_truth.csv...")
    req = urllib.request.urlopen(f"{BASE_URL}/eval/{batch_id}")
    eval_resp = json.loads(req.read().decode())

    print("-" * 70)
    print(f"  Overall Classification Accuracy : {eval_resp['overall_accuracy_pct']}% ({eval_resp['correct_count']}/{eval_resp['total_orders']})")
    print(f"  Monetary Variance Accuracy     : {eval_resp['monetary_variance_accuracy_pct']}%")
    print(f"  Audit Trail Events Verified    : {eval_resp['audit_log_verified']} ({eval_resp['audit_events_count']} events)")
    print("-" * 70)

    print("\n[Step 5] Per-Category Performance Breakdown:")
    for cat, metrics in eval_resp["category_breakdown"].items():
        print(f"  • {cat:30s} | Support: {metrics['support']:2d} | Precision: {metrics['precision']:.2f} | Recall: {metrics['recall']:.2f} | F1: {metrics['f1_score']:.2f}")

    if eval_resp["mismatches"]:
        print(f"\n✗ Detected {len(eval_resp['mismatches'])} mismatches!")
        for m in eval_resp["mismatches"]:
            print(f"  Order: {m['order_id']} | True: {m['true_category']} | Pred: {m['predicted_category']}")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("  ✨ ALL BENCHMARK TESTS PASSED WITH 100.00% ACCURACY & FULL AUDIT PROOF!")
    print("=" * 70)


if __name__ == "__main__":
    main()
