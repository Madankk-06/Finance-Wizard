/**
 * src/services/api.js — Finance Wizard Backend API Client
 * 
 * Provides unified, typed functions for calling the FastAPI reconciliation engine.
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

/**
 * Health check
 */
export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

/**
 * Ingest sample data (Phase 1)
 */
export async function createDemoBatch() {
  const res = await fetch(`${API_BASE}/demo-batch`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to create demo batch');
  return res.json();
}

/**
 * Ingest uploaded CSVs (Phase 1)
 */
export async function uploadFiles(settlementFile, bankFile, ledgerFile) {
  const formData = new FormData();
  formData.append('settlement', settlementFile);
  formData.append('bank', bankFile);
  formData.append('ledger', ledgerFile);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload reconciliation files');
  return res.json();
}

/**
 * Run deterministic match & classify (Phase 2 & 3)
 */
export async function reconcileBatch(batchId) {
  const res = await fetch(`${API_BASE}/reconcile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batch_id: batchId }),
  });
  if (!res.ok) throw new Error('Failed to reconcile batch');
  return res.json();
}

/**
 * Get batch summary & KPIs
 */
export async function getBatchSummary(batchId) {
  const res = await fetch(`${API_BASE}/batch/${batchId}/summary`);
  if (!res.ok) throw new Error('Failed to fetch batch summary');
  return res.json();
}

/**
 * Get all classified transactions (Phase 3 & 5)
 */
export async function getTransactions(batchId, { page = 1, pageSize = 100, decision, category, search } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (decision) params.append('decision', decision);
  if (category) params.append('category', category);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/batch/${batchId}/transactions?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

/**
 * Get single order details (Order Drawer)
 */
export async function getTransactionDetail(batchId, orderId) {
  const res = await fetch(`${API_BASE}/batch/${batchId}/transactions/${orderId}`);
  if (!res.ok) throw new Error(`Failed to fetch details for order ${orderId}`);
  return res.json();
}

/**
 * Get exception queue
 */
export async function getExceptions(batchId) {
  const res = await fetch(`${API_BASE}/batch/${batchId}/exceptions`);
  if (!res.ok) throw new Error('Failed to fetch exceptions');
  return res.json();
}

/**
 * Get cash position waterfall
 */
export async function getCashWaterfall(batchId) {
  const res = await fetch(`${API_BASE}/batch/${batchId}/cash/waterfall`);
  if (!res.ok) throw new Error('Failed to fetch cash waterfall');
  return res.json();
}

/**
 * Run counterfactual simulator (Phase 7)
 */
export async function simulateCashScenario(batchId, scenario) {
  const res = await fetch(`${API_BASE}/batch/${batchId}/cash/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scenario),
  });
  if (!res.ok) throw new Error('Failed to run cash simulation');
  return res.json();
}

/**
 * Get cash forecast timeline (Phase 7)
 */
export async function getCashForecast(batchId) {
  const res = await fetch(`${API_BASE}/batch/${batchId}/cash/forecast`);
  if (!res.ok) throw new Error('Failed to fetch cash forecast');
  return res.json();
}

/**
 * Investigate single order (Phase 4)
 */
export async function investigateOrder(batchId, orderId) {
  const res = await fetch(`${API_BASE}/batch/${batchId}/investigate/${orderId}`);
  if (!res.ok) throw new Error(`Failed to investigate order ${orderId}`);
  return res.json();
}

/**
 * Investigate all escalated items in batch (Phase 4 Escalation Queue)
 */
export async function getEscalationInvestigations(batchId) {
  const res = await fetch(`${API_BASE}/batch/${batchId}/investigate`);
  if (!res.ok) throw new Error('Failed to fetch escalation investigations');
  return res.json();
}

/**
 * Mark order as resolved by analyst
 */
export async function resolveOrderApi(batchId, orderId, note = '') {
  const res = await fetch(`${API_BASE}/batch/${batchId}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, note }),
  });
  if (!res.ok) throw new Error(`Failed to resolve order ${orderId}`);
  return res.json();
}

/**
 * Ask NL Copilot (Phase 8)
 */
export async function askCopilot(query, batchId = null) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, batch_id: batchId }),
  });
  if (!res.ok) throw new Error('Failed to execute NL query');
  return res.json();
}

/**
 * Get starter suggestions for Ask Copilot
 */
export async function getAskSuggestions() {
  const res = await fetch(`${API_BASE}/ask/suggestions`);
  if (!res.ok) throw new Error('Failed to fetch suggestions');
  return res.json();
}

/**
 * Get financial memory rules (Phase 6)
 */
export async function getMemoryRules() {
  const res = await fetch(`${API_BASE}/memory`);
  if (!res.ok) throw new Error('Failed to fetch memory rules');
  return res.json();
}

/**
 * Add / update a financial memory rule (Phase 6)
 */
export async function saveMemoryRule(rule) {
  const res = await fetch(`${API_BASE}/memory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  });
  if (!res.ok) throw new Error('Failed to save memory rule');
  return res.json();
}

/**
 * Delete a financial memory rule (Phase 6)
 */
export async function deleteMemoryRule(ruleId) {
  const res = await fetch(`${API_BASE}/memory/${ruleId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete memory rule');
  return res.json();
}
