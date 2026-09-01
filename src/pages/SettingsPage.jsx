import React, { useState, useEffect } from 'react';
import HeaderChrome from '../components/HeaderChrome';
import StatusBar from '../components/StatusBar';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Percent, 
  Sliders, 
  Lock, 
  Code2, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Terminal, 
  ExternalLink,
  Award,
  Heart,
  Globe,
  Bot,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useRecon } from '../context/ReconContext';
import AuthorConnectCard from '../components/AuthorConnectCard';


export default function SettingsPage() {
  const { theme, reconConfig, updateReconConfig } = useRecon();
  const isDark = theme === 'dark';

  // Config State initialized from Global Recon Config
  const [mdrRate, setMdrRate] = useState(String(reconConfig?.mdrRate ?? "2.0"));
  const [gstRate, setGstRate] = useState(String(reconConfig?.gstRate ?? "18.0"));
  const [tdsRate, setTdsRate] = useState(String(reconConfig?.tdsRate ?? "1.0"));
  const [roundingTol, setRoundingTol] = useState(String(reconConfig?.roundingTol ?? "5.00"));
  const [dateTolerance, setDateTolerance] = useState(String(reconConfig?.dateTolerance ?? "3"));
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if external reconConfig changes
  useEffect(() => {
    if (reconConfig) {
      setMdrRate(String(reconConfig.mdrRate ?? "2.0"));
      setGstRate(String(reconConfig.gstRate ?? "18.0"));
      setTdsRate(String(reconConfig.tdsRate ?? "1.0"));
      setRoundingTol(String(reconConfig.roundingTol ?? "5.00"));
      setDateTolerance(String(reconConfig.dateTolerance ?? "3"));
    }
  }, [reconConfig]);

  // Check if current inputs differ from active configuration
  const hasChanges = 
    parseFloat(mdrRate) !== (reconConfig?.mdrRate ?? 2.0) ||
    parseFloat(gstRate) !== (reconConfig?.gstRate ?? 18.0) ||
    parseFloat(tdsRate) !== (reconConfig?.tdsRate ?? 1.0) ||
    parseFloat(roundingTol) !== (reconConfig?.roundingTol ?? 5.0) ||
    parseInt(dateTolerance, 10) !== (reconConfig?.dateTolerance ?? 3);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateReconConfig) {
      updateReconConfig({
        mdrRate: parseFloat(mdrRate) || 2.0,
        gstRate: parseFloat(gstRate) || 18.0,
        tdsRate: parseFloat(tdsRate) || 1.0,
        roundingTol: parseFloat(roundingTol) || 5.0,
        dateTolerance: parseInt(dateTolerance, 10) || 3
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setMdrRate("2.0");
    setGstRate("18.0");
    setTdsRate("1.0");
    setRoundingTol("5.00");
    setDateTolerance("3");
    if (updateReconConfig) {
      updateReconConfig({
        mdrRate: 2.0,
        gstRate: 18.0,
        tdsRate: 1.0,
        roundingTol: 5.0,
        dateTolerance: 3
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Settings & System Configuration" 
        subtitle="Reconciliation rule parameters, statutory fee rates, AI agent engine & security controls" 
      />

      <div className="content-body" style={{ flex: 1, maxWidth: '1150px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px 40px' }}>
        
        {/* Author Connect Card */}
        <AuthorConnectCard />

        {/* Section 1: Statutory Deductions & Matching Tolerance */}
        <div className="card-base" style={{ padding: '30px 34px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Percent size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Statutory Fee & Deductions Parameters
              </h3>
            </div>
            {hasChanges && (
              <span className="badge-hold" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <AlertTriangle size={13} />
                Unsaved Metric Changes
              </span>
            )}
          </div>
          
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 22px 0' }}>
            Configure standard merchant discount rates, indirect taxes, and tax withholding percentages applied during reconciliation.
          </p>

          {/* User-Friendly Warning / Impact Indication Banner */}
          {hasChanges && (
            <div style={{
              backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : '#FFFBEB',
              border: '1px solid var(--status-hold-border)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '22px',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <AlertTriangle size={19} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '13.5px', display: 'block', marginBottom: '2px' }}>
                  Configuration Impact Notice
                </strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Modifying these parameters will dynamically update statutory fee formulas, auto-approval thresholds, and waterfall calculations across all reports and reconciliation runs.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Grid Row 1: Statutory Rates (3 Equal Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  MDR Gateway Fee Rate (%)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={mdrRate} 
                  onChange={(e) => setMdrRate(e.target.value)}
                  className="input-base" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid var(--border-strong)' }}
                />
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Default: 2.0% on Gross Volume</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  GST on MDR Rate (%)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={gstRate} 
                  onChange={(e) => setGstRate(e.target.value)}
                  className="input-base" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid var(--border-strong)' }}
                />
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Default: 18.0% on MDR Fee</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Section 194-O TDS Rate (%)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={tdsRate} 
                  onChange={(e) => setTdsRate(e.target.value)}
                  className="input-base" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid var(--border-strong)' }}
                />
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Default: 1.0% Statutory Withholding</span>
              </div>
            </div>

            {/* Grid Row 2: Thresholds & Tolerance (2 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Rounding Tolerance Threshold (₹)
                </label>
                <input 
                  type="number" 
                  step="0.5"
                  min="0"
                  value={roundingTol} 
                  onChange={(e) => setRoundingTol(e.target.value)}
                  className="input-base" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid var(--border-strong)' }}
                />
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Auto-approves differences ≤ threshold</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Date Window Tolerance (Days)
                </label>
                <input 
                  type="number" 
                  min="0"
                  max="30"
                  value={dateTolerance} 
                  onChange={(e) => setDateTolerance(e.target.value)}
                  className="input-base" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid var(--border-strong)' }}
                />
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Allowed holiday/weekend settlement clearance latency</span>
              </div>
            </div>

            {/* Actions Bar: Save & Reset Buttons Aligned */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <button 
                type="button" 
                onClick={handleResetDefaults}
                className="btn-secondary" 
                style={{ padding: '10px 18px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={15} />
                <span>Reset to Defaults</span>
              </button>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{
                  padding: '10px 24px', 
                  fontSize: '14px',
                  boxShadow: hasChanges ? '0 0 16px var(--primary-glow)' : 'none'
                }}
              >
                {savedSuccess ? "✓ Parameters Saved & Applied Globally" : "Save Parameters"}
              </button>
            </div>

          </form>
        </div>

        {/* Section 2: AI Agent & LLM Engine Settings */}
        <div className="card-base" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                AI Investigative Agent & Copilot Governance
              </h3>
            </div>
            <span className="badge-approve" style={{ fontSize: '12px' }}>● Engine Active</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
            Orchestration for automated discrepancy diagnostics, reasoning logs, and natural language copilot.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Diagnostic Code Tools</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                6 Forensic Code Tools Active
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Source row joins, fee recalculation, date window, partial checks & bank debits
              </div>
            </div>

            <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Enterprise Security Vault</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--status-approve)', marginTop: '4px' }}>
                Encrypted Server-Side Vault
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Zero client-side key exposure. Authentication managed securely in backend environment.
              </div>
            </div>

            <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Financial Query Copilot</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
                Active & Grounded
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Factual arithmetic synthesis with full audit-trail logging
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Security & Cryptography */}
        <div className="card-base" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Lock size={20} color="var(--secondary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Enterprise Data Security & Audit Controls
            </h3>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
            Comprehensive protection for financial identifiers, transaction records, and ledger events.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderRadius: '8px', backgroundColor: 'var(--bg-input)' }}>
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>Data Privacy & Field Protection</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Customer identifiers, transaction references, and settlement dates encrypted at rest</div>
              </div>
              <span className="badge-approve">Encrypted & Protected</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderRadius: '8px', backgroundColor: 'var(--bg-input)' }}>
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>Immutable Audit Trail</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Append-only ledger recording all ingestion, reconciliation, and analyst review events</div>
              </div>
              <span className="badge-approve">Active & Monitored</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderRadius: '8px', backgroundColor: 'var(--bg-input)' }}>
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>Isolated Secure Storage</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Encrypted local database cluster with concurrent write protection</div>
              </div>
              <span className="badge-valid">Operational</span>
            </div>
          </div>
        </div>

      </div>

      <StatusBar />
    </div>
  );
}
