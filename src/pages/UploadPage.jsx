import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Info, Loader2, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { useRecon } from '../context/ReconContext';
import FileUploadCard from '../components/FileUploadCard';
import ThemeToggle from '../components/ThemeToggle';

export default function UploadPage() {
  const navigate = useNavigate();
  const { files, updateFile, loadDemoBatch, allFilesValid, runReconciliation, theme } = useRecon();
  const [loading, setLoading] = useState(false);
  const [reconcileStep, setReconcileStep] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRunReconciliation = async () => {
    if (!allFilesValid) return;
    setLoading(true);
    setErrorMessage(null);
    setReconcileStep("Matching records across settlement, bank statement, and ledger...");

    try {
      setReconcileStep("Running 4-pass deterministic matcher & 11-priority classifier...");
      await runReconciliation();
      setReconcileStep("Auto-investigating escalated items & generating cash projections...");
      setLoading(false);
      navigate('/dashboard', { replace: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      console.error("Reconciliation execution failed:", err);
      setErrorMessage("Reconciliation service is unreachable or starting up. Ensure the backend server is running on port 8000.");
      setReconcileStep("");
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="content-body" style={{ maxWidth: '1350px', margin: '0 auto', padding: '36px 40px' }}>
      
      {/* Top Header & Demo Loader Button */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '36px'
      }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Upload source files
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '8px', margin: 0, fontWeight: 500 }}>
            Upload the three required CSV files to begin the settlement audit process.
          </p>
        </div>

        {/* Top Actions: Theme Toggle + Load Demo Batch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />

          <button
            onClick={loadDemoBatch}
            className="btn-secondary"
            style={{
              padding: '12px 20px',
              fontSize: '14.5px',
              fontWeight: 700,
              color: 'var(--primary)',
              borderColor: 'var(--primary)',
              backgroundColor: 'var(--bg-active-nav)'
            }}
          >
            <Database size={18} color="var(--primary)" />
            <span>Load demo batch (74 records)</span>
          </button>
        </div>
      </div>

      {/* 3 Upload Cards strictly arranged on the same row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '20px',
        marginBottom: '32px',
        width: '100%'
      }}>
        {/* Card 1: Settlement Report */}
        <FileUploadCard
          index={1}
          title="Settlement Report"
          defaultFileName="settlement.csv"
          color={isDark ? "#34D399" : "#059669"}
          bgLight={isDark ? "rgba(52, 211, 153, 0.15)" : "#ECFDF5"}
          fileState={files.settlement}
          onUpload={(data) => updateFile('settlement', data)}
          onClear={() => updateFile('settlement', null)}
        />

        {/* Card 2: Bank Statement */}
        <FileUploadCard
          index={2}
          title="Bank Statement"
          defaultFileName="bank_statement.csv"
          color={isDark ? "#7DD3FC" : "#0284C7"}
          bgLight={isDark ? "rgba(125, 211, 252, 0.15)" : "#E0F2FE"}
          fileState={files.bank}
          onUpload={(data) => updateFile('bank', data)}
          onClear={() => updateFile('bank', null)}
        />

        {/* Card 3: Internal Ledger */}
        <FileUploadCard
          index={3}
          title="Internal Ledger"
          defaultFileName="ledger.csv"
          color={isDark ? "#C8A0F0" : "#7C3AED"}
          bgLight={isDark ? "rgba(200, 160, 240, 0.18)" : "#F3E8FF"}
          fileState={files.ledger}
          onUpload={(data) => updateFile('ledger', data)}
          onClear={() => updateFile('ledger', null)}
        />
      </div>

      {/* Error Alert if backend unreachable */}
      {errorMessage && (
        <div style={{
          backgroundColor: 'var(--status-escalate-bg)',
          border: '1px solid var(--status-escalate-border)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: 'var(--status-escalate)',
          fontSize: '14px',
          fontWeight: 600
        }}>
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>{errorMessage}</div>
          <button 
            onClick={handleRunReconciliation}
            className="btn-secondary" 
            style={{ padding: '6px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Notice & Run Reconciliation CTA */}
      <div className="card-base" style={{
        backgroundColor: 'var(--bg-card)',
        padding: '24px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Left Info alert */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: allFilesValid ? 'var(--status-approve-bg)' : 'var(--bg-active-nav)',
            border: `1px solid ${allFilesValid ? 'var(--status-approve-border)' : 'var(--border-strong)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: allFilesValid ? 'var(--status-approve)' : 'var(--primary)'
          }}>
            {allFilesValid ? <CheckCircle size={18} /> : <Info size={18} />}
          </div>
          <span style={{ fontSize: '15px', color: allFilesValid ? 'var(--status-approve)' : 'var(--text-secondary)', fontWeight: 600 }}>
            {allFilesValid 
              ? "All 3 files loaded and verified. Ready to run reconciliation."
              : "Run reconciliation is enabled only when all three files are valid."}
          </span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleRunReconciliation}
          disabled={!allFilesValid || loading}
          className="btn-primary"
          style={{
            padding: '14px 32px',
            fontSize: '16px',
            minWidth: '220px',
            justifyContent: 'center'
          }}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Auditing...</span>
            </>
          ) : (
            <>
              <Play size={18} fill={isDark ? '#0F172A' : '#FFFFFF'} />
              <span>Run Reconciliation</span>
            </>
          )}
        </button>
      </div>

      {/* Loading overlay modal if processing */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--modal-backdrop)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 35px var(--primary-glow)',
            border: '2px solid var(--border-strong)',
            backgroundColor: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="/logo.png" alt="Finance Wizard" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <div style={{
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            padding: '24px 36px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-strong)'
          }}>
            <h3 style={{ fontSize: '22px', color: 'var(--text-main)', margin: '0 0 10px 0', fontWeight: 800 }}>
              Reconciling Settlement Data
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, maxWidth: '440px', fontWeight: 500 }}>
              {reconcileStep}
            </p>

            <div style={{
              width: '320px',
              height: '6px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginTop: '20px',
              position: 'relative'
            }}>
              <div style={{
                width: '65%',
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--tertiary))',
                borderRadius: '3px',
                animation: 'pulseGlow 1.2s infinite ease-in-out'
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
