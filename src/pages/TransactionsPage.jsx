import React from 'react';
import HeaderChrome from '../components/HeaderChrome';
import TransactionTable from '../components/TransactionTable';
import StatusBar from '../components/StatusBar';

import { useRecon } from '../context/ReconContext';

export default function TransactionsPage() {
  const { isReconciled, kpiData } = useRecon();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Transactions" 
        subtitle={isReconciled ? `Full audit trail for ${kpiData.totalRecords} settlement records across Settlement, Bank & Ledger` : "Awaiting reconciliation run"} 
      />

      <div className="content-body" style={{ flex: 1 }}>
        <TransactionTable fullPage={true} />
      </div>

      <StatusBar />
    </div>
  );
}
