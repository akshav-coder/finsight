import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
import AppLayout from './layouts/AppLayout';

// Every route is code-split so the initial bundle only ships what a visitor
// actually needs (the landing page), not all 8+ calculators up front.
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LoanSimplifier = lazy(() => import('./pages/LoanSimplifier'));
const CreditCardAnalyzer = lazy(() => import('./pages/CreditCardAnalyzer'));
const FdRdTracker = lazy(() => import('./pages/FdRdTracker'));
const SavingsAdvisor = lazy(() => import('./pages/SavingsAdvisor'));
const DebtPayoffPlanner = lazy(() => import('./pages/DebtPayoffPlanner'));
const TaxSaver = lazy(() => import('./pages/TaxSaver'));
const SIPCalculator = lazy(() => import('./pages/SIPCalculator'));
const StatementHub = lazy(() => import('./pages/StatementHub'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

const UploadView = lazy(() => import('./pages/UploadView'));
const Overview = lazy(() => import('./pages/Overview'));
const Analytics = lazy(() => import('./pages/Analytics'));
const TransactionsList = lazy(() => import('./pages/TransactionsList'));

function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );
}

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
      <Suspense fallback={<RouteLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
