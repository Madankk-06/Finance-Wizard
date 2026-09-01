import React from 'react';
import HeaderChrome from '../components/HeaderChrome';
import AskPanel from '../components/AskPanel';
import StatusBar from '../components/StatusBar';

export default function AskPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Ask Finance Wizard" 
        subtitle="Natural language reconciliation assistant powered by Financial Memory" 
      />

      <div className="content-body" style={{ flex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        <AskPanel compact={false} />
      </div>

      <StatusBar />
    </div>
  );
}
