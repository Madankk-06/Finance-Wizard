"""
ReconIQ — Synthetic Data Generator (v3, corrected)

FIXES vs v2:
  1. Fixed ID-unpacking bug (settlement_id and payment_id were swapped at every call site)
  2. Added TRUE multi-order lumped settlements (many orders -> one settlement_id -> one bank credit)
     — this is what the problem statement actually claims and v2 did not demonstrate
  3. Added 2 softer TIMING_DELAY cases (T+4/T+5) alongside the harsher T+7-11 cases
  4. Documented refund_amount=0 design choice (refunds modeled as separate later bank debits)

Design principle (unchanged from v2):
  ledger.expected_settlement_amount = what the MERCHANT'S OWN SYSTEM believes it will receive
  settlement.net_amount / bank.credit_amount = what ACTUALLY happened (always correctly computed)
  The gap between these two is the real, detectable signal the classification engine must explain.
"""

import csv
import random
from datetime import datetime, timedelta
from faker import Faker

fake = Faker("en_IN")
random.seed(11)
Faker.seed(11)

MDR_RATE = 0.02
GST_RATE = 0.18
TDS_RATE = 0.01
BASE_DATE = datetime(2026, 7, 1)
MERCHANTS = ["MERCH_URBANKART", "MERCH_STYLEHIVE", "MERCH_FRESHCART", "MERCH_GADGETBAY"]

settlement_rows = []
bank_rows = []
ledger_rows = []
ground_truth_rows = []
counter = 1


def next_ids():
    """Returns (order_id, payment_id, settlement_id) — FIXED: callers must unpack in this exact order."""
    global counter
    oid = f"ORD{1000 + counter}"
    pid = f"pay_{fake.lexify('??????????').upper()}"
    sid = f"stl_{fake.lexify('????????').upper()}"
    counter += 1
    return oid, pid, sid


def next_utr():
    return f"UTR{fake.numerify('##########')}"


def rand_order_date():
    return BASE_DATE + timedelta(days=random.randint(0, 22))


def fees(gross):
    mdr = round(gross * MDR_RATE, 2)
    gst = round(mdr * GST_RATE, 2)
    tds = round(gross * TDS_RATE, 2)
    return mdr, gst, tds


def add_row(category, order_id, settlement_id, payment_id, merchant, gross, mdr, gst, tds,
            refund, actual_net, ledger_expected, order_date, settle_date, utr,
            settlement_id_ref, note, expected_diff):
    settlement_rows.append({
        "settlement_id": settlement_id, "payment_id": payment_id, "order_id": order_id,
        "merchant_id": merchant, "gross_amount": gross, "mdr_fee": mdr, "gst_on_mdr": gst,
        "tds_amount": tds, "refund_amount": refund, "net_amount": actual_net,
        "settlement_date": settle_date.strftime("%Y-%m-%d"),
    })
    bank_rows.append({
        "utr": utr, "credit_amount": actual_net, "credit_date": settle_date.strftime("%Y-%m-%d"),
        "narration": f"NEFT RAZORPAY SETTLEMENT {merchant}", "settlement_id_ref": settlement_id_ref,
    })
    ledger_rows.append({
        "order_id": order_id, "merchant_id": merchant, "invoice_amount": gross,
        "expected_settlement_amount": ledger_expected,
        "recorded_date": order_date.strftime("%Y-%m-%d"), "status": "OPEN",
    })
    ground_truth_rows.append({
        "order_id": order_id, "settlement_id": settlement_id, "utr": utr,
        "true_category": category, "expected_difference": expected_diff, "note": note,
    })


# ---------- MATCHED (12) — FIX: correct unpack order ----------
for _ in range(12):
    gross = round(random.uniform(500, 8000), 2)
    mdr, gst, tds = fees(gross)
    net = round(gross - mdr - gst - tds, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd = od + timedelta(days=2)
    add_row("MATCHED", oid, sid, pid, random.choice(MERCHANTS), gross, mdr, gst, tds, 0.0,
            net, net, od, sd, next_utr(), sid, "ledger correctly anticipated full fee/tax deduction", 0.0)

# ---------- FEE_DEDUCTION (10) — ledger forgot MDR+GST ----------
for _ in range(10):
    gross = round(random.uniform(500, 9000), 2)
    mdr, gst, tds = fees(gross)
    net = round(gross - mdr - gst - tds, 2)
    ledger_expected = round(gross - tds, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd = od + timedelta(days=2)
    diff = round(ledger_expected - net, 2)
    add_row("FEE_DEDUCTION", oid, sid, pid, random.choice(MERCHANTS), gross, mdr, gst, tds, 0.0,
            net, ledger_expected, od, sd, next_utr(), sid,
            "ledger did not account for MDR + GST on MDR", diff)

# ---------- TAX_DEDUCTION (8) — ledger forgot TDS ----------
for _ in range(8):
    gross = round(random.uniform(1000, 10000), 2)
    mdr, gst, tds = fees(gross)
    net = round(gross - mdr - gst - tds, 2)
    ledger_expected = round(gross - mdr - gst, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd = od + timedelta(days=2)
    diff = round(ledger_expected - net, 2)
    add_row("TAX_DEDUCTION", oid, sid, pid, random.choice(MERCHANTS), gross, mdr, gst, tds, 0.0,
            net, ledger_expected, od, sd, next_utr(), sid,
            "ledger did not account for TDS under Section 194-O", diff)

# ---------- ROUNDING (7) ----------
for _ in range(7):
    gross = round(random.uniform(500, 4000), 2)
    mdr, gst, tds = fees(gross)
    correct_net = round(gross - mdr - gst - tds, 2)
    noise = round(random.uniform(0.5, 4.5), 2)
    actual_net = round(correct_net - noise, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd = od + timedelta(days=2)
    add_row("ROUNDING", oid, sid, pid, random.choice(MERCHANTS), gross, mdr, gst, tds, 0.0,
            actual_net, correct_net, od, sd, next_utr(), sid,
            f"gateway rounding variance of ~₹{noise}", noise)

# ---------- TIMING_DELAY (8) — 6 hard (T+7-11) + 2 soft (T+4-5) ----------
for i in range(8):
    gross = round(random.uniform(700, 6000), 2)
    mdr, gst, tds = fees(gross)
    net = round(gross - mdr - gst - tds, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    delay = random.randint(4, 5) if i < 2 else random.randint(7, 11)
    sd = od + timedelta(days=delay)
    severity = "soft" if delay <= 5 else "hard"
    add_row("TIMING_DELAY", oid, sid, pid, random.choice(MERCHANTS), gross, mdr, gst, tds, 0.0,
            net, net, od, sd, next_utr(), sid,
            f"amount correct, settled T+{delay} ({severity} delay vs expected T+2/T+3)", 0.0)

# ---------- PARTIAL_PAYMENT (5) ----------
for _ in range(5):
    gross = round(random.uniform(2000, 9000), 2)
    mdr, gst, tds = fees(gross)
    expected_net = round(gross - mdr - gst - tds, 2)
    partial = round(expected_net * random.uniform(0.4, 0.7), 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd = od + timedelta(days=2)
    diff = round(expected_net - partial, 2)
    add_row("PARTIAL_PAYMENT", oid, sid, pid, random.choice(MERCHANTS), gross, mdr, gst, tds, 0.0,
            partial, expected_net, od, sd, next_utr(), sid,
            "only part of the expected settlement has landed so far", diff)

# ---------- UNEXPLAINED (5) ----------
for _ in range(5):
    gross = round(random.uniform(1000, 7000), 2)
    mdr, gst, tds = fees(gross)
    expected_net = round(gross - mdr - gst - tds, 2)
    gap = round(random.uniform(50, 400), 2)
    actual_net = round(expected_net - gap, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd = od + timedelta(days=2)
    add_row("UNEXPLAINED", oid, sid, pid, random.choice(MERCHANTS), gross, mdr, gst, tds, 0.0,
            actual_net, expected_net, od, sd, next_utr(), sid,
            f"unexplained gap of ₹{gap}, matches no known formula", gap)

# ---------- EDGE_DELAYED_REFUND (2) ----------
for _ in range(2):
    gross = round(random.uniform(1500, 6000), 2)
    mdr, gst, tds = fees(gross)
    net = round(gross - mdr - gst - tds, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd = od + timedelta(days=2)
    add_row("EDGE_DELAYED_REFUND", oid, sid, pid, random.choice(MERCHANTS), gross, mdr, gst, tds, 0.0,
            net, net, od, sd, next_utr(), sid,
            "original settlement is clean; a linked refund debit follows later", 0.0)
    refund_amt = round(net * random.uniform(0.2, 0.45), 2)
    refund_date = sd + timedelta(days=random.randint(6, 9))
    bank_rows.append({
        "utr": next_utr(), "credit_amount": round(-refund_amt, 2),
        "credit_date": refund_date.strftime("%Y-%m-%d"),
        "narration": f"RAZORPAY REFUND ADJUSTMENT {oid}",
        "settlement_id_ref": sid,
    })

# ---------- EDGE_SPLIT_SETTLEMENT (1) — one settlement, two bank credits ----------
for _ in range(1):
    gross = round(random.uniform(4000, 9000), 2)
    mdr, gst, tds = fees(gross)
    net = round(gross - mdr - gst - tds, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd1 = od + timedelta(days=2)
    sd2 = od + timedelta(days=4)
    half1 = round(net * 0.5, 2)
    half2 = round(net - half1, 2)
    merchant = random.choice(MERCHANTS)
    settlement_rows.append({
        "settlement_id": sid, "payment_id": pid, "order_id": oid, "merchant_id": merchant,
        "gross_amount": gross, "mdr_fee": mdr, "gst_on_mdr": gst, "tds_amount": tds,
        "refund_amount": 0.0, "net_amount": net, "settlement_date": sd1.strftime("%Y-%m-%d"),
    })
    bank_rows.append({"utr": next_utr(), "credit_amount": half1, "credit_date": sd1.strftime("%Y-%m-%d"),
                       "narration": "NEFT RAZORPAY SETTLEMENT (1/2)", "settlement_id_ref": sid})
    bank_rows.append({"utr": next_utr(), "credit_amount": half2, "credit_date": sd2.strftime("%Y-%m-%d"),
                       "narration": "NEFT RAZORPAY SETTLEMENT (2/2)", "settlement_id_ref": sid})
    ledger_rows.append({"order_id": oid, "merchant_id": merchant, "invoice_amount": gross,
                         "expected_settlement_amount": net, "recorded_date": od.strftime("%Y-%m-%d"),
                         "status": "OPEN"})
    ground_truth_rows.append({"order_id": oid, "settlement_id": sid, "utr": "MULTIPLE",
                               "true_category": "EDGE_SPLIT_SETTLEMENT", "expected_difference": 0.0,
                               "note": "one settlement paid via two separate bank credits, must be summed"})

# ---------- EDGE_POST_RECON_CHARGEBACK (1) ----------
for _ in range(1):
    gross = round(random.uniform(1000, 4000), 2)
    mdr, gst, tds = fees(gross)
    net = round(gross - mdr - gst - tds, 2)
    oid, pid, sid = next_ids()
    od = rand_order_date()
    sd = od + timedelta(days=2)
    merchant = random.choice(MERCHANTS)
    add_row("EDGE_POST_RECON_CHARGEBACK", oid, sid, pid, merchant, gross, mdr, gst, tds, 0.0,
            net, net, od, sd, next_utr(), sid,
            "original settlement clean; a chargeback debit follows with a broken reference", 0.0)
    chargeback_amt = round(net * random.uniform(0.5, 1.0), 2)
    cb_date = sd + timedelta(days=random.randint(12, 16))
    bank_rows.append({
        "utr": next_utr(), "credit_amount": round(-chargeback_amt, 2),
        "credit_date": cb_date.strftime("%Y-%m-%d"),
        "narration": f"CHARGEBACK DEBIT {merchant} REF {oid}",
        "settlement_id_ref": "",
    })

# ---------- NEW: LUMPED_BATCH_MATCHED — TRUE multi-order settlements (3 batches, sizes 5/6/4 = 15 orders) ----------
# This directly demonstrates the core problem-statement claim: "one lumped bank transfer covering
# hundreds of individual orders." Many order-level settlement rows share ONE settlement_id and are
# paid out via ONE single bank credit that the matching engine must correctly sum against.
batch_sizes = [5, 6, 4]
for batch_num, batch_size in enumerate(batch_sizes, start=1):
    merchant = random.choice(MERCHANTS)
    batch_order_date = rand_order_date()
    batch_settle_date = batch_order_date + timedelta(days=2)
    _, _, batch_sid = next_ids()  # one shared settlement_id for the whole batch
    batch_utr = next_utr()
    total_credit = 0.0

    for _ in range(batch_size):
        gross = round(random.uniform(400, 3000), 2)
        mdr, gst, tds = fees(gross)
        net = round(gross - mdr - gst - tds, 2)
        oid, pid, _ = next_ids()  # fresh order/payment id, but reuse the batch's settlement_id
        order_date = batch_order_date
        total_credit = round(total_credit + net, 2)

        settlement_rows.append({
            "settlement_id": batch_sid, "payment_id": pid, "order_id": oid, "merchant_id": merchant,
            "gross_amount": gross, "mdr_fee": mdr, "gst_on_mdr": gst, "tds_amount": tds,
            "refund_amount": 0.0, "net_amount": net,
            "settlement_date": batch_settle_date.strftime("%Y-%m-%d"),
        })
        ledger_rows.append({
            "order_id": oid, "merchant_id": merchant, "invoice_amount": gross,
            "expected_settlement_amount": net, "recorded_date": order_date.strftime("%Y-%m-%d"),
            "status": "OPEN",
        })
        ground_truth_rows.append({
            "order_id": oid, "settlement_id": batch_sid, "utr": batch_utr,
            "true_category": "LUMPED_BATCH_MATCHED", "expected_difference": 0.0,
            "note": f"1 of {batch_size} orders lumped into batch #{batch_num} (settlement_id {batch_sid}), "
                    f"paid via a single shared bank credit",
        })

    # ONE bank row for the entire batch — credit_amount is the SUM of every order's net_amount above
    bank_rows.append({
        "utr": batch_utr, "credit_amount": total_credit,
        "credit_date": batch_settle_date.strftime("%Y-%m-%d"),
        "narration": f"NEFT RAZORPAY SETTLEMENT {merchant} (BATCH {batch_size} ORDERS)",
        "settlement_id_ref": batch_sid,
    })

# ---------- realistic noise: a few blank settlement_id_ref in normal (non-batch) bank rows ----------
eligible = [i for i, r in enumerate(bank_rows)
            if r["settlement_id_ref"] not in ("", None) and "BATCH" not in r["narration"]]
for idx in random.sample(eligible, 3):
    bank_rows[idx]["settlement_id_ref"] = ""

# ---------- shuffle order-level rows so categories aren't grouped in sequence ----------
combined = list(zip(settlement_rows, ledger_rows, ground_truth_rows))
random.shuffle(combined)
settlement_rows, ledger_rows, ground_truth_rows = map(list, zip(*combined))
random.shuffle(bank_rows)


def write_csv(path, rows, fields):
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)


write_csv("/mnt/user-data/outputs/settlement_report.csv", settlement_rows,
          ["settlement_id", "payment_id", "order_id", "merchant_id", "gross_amount", "mdr_fee",
           "gst_on_mdr", "tds_amount", "refund_amount", "net_amount", "settlement_date"])
write_csv("/mnt/user-data/outputs/bank_statement.csv", bank_rows,
          ["utr", "credit_amount", "credit_date", "narration", "settlement_id_ref"])
write_csv("/mnt/user-data/outputs/ledger.csv", ledger_rows,
          ["order_id", "merchant_id", "invoice_amount", "expected_settlement_amount",
           "recorded_date", "status"])
write_csv("/mnt/user-data/outputs/ground_truth.csv", ground_truth_rows,
          ["order_id", "settlement_id", "utr", "true_category", "expected_difference", "note"])

print(f"settlement_report.csv : {len(settlement_rows)} rows")
print(f"bank_statement.csv    : {len(bank_rows)} rows")
print(f"ledger.csv             : {len(ledger_rows)} rows")
print(f"ground_truth.csv       : {len(ground_truth_rows)} rows")

from collections import Counter
counts = Counter(r["true_category"] for r in ground_truth_rows)
print("\nCategory breakdown:")
for cat, n in sorted(counts.items()):
    print(f"  {cat:30s} {n}")

# ---- verification checks ----
print("\n--- Verification: ID columns are no longer swapped ---")
sample = settlement_rows[0]
assert sample["settlement_id"].startswith("stl_"), "settlement_id still swapped!"
assert sample["payment_id"].startswith("pay_"), "payment_id still swapped!"
print(f"  settlement_id starts with 'stl_': {sample['settlement_id']}")
print(f"  payment_id starts with 'pay_':    {sample['payment_id']}")

print("\n--- Verification: lumped batches sum correctly ---")
batch_sids = set(r["settlement_id"] for r in ground_truth_rows if r["true_category"] == "LUMPED_BATCH_MATCHED")
for bsid in batch_sids:
    order_nets = sum(float(r["net_amount"]) for r in settlement_rows if r["settlement_id"] == bsid)
    bank_credit = next(b["credit_amount"] for b in bank_rows if b["settlement_id_ref"] == bsid)
    n_orders = sum(1 for r in settlement_rows if r["settlement_id"] == bsid)
    print(f"  {bsid}: {n_orders} orders, sum(net_amount)={order_nets:.2f}, bank credit={bank_credit:.2f}, "
          f"match={'YES' if abs(order_nets - bank_credit) < 0.01 else 'NO'}")
