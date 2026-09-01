import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Download, Calendar, Check, ChevronDown, FileSpreadsheet, FileWarning, TrendingUp } from 'lucide-react';
import { useRecon } from '../context/ReconContext';
import { exportReconciliationCSV, exportEscalationsCSV, exportCashStatementCSV } from '../utils/exportUtils';
import ThemeToggle from './ThemeToggle';

export default function HeaderChrome({ title = "Dashboard", subtitle = null }) {
  const navigate = useNavigate();
  const { clearFiles, isReconciled, kpiData, batchId, transactions, cashData } = useRecon();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportNotice, setExportNotice] = useState(null);

  const handleNewRun = () => {
    clearFiles();
    navigate('/upload');
  };

  const handleExport = (type) => {
    setShowExportMenu(false);
    if (!isReconciled || !transactions || transactions.length === 0) {
      setExportNotice("Please run reconciliation first to generate export files.");
      setTimeout(() => setExportNotice(null), 3500);
      return;
    }

    let success = false;
    if (type === "RECON_CSV") {
      success = exportReconciliationCSV(transactions, batchId || 'batch');
      if (success) setExportNotice(`Downloaded full reconciliation report (${transactions.length} records).`);
    } else if (type === "ESCALATE_CSV") {
      success = exportEscalationsCSV(transactions, batchId || 'batch');
      if (success) setExportNotice("Downloaded escalations exception report.");
    } else if (type === "CASH_CSV") {
      success = exportCashStatementCSV(cashData, kpiData, batchId || 'batch');
      if (success) setExportNotice("Downloaded cash position & liquidity statement.");
    }

    if (!success) {
      setExportNotice("No matching records found for this export filter.");
    }

    setTimeout(() => setExportNotice(null), 3500);
  };

  const defaultSubtitle = isReconciled ? (
    <span>
      Batch <strong style={{ color: 'var(--text-main)' }}>{batchId ? batchId.slice(0, 8) : 'Active'}</strong> • {kpiData.totalRecords} records • Reconciled at {kpiData.batchDate} {kpiData.batchTime} ({kpiData.processingTime})
    </span>
  ) : (
    <span>
      No active batch • Upload source CSVs to begin reconciliation
    </span>
  );

  return (
    <div style={{
      padding: '24px 40px 18px 40px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-header)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Title & Metadata */}
      <div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '6px',
          fontSize: '14px',
          color: 'var(--text-muted)'
        }}>
          {subtitle || defaultSubtitle}
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        
        {/* Theme Toggle Button */}
        <ThemeToggle compact={false} showLabel={false} />

        {/* New Run Button */}
        <button
          onClick={handleNewRun}
          className="btn-secondary"
          title="Return to Upload & Start to load another dataset"
          style={{ padding: '10px 18px', fontSize: '14px' }}
        >
          <RotateCcw size={16} color="var(--primary)" />
          <span>New Run</span>
        </button>

        {/* Export Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '14px' }}
          >
            <Download size={16} color="var(--primary)" />
            <span>Export</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showExportMenu && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              borderRadius: '10px',
              padding: '8px',
              width: '310px',
              zIndex: 40,
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <button
                onClick={() => handleExport("RECON_CSV")}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FileSpreadsheet size={17} color="var(--status-approve)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700 }}>Complete Reconciliation Audit</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>Full 74-record dataset with all fees</span>
                </div>
              </button>

              <button
                onClick={() => handleExport("ESCALATE_CSV")}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FileWarning size={17} color="var(--status-escalate)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700 }}>Unresolved Discrepancies Report</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>11 flagged exceptions requiring review</span>
                </div>
              </button>

              <button
                onClick={() => handleExport("CASH_CSV")}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <TrendingUp size={17} color="var(--primary)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700 }}>Cash Position & Financial Statement</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>Net settled cash, deductions & forecast</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Date Selector Chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '9px 16px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-strong)',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          fontWeight: 600
        }}>
          <Calendar size={16} color="var(--primary)" />
          <span>{isReconciled ? `${kpiData.batchDate} • ${kpiData.batchTime}` : `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • Live`}</span>
        </div>
      </div>

      {/* Export Toast notification */}
      {exportNotice && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '32px',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-strong)',
          fontWeight: 700,
          padding: '12px 22px',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.2s ease',
          fontSize: '14.5px'
        }}>
          <Check size={18} color="var(--status-approve)" />
          <span>{exportNotice}</span>
        </div>
      )}
    </div>
  );
}
