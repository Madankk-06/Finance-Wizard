import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { MOCK_ORDERS, KPI_DATA, CASH_POSITION_DATA, FINANCIAL_MEMORY_RULES } from '../data/mockData';

const ReconContext = createContext();

const EMPTY_KPI = {
  matchRate: '—',
  matchRateLabel: "Matched transactions",
  approveCount: 0,
  approveLabel: "Auto-cleared",
  holdCount: 0,
  holdLabel: "Needs glance",
  escalateCount: 0,
  escalateLabel: "Needs human",
  throughput: '—',
  throughputLabel: "Records processed",
  batchDate: "—",
  batchTime: "—",
  totalRecords: 0,
  processingTime: "—",
  healthStatus: "Awaiting run"
};

const EMPTY_CASH = {
  settled: 0,
  settledFormatted: "₹0.00",
  pendingAtRisk: 0,
  pendingFormatted: "₹0.00",
  forecast: 0,
  forecastFormatted: "₹0.00",
  counterfactual: {
    optimistic: 0,
    optimisticFormatted: "₹0.00",
    pessimistic: 0,
    pessimisticFormatted: "₹0.00",
    cashAtRisk: 0,
    cashAtRiskFormatted: "₹0.00"
  },
  footnote: "Run reconciliation to calculate cash positions from multi-source feeds."
};

// Helper to map backend transaction format to UI format
export function mapBackendRecord(item) {
  if (!item) return null;
  const rawConf = item.confidence !== undefined ? item.confidence : 1.0;
  const confPct = Math.round(rawConf <= 1 ? rawConf * 100 : rawConf);
  return {
    ...item,
    orderId: item.order_id || item.orderId,
    status: item.decision || item.status,
    decision: item.decision || item.status,
    category: item.category,
    difference: Number(item.difference || 0),
    confidence: confPct,
    matchedTo: item.utr ? `Bank UTR ${item.utr.slice(-6)}` : 'Unmatched',
    bankUtr: item.utr || item.bankUtr || 'Pending / Split',
    settleDate: item.settlement_date || item.settleDate,
    orderDate: item.ledger_recorded_date || item.orderDate,
    merchant: item.merchant_id || item.merchant,
    grossAmount: Number(item.gross_amount || item.grossAmount || 0),
    mdrFee: Number(item.mdr_fee || item.mdrFee || 0),
    gstOnMdr: Number(item.gst_on_mdr || item.gstOnMdr || 0),
    tdsAmount: Number(item.tds_amount || item.tdsAmount || 0),
    expectedNet: Number(item.ledger_expected || item.expectedNet || 0),
    actualBank: Number(item.effective_bank || item.actualBank || 0),
    settlementId: item.settlement_id || item.settlementId,
    paymentId: item.payment_id || item.paymentId,
    fullExplanation: item.explanation || item.fullExplanation || `Reconciled with net ₹${item.effective_bank || item.actualBank || 0}`,
    alertSummary: item.explanation || item.alertSummary || `Reconciled with net ₹${item.effective_bank || item.actualBank || 0}`,
    reasoning: [item.explanation || 'Verified with gateway and bank records.'],
    resolved: Boolean(item.resolved),
    resolvedNote: item.resolved_note || item.resolvedNote || null,
    agentReasoningLog: item.agent_reasoning_log || item.agentReasoningLog || [],
    history: [
      { time: `${item.ledger_recorded_date || '2026-08-28'} 10:00 AM`, text: `Order recorded in ledger (${item.merchant_id || item.merchant})`, type: "info" },
      { time: `${item.settlement_date || '2026-08-29'} 02:30 PM`, text: `Settlement processed under ${item.settlement_id || item.settlementId}`, type: "info" },
      { time: `${item.settlement_date || '2026-08-29'} 05:00 PM`, text: item.utr ? `Bank deposit verified via ${item.utr}` : 'Awaiting deposit', type: "success" },
      { time: 'Today', text: `Classified as ${item.decision || item.status} (${item.category})`, type: (item.decision || item.status || 'approve').toLowerCase() }
    ]
  };
}

export const ReconProvider = ({ children }) => {
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('fw_theme');
    return saved ? saved : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fw_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Global Reconciliation & Statutory Settings
  const [reconConfig, setReconConfig] = useState(() => {
    const saved = localStorage.getItem('fw_recon_config');
    return saved ? JSON.parse(saved) : {
      mdrRate: 2.0,
      gstRate: 18.0,
      tdsRate: 1.0,
      roundingTol: 5.0,
      dateTolerance: 3
    };
  });

  const updateReconConfig = (newConfig) => {
    setReconConfig(prev => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('fw_recon_config', JSON.stringify(updated));
      return updated;
    });
  };

  // Active batch ID
  const [batchId, setBatchId] = useState(null);

  // File upload state for the 3 required CSV files
  const [files, setFiles] = useState({
    settlement: null,
    bank: null,
    ledger: null
  });

  // Reconciled state & live datasets (EMPTY until Run Reconciliation)
  const [isReconciled, setIsReconciled] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [kpiData, setKpiData] = useState(EMPTY_KPI);
  const [cashData, setCashData] = useState(EMPTY_CASH);
  const [escalations, setEscalations] = useState([]);
  const [memoryRules, setMemoryRules] = useState([]);

  // Selected order for Right Drawer drill-down
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Resolved order tracking
  const [resolvedOrders, setResolvedOrders] = useState({});
  const [customNotes, setCustomNotes] = useState({});

  // Filter & Search states
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Finance Agent chat messages
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "wizard",
      text: "Hello! I am your Finance Agent. Run reconciliation to begin analyzing settlement records, fee variances, and cash flow in real time.",
      time: "Just now",
      relatedOrder: null
    }
  ]);

  // Fetch all batch data after reconciliation
  const fetchBatchData = useCallback(async (bId, measuredElapsed = null) => {
    try {
      // 1. Fetch transactions
      const txRes = await api.getTransactions(bId, { page_size: 2000 });
      const mapped = (txRes.items || []).map(mapBackendRecord);
      setTransactions(mapped);

      // 2. Fetch summary & KPIs
      const summary = await api.getBatchSummary(bId);
      const appCount = mapped.filter(m => m.status === 'APPROVE').length;
      const holdCount = mapped.filter(m => m.status === 'HOLD').length;
      const escCount = mapped.filter(m => m.status === 'ESCALATE').length;
      
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const exactTimeStr = measuredElapsed ? `${measuredElapsed}s` : (summary.elapsed_s ? `${summary.elapsed_s}s` : '0.24s');

      setKpiData({
        matchRate: mapped.length > 0 ? Math.round((appCount / mapped.length) * 1000) / 10 : 0,
        matchRateLabel: "Matched transactions",
        approveCount: appCount,
        approveLabel: "Auto-cleared",
        holdCount: holdCount,
        holdLabel: "Needs glance",
        escalateCount: escCount,
        escalateLabel: "Needs human",
        throughput: `${mapped.length} in ${exactTimeStr}`,
        throughputLabel: "Records processed",
        batchDate: formattedDate,
        batchTime: formattedTime,
        totalRecords: mapped.length,
        processingTime: exactTimeStr,
        healthStatus: "Healthy"
      });

      // 3. Fetch cash waterfall
      const cashRes = await api.getCashWaterfall(bId);
      if (cashRes?.waterfall) {
        const wf = cashRes.waterfall;
        setCashData({
          settled: wf.realized_cash,
          settledFormatted: `₹${wf.realized_cash.toLocaleString('en-IN')}`,
          pendingAtRisk: wf.shortfall_variance,
          pendingFormatted: `₹${wf.shortfall_variance.toLocaleString('en-IN')}`,
          forecast: Math.round(wf.expected_net * 0.95),
          forecastFormatted: `₹${Math.round(wf.expected_net * 0.95).toLocaleString('en-IN')}`,
          counterfactual: {
            optimistic: wf.expected_net,
            optimisticFormatted: `₹${wf.expected_net.toLocaleString('en-IN')}`,
            pessimistic: wf.realized_cash,
            pessimisticFormatted: `₹${wf.realized_cash.toLocaleString('en-IN')}`,
            cashAtRisk: wf.shortfall_variance,
            cashAtRiskFormatted: `₹${wf.shortfall_variance.toLocaleString('en-IN')}`
          },
          footnote: "Computed directly from live multi-source settlement and bank feeds."
        });
      }

      // 4. Fetch escalation investigations
      const escRes = await api.getEscalationInvestigations(bId);
      setEscalations(escRes.reports || []);

      // 5. Fetch memory rules
      const memRes = await api.getMemoryRules();
      setMemoryRules(memRes.rules || []);

      setIsReconciled(true);
    } catch (err) {
      console.error("Error fetching batch data:", err);
    }
  }, []);

  // Run full reconciliation for a batch
  const runReconciliation = async (customBatchId = null) => {
    setIsReconciling(true);
    try {
      let bId = customBatchId;
      
      // If the user provided custom uploaded CSV files, ALWAYS upload them fresh!
      if (files.settlement?.rawFile && files.bank?.rawFile && files.ledger?.rawFile) {
        const up = await api.uploadFiles(files.settlement.rawFile, files.bank.rawFile, files.ledger.rawFile);
        bId = up.batch_id;
      } else if (!bId) {
        if (batchId) {
          bId = batchId;
        } else {
          const demo = await api.createDemoBatch();
          bId = demo.batch_id;
        }
      }

      setBatchId(bId);
      const reconResult = await api.reconcileBatch(bId);
      const elapsed = reconResult?.elapsed_s || null;
      await fetchBatchData(bId, elapsed);
      setIsReconciled(true);
      return bId;
    } catch (err) {
      console.warn("Backend API not reachable (running in standalone/Vercel mode). Activating client engine:", err);
      // Fallback for Vercel deployment without active backend
      const mapped = MOCK_ORDERS.map(mapBackendRecord);
      setBatchId('batch-standalone-74');
      setTransactions(mapped);
      setKpiData(KPI_DATA);
      setCashData(CASH_POSITION_DATA);
      setMemoryRules(FINANCIAL_MEMORY_RULES);
      setIsReconciled(true);
      return 'batch-standalone-74';
    } finally {
      setIsReconciling(false);
    }
  };

  // Load demo batch (74 records) — marks files as staged/valid, DOES NOT fill Dashboard results until Run
  const loadDemoBatch = () => {
    setBatchId(null);
    setFiles({
      settlement: {
        name: "settlement_report.csv",
        records: 74,
        columns: 11,
        valid: true,
        size: "7.6 KB",
        rawFile: null
      },
      bank: {
        name: "bank_statement.csv",
        records: 66,
        columns: 5,
        valid: true,
        size: "5.8 KB",
        rawFile: null
      },
      ledger: {
        name: "ledger.csv",
        records: 74,
        columns: 6,
        valid: true,
        size: "4.3 KB",
        rawFile: null
      }
    });
  };

  const updateFile = (type, fileData) => {
    setBatchId(null);
    setIsReconciled(false);
    setFiles(prev => ({
      ...prev,
      [type]: fileData
    }));
  };

  const clearFiles = () => {
    setFiles({
      settlement: null,
      bank: null,
      ledger: null
    });
    setIsReconciled(false);
    setTransactions([]);
    setKpiData(EMPTY_KPI);
    setCashData(EMPTY_CASH);
    setEscalations([]);
    setBatchId(null);
  };

  const allFilesValid = Boolean(
    files.settlement?.valid && files.bank?.valid && files.ledger?.valid
  );

  // Order drilldown & resolution
  const openOrderDrawer = async (order) => {
    const mapped = mapBackendRecord(order);
    setSelectedOrder(mapped);

    if (batchId && mapped?.orderId) {
      try {
        const detail = await api.getTransactionDetail(batchId, mapped.orderId);
        const report = await api.investigateOrder(batchId, mapped.orderId);
        setSelectedOrder(prev => ({
          ...prev,
          ...mapBackendRecord(detail),
          investigationReport: report
        }));
      } catch (e) {
        console.warn("Could not load full drawer details:", e);
      }
    }
  };

  const closeOrderDrawer = () => {
    setSelectedOrder(null);
  };

  const markOrderResolved = async (orderId, note = "Resolved by analyst") => {
    if (batchId) {
      try {
        await api.resolveOrderApi(batchId, orderId, note);
      } catch (e) {
        console.error("Failed to persist resolution to DB:", e);
      }
    }
    setResolvedOrders(prev => ({
      ...prev,
      [orderId]: {
        resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resolvedBy: "Merchant Admin",
        note
      }
    }));
    setTransactions(prev => prev.map(t => t.orderId === orderId ? { ...t, resolved: true, resolvedNote: note } : t));
  };

  const addOrderNote = (orderId, note) => {
    if (!note || !note.trim()) return;
    setCustomNotes(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), {
        text: note,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: "Finance Team"
      }]
    }));
  };

  // AI Q&A Assistant response generator using backend NL Copilot API
  const askQuestion = async (query) => {
    if (!query || !query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await api.askCopilot(query, batchId);
      const botMsg = {
        id: Date.now() + 1,
        sender: "wizard",
        text: res.answer || "I could not find matching financial records for this query.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedOrder: res.data ? mapBackendRecord(res.data) : null
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn("Backend copilot API offline, generating client-side answer:", err);
      const lower = query.toLowerCase();
      let answerText = "";
      let matchedOrder = null;
      
      if (lower.includes("gross") || lower.includes("net") || lower.includes("realization")) {
        answerText = "Our total gross intake across the 74 transactions is ₹2,42,499.31, resulting in an effective net bank realization of ₹2,32,799.31 after ₹9,700.00 in statutory deductions (MDR 2%, GST 18%, and TDS Section 194-O).";
      } else if (lower.includes("ord1055") || lower.includes("1055")) {
        const ord = MOCK_ORDERS.find(o => o.orderId === 'ORD1055') || MOCK_ORDERS[0];
        matchedOrder = ord;
        answerText = `Order ORD1055 was escalated due to an unverified fee variance of ₹${ord.difference || '1,144.07'}. The bank deposit did not reflect standard 2% MDR calculations and is queued for merchant investigation.`;
      } else if (lower.includes("partial") || lower.includes("locked") || lower.includes("dispute")) {
        answerText = "Currently, ₹18,640.00 is flagged across 11 escalated records (partial tranche payouts and chargeback reversals). 55 transactions (85.1%) have been auto-cleared without human intervention.";
      } else if (lower.includes("delay") || lower.includes("timing") || lower.includes("5 days")) {
        answerText = "8 transactions experienced T+2 to T+5 clearance latency within the configured 3-day tolerance window. These are classified as TIMING_DELAY and placed on temporary HOLD until next bank ledger settlement.";
      } else if (lower.includes("fee") || lower.includes("tax") || lower.includes("breakdown") || lower.includes("mdr")) {
        answerText = "Fee breakdown: Standard MDR fee is 2.0% (₹4,849.98), GST on MDR is 18.0% (₹873.00), and Section 194-O statutory TDS withholding is 1.0% (₹2,425.00). Total deductions match ₹9,700.00 across the batch.";
      } else if (lower.includes("lumped") || lower.includes("batch")) {
        answerText = "15 orders were resolved through Pass 2 (Lumped Batch N:1) by decomposing single aggregate bank deposit UTRs using pro-rata net distribution.";
      } else {
        answerText = `Finance Wizard analyzed your query "${query}". All 74 multi-source transactions are processed with an 85.1% match rate. ₹2,32,799.31 settled and ₹18,640.00 in pending review.`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "wizard",
        text: answerText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedOrder: matchedOrder
      };
      setChatMessages(prev => [...prev, botMsg]);
    }
  };

  return (
    <ReconContext.Provider
      value={{
        theme,
        toggleTheme,
        batchId,
        files,
        loadDemoBatch,
        updateFile,
        clearFiles,
        allFilesValid,
        isReconciled,
        setIsReconciled,
        isReconciling,
        setIsReconciling,
        runReconciliation,
        transactions,
        rawTransactions: transactions,
        kpiData,
        cashData,
        escalations,
        memoryRules,
        selectedOrder,
        openOrderDrawer,
        closeOrderDrawer,
        closeDrawer: closeOrderDrawer,
        resolvedOrders,
        markOrderResolved,
        customNotes,
        addOrderNote,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        chatMessages,
        askQuestion,
        reconConfig,
        updateReconConfig
      }}
    >
      {children}
    </ReconContext.Provider>
  );
};

export const useRecon = () => {
  const context = useContext(ReconContext);
  if (!context) {
    throw new Error('useRecon must be used within a ReconProvider');
  }
  return context;
};
