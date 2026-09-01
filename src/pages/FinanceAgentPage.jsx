import React from 'react';
import HeaderChrome from '../components/HeaderChrome';
import AskPanel from '../components/AskPanel';
import StatusBar from '../components/StatusBar';
import { Bot, Sparkles, Terminal, ShieldCheck } from 'lucide-react';
import { useRecon } from '../context/ReconContext';

export default function FinanceAgentPage() {
  const { theme } = useRecon();
  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Finance Agent" 
        subtitle="Conversational financial intelligence agent and automated discrepancy detective" 
      />

      <div className="content-body" style={{ flex: 1, maxWidth: '1150px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 40px' }}>
        
        {/* Agent Banner */}
        <div className="card-base" style={{
          backgroundColor: 'var(--bg-card)',
          borderLeft: '5px solid var(--tertiary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '24px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#0F172A',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img src="/logo.png" alt="Finance Wizard" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Finance Agent
              </h3>
              <span className="badge-beta">Beta</span>
            </div>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
              Ask financial questions in plain English, query live settlement metrics, and inspect reasoning logs and order citations in real time.
            </p>
          </div>
        </div>

        {/* Full Chat Engine */}
        <AskPanel compact={false} />

      </div>

      <StatusBar />
    </div>
  );
}
