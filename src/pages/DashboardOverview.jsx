import React from 'react';
import HeaderChrome from '../components/HeaderChrome';
import KpiRow from '../components/KpiRow';
import TransactionTable from '../components/TransactionTable';
import CashCard from '../components/CashCard';
import ExceptionsList from '../components/ExceptionsList';
import AskPanel from '../components/AskPanel';
import StatusBar from '../components/StatusBar';

export default function DashboardOverview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Dashboard Top Header Chrome */}
      <HeaderChrome title="Dashboard" />

      {/* Main Content Area */}
      <div className="content-body" style={{ flex: 1, padding: '32px 40px' }}>
        {/* KPI 5-card row */}
        <KpiRow />

        {/* 2-Column Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(360px, 1fr)',
          gap: '28px',
          alignItems: 'start'
        }}>
          {/* Left Column: Transactions Summary Table & Exceptions list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', minWidth: 0 }}>
            {/* Transactions Table (Summary) */}
            <TransactionTable />

            {/* Exceptions Needing Human (ESCALATE only) */}
            <ExceptionsList limit={3} showHeaderLink={true} />
          </div>

          {/* Right Column: Cash Position & Ask Finance Wizard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Cash Position + Counterfactual */}
            <CashCard />

            {/* Ask Finance Wizard (Beta) */}
            <AskPanel compact={true} />
          </div>
        </div>
      </div>

      {/* Bottom Sticky Status Bar */}
      <StatusBar />
    </div>
  );
}
