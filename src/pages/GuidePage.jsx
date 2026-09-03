import React, { useState, useEffect } from 'react';
import HeaderChrome from '../components/HeaderChrome';
import StatusBar from '../components/StatusBar';
import { 
  BookOpen, 
  BrainCircuit, 
  CheckCircle2, 
  Percent, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useRecon } from '../context/ReconContext';
import * as api from '../services/api';
import { FINANCIAL_MEMORY_RULES } from '../data/mockData';

export default function GuidePage() {
  const { theme, memoryRules = [], reconConfig } = useRecon();
  const [liveRules, setLiveRules] = useState(FINANCIAL_MEMORY_RULES);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (memoryRules && memoryRules.length > 0) {
      setLiveRules(memoryRules);
    } else {
      api.getMemoryRules().then(res => {
        if (res?.rules && res.rules.length > 0) setLiveRules(res.rules);
        else setLiveRules(FINANCIAL_MEMORY_RULES);
      }).catch(err => {
        console.warn("Failed to fetch memory rules, using calibrated rule store:", err);
        setLiveRules(FINANCIAL_MEMORY_RULES);
      });
    }
  }, [memoryRules]);

  const rulesToDisplay = liveRules.map((r, idx) => ({
    id: `RULE-${String(idx + 1).padStart(2, '0')}`,
    name: (r.pattern_key || '').replace(/_/g, ' '),
    pattern: r.category,
    confidence: `${Math.round((r.confidence || 1.0) * 100)}%`,
    appliedCount: r.applied_count || 0,
    status: "Active",
    description: r.description
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Reconciliation & Rule Guide" 
        subtitle="Complete reference for autonomous rule patterns, statutory fee formulas, matching logic & classification hierarchy" 
      />

      <div className="content-body" style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px 40px' }}>
        
        {/* Intro Card */}
        <div className="card-base" style={{
          backgroundColor: 'var(--bg-card)',
          borderLeft: '5px solid var(--primary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '24px 28px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: isDark ? 'rgba(125, 211, 252, 0.15)' : '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}>
            <BookOpen size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Finance Wizard Operations & Rules Reference Guide
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
              This guide provides complete documentation on how Finance Wizard matches multi-source data, calculates statutory fees, classifies variances, and applies autonomous institutional rules.
            </p>
          </div>
        </div>

        {/* ── SECTION 1: INSTITUTIONAL FINANCIAL RULES TABS (RULE-01 to RULE-N) ─ */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BrainCircuit size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Institutional Rule Patterns (Financial Memory)
              </h3>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
              {rulesToDisplay.length} Active System Rules
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {rulesToDisplay.map((rule) => (
              <div key={rule.id} className="card-base" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 800 }}>
                    {rule.id}
                  </span>
                  <span className="badge-valid">
                    {rule.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '16.5px', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
                  {rule.name}
                </h4>

                <div style={{
                  backgroundColor: 'var(--bg-input)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '12.5px',
                  color: 'var(--tertiary)',
                  fontWeight: 600,
                  border: '1px solid var(--border-subtle)'
                }}>
                  {rule.pattern}
                </div>

                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {rule.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12.5px',
                  color: 'var(--text-muted)',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: 'auto'
                }}>
                  <span>Confidence: <strong style={{ color: 'var(--status-approve)' }}>{rule.confidence}</strong></span>
                  <span>Applied to: <strong style={{ color: 'var(--text-main)' }}>{rule.appliedCount} orders</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: 4-PASS MATCHING CASCADE REFERENCE ─────────────────── */}
        <div className="card-base" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Layers size={20} color="var(--secondary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              4-Pass Deterministic Matching Logic
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px 18px', borderRadius: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase' }}>Pass 1: Direct 1-to-1 Match</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: 1.45 }}>
                Directly matches orders where 1 settlement record precisely pairs with 1 bank statement credit and ledger entry.
              </p>
            </div>

            <div style={{ padding: '16px 18px', borderRadius: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase' }}>Pass 2: Lumped Group Payout (N:1)</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: 1.45 }}>
                Resolves situations where the payment gateway bundles multiple customer orders into a single consolidated NEFT deposit.
              </p>
            </div>

            <div style={{ padding: '16px 18px', borderRadius: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#EC4899', textTransform: 'uppercase' }}>Pass 3: Split Tranches (1:N)</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: 1.45 }}>
                Detects high-ticket transactions disbursed across two or more separate bank deposit tranches summing to net invoiced value.
              </p>
            </div>

            <div style={{ padding: '16px 18px', borderRadius: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>Pass 4: Timing Latency & Tolerance</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: 1.45 }}>
                Matches orders delayed across bank holidays or weekends within the configured date window and rounding threshold.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: STATUTORY FEE DEDUCTION FORMULA ───────────────────── */}
        <div className="card-base" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Percent size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Statutory Fee & Deductions Formula (India Tax Law)
            </h3>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
            The deterministic arithmetic waterfall used to compute expected net bank deposits:
          </p>

          <div style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: 'var(--text-main)',
            lineHeight: 1.6
          }}>
            <div>• <strong>Gross Order Value (G)</strong> = 100% Invoiced Amount</div>
            <div>• <strong>MDR Fee</strong> = G × {reconConfig?.mdrRate ?? 2.0}% (Gateway processing fee)</div>
            <div>• <strong>GST on MDR</strong> = MDR × {reconConfig?.gstRate ?? 18.0}% (18% Indirect Tax)</div>
            <div>• <strong>TDS Withholding</strong> = G × {reconConfig?.tdsRate ?? 1.0}% (Section 194-O Income Tax)</div>
            <div style={{ color: 'var(--status-approve)', fontWeight: 800, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              ➜ <strong>Expected Net Realized Bank Deposit</strong> = G − MDR − GST − TDS
            </div>
          </div>
        </div>

      </div>

      <StatusBar />
    </div>
  );
}
