import React from 'react';
import { NavLink } from 'react-router-dom';
import { Database, FileText, Clock, Settings as SettingsIcon } from 'lucide-react';
import { useRecon } from '../context/ReconContext';

export default function StatusBar() {
  const { files, kpiData, isReconciled } = useRecon();

  const loadedCount = [files.settlement?.valid, files.bank?.valid, files.ledger?.valid].filter(Boolean).length;

  return (
    <footer className="status-bar">
      <div className="status-bar-item">
        <FileText size={16} color="var(--primary)" />
        <span>Files loaded: <strong style={{ color: 'var(--text-main)' }}>{loadedCount} / 3</strong></span>
      </div>

      <span className="status-bar-divider">|</span>

      <div className="status-bar-item">
        <Database size={16} color="var(--secondary)" />
        <span>Total records: <strong style={{ color: 'var(--text-main)' }}>{isReconciled ? kpiData.totalRecords : 0}</strong></span>
      </div>

      <span className="status-bar-divider">|</span>

      <div className="status-bar-item">
        <Clock size={16} color="var(--primary)" />
        <span>Processing time: <strong style={{ color: 'var(--text-main)' }}>{isReconciled ? kpiData.processingTime : '—'}</strong></span>
      </div>

      <span className="status-bar-divider">|</span>

      <div className="status-bar-item">
        <span>Last run: <strong style={{ color: 'var(--text-main)' }}>{isReconciled ? `${kpiData.batchDate} ${kpiData.batchTime}` : 'Awaiting run'}</strong></span>
      </div>

      <span className="status-bar-divider">|</span>

      <div className="status-bar-item">
        <span className="healthy-dot" style={{ backgroundColor: isReconciled ? 'var(--status-approve)' : 'var(--text-muted)' }} />
        <span>Data health: <strong style={{ color: isReconciled ? 'var(--status-approve)' : 'var(--text-muted)' }}>{isReconciled ? 'Healthy' : 'Awaiting run'}</strong></span>
      </div>

      <span className="status-bar-divider">|</span>

      <NavLink 
        to="/settings" 
        className="status-bar-item" 
        style={{ 
          color: 'var(--text-secondary)', 
          textDecoration: 'none', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 600
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <SettingsIcon size={15} color="var(--primary)" />
        <span>Settings</span>
      </NavLink>
    </footer>
  );
}
