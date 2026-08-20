import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
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
import PricingPage from './pages/PricingPage';

import UploadView from './pages/UploadView';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import TransactionsList from './pages/TransactionsList';
import LoginPage from './pages/LoginPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* App Routes Wrapper (Publicly accessible dashboard and utility calculators) */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="loan" element={<LoanSimplifier />} />
          <Route path="credit-card" element={<CreditCardAnalyzer />} />
          <Route path="fd-rd" element={<FdRdTracker />} />
          
          {/* Protected: AI Advisory requires Google Auth */}
          <Route path="savings-advisor" element={
            <ProtectedRoute>
              <SavingsAdvisor />
            </ProtectedRoute>
          } />
          
          <Route path="debt-planner" element={<DebtPayoffPlanner />} />
          <Route path="tax-saver" element={<TaxSaver />} />
          <Route path="sip-calculator" element={<SIPCalculator />} />
          <Route path="pricing" element={<PricingPage />} />
          
          {/* Protected: Statement Hub upload and charts require Google Auth */}
          <Route path="statement-analytics" element={
            <ProtectedRoute>
              <StatementHub />
            </ProtectedRoute>
          }>
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
