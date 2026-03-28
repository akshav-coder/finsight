import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';

import LandingPage from './pages/LandingPage';
import AppLayout from './layouts/AppLayout';

import Dashboard from './pages/Dashboard';
import LoanSimplifier from './pages/LoanSimplifier';
import CreditCardAnalyzer from './pages/CreditCardAnalyzer';
import FdRdTracker from './pages/FdRdTracker';
import SavingsAdvisor from './pages/SavingsAdvisor';
import DebtPayoffPlanner from './pages/DebtPayoffPlanner';
import TaxSaver from './pages/TaxSaver';
import SIPCalculator from './pages/SIPCalculator';
import StatementHub from './pages/StatementHub';

import UploadView from './pages/UploadView';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import TransactionsList from './pages/TransactionsList';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* App Routes Wrapper */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="loan" element={<LoanSimplifier />} />
          <Route path="credit-card" element={<CreditCardAnalyzer />} />
          <Route path="fd-rd" element={<FdRdTracker />} />
          <Route path="savings-advisor" element={<SavingsAdvisor />} />
          <Route path="debt-planner" element={<DebtPayoffPlanner />} />
          <Route path="tax-saver" element={<TaxSaver />} />
          <Route path="sip-calculator" element={<SIPCalculator />} />
          
          {/* Statement Hub and its sub-routes using absolute paths for matching */}
          <Route path="statement-analytics" element={<StatementHub />}>
            <Route index element={<Navigate to="/app/statement-analytics/upload" replace />} />
            <Route path="/app/statement-analytics/upload" element={<UploadView />} />
            <Route path="/app/statement-analytics/overview" element={<Overview />} />
            <Route path="/app/statement-analytics/analytics" element={<Analytics />} />
            <Route path="/app/statement-analytics/transactions" element={<TransactionsList />} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
