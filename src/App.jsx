import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReconProvider } from './context/ReconContext';
import Sidebar from './components/Sidebar';
import OrderDrawer from './components/OrderDrawer';

// Pages
import UploadPage from './pages/UploadPage';
import DashboardOverview from './pages/DashboardOverview';
import TransactionsPage from './pages/TransactionsPage';
import CashPage from './pages/CashPage';
import ExceptionsPage from './pages/ExceptionsPage';
import AskPage from './pages/AskPage';
import EscalationPage from './pages/EscalationPage';
import MemoryPage from './pages/MemoryPage';
import FinanceAgentPage from './pages/FinanceAgentPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import GuidePage from './pages/GuidePage';

export default function App() {
  return (
    <ReconProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* Always Visible Left Sidebar */}
          <Sidebar />

          {/* Main Dynamic Viewport */}
          <main className="main-content-wrapper">
            <Routes>
              {/* PAGE 1: Upload & Start ONLY */}
              <Route path="/upload" element={<UploadPage />} />

              {/* PAGE 2: Dashboard Overview & Sub-routes */}
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/dashboard/transactions" element={<TransactionsPage />} />
              <Route path="/dashboard/cash" element={<CashPage />} />
              <Route path="/dashboard/exceptions" element={<ExceptionsPage />} />
              <Route path="/dashboard/ask" element={<AskPage />} />

              {/* Dedicated Root Routes */}
              <Route path="/escalation" element={<EscalationPage />} />
              <Route path="/memory" element={<MemoryPage />} />
              <Route path="/finance-agent" element={<FinanceAgentPage />} />
              <Route path="/nl-agent" element={<Navigate to="/finance-agent" replace />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/upload" replace />} />
            </Routes>
          </main>

          {/* Right Overlay Order Drill-Down Drawer */}
          <OrderDrawer />
        </div>
      </BrowserRouter>
    </ReconProvider>
  );
}
