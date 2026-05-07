import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './Dashboard';
import WorkerDashboard from './DashboardWorker';
import PostJob from './PostJob';
import JobsAvailable from './JobsAvailable';
import JobDetails from './JobDetails';
import JobTracking from './JobTracking';
import Chat from './Chat';
import JobHistory from './JobHistory';
import WorkerActiveJob from './WorkerActiveJob';
import Settings from './Settings';
import Wallet from './Wallet';
import SupportHub from './SupportHub';
import Layout from '../components/layout/Layout';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeProvider } from '../hooks/useTheme';

import CustomerProfile from './CustomerProfile';
import WorkerEarnings from './WorkerEarnings';
import Notifications from './Notifications';
import WorkerSchedule from './WorkerSchedule'; // Calendar
import WorkerJobHistory from './WorkerJobHistory';
import WorkerAnalytics from './WorkerAnalytics';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

// Phase 15-17 Pages (Lazy Loaded)
const QualityControl = lazy(() => import('./QualityControl'));
const WorkPreferences = lazy(() => import('./WorkPreferences'));
const AdvancedAnalytics = lazy(() => import('./AdvancedAnalytics'));
const CreditSystem = lazy(() => import('./CreditSystem'));
const RewardsStore = lazy(() => import('./RewardsStore'));
const FeedbackRequest = lazy(() => import('./FeedbackRequest'));
const CareerPath = lazy(() => import('./CareerPath'));
const SkillVerification = lazy(() => import('./SkillVerification'));
const HallOfFame = lazy(() => import('./HallOfFame'));
const BalanceTools = lazy(() => import('./BalanceTools'));
const ComplianceHub = lazy(() => import('./ComplianceHub'));
const ClientManager = lazy(() => import('./ClientManager'));
const PricingTools = lazy(() => import('./PricingTools'));
const Mentorship = lazy(() => import('./Mentorship'));



function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-background font-sans antialiased text-foreground">
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Routes>

                  {/* Protected Routes Wrapper */}
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/worker" element={<WorkerDashboard />} />
                    <Route path="/dashboard/profile" element={<CustomerProfile />} />

                    {/* Job Routes */}
                    <Route path="/post-job" element={<PostJob />} />
                    <Route path="/jobs" element={<JobsAvailable />} />
                    <Route path="/job/:id" element={<JobDetails />} />
                    <Route path="/tracking/:id" element={<JobTracking />} />

                    <Route path="/messages" element={<Chat />} />
                    <Route path="/history" element={<JobHistory />} />
                    <Route path="/worker/job/:id" element={<WorkerActiveJob />} />
                    <Route path="/worker/earnings" element={<WorkerEarnings />} />
                    <Route path="/worker/schedule" element={<WorkerSchedule />} />
                    <Route path="/worker/history" element={<WorkerJobHistory />} />
                    <Route path="/worker/analytics" element={<WorkerAnalytics />} />

                    {/* Phase 11 Routes */}
                    <Route path="/worker/career" element={<CareerPath />} />
                    <Route path="/worker/verify-skill" element={<SkillVerification />} />

                    {/* Phase 12 Routes */}
                    <Route path="/worker/balance" element={<BalanceTools />} />

                    {/* Phase 13 Routes */}
                    <Route path="/worker/clients" element={<ClientManager />} />
                    <Route path="/worker/pricing" element={<PricingTools />} />

                    {/* Phase 14 Routes */}
                    <Route path="/worker/mentorship" element={<Mentorship />} />

                    {/* Phase 15 Routes */}
                    <Route path="/worker/quality" element={<QualityControl />} />
                    <Route path="/worker/preferences" element={<WorkPreferences />} />

                    {/* Phase 16 Routes */}
                    <Route path="/worker/advanced-analytics" element={<AdvancedAnalytics />} />
                    <Route path="/worker/credits" element={<CreditSystem />} />
                    <Route path="/worker/rewards" element={<RewardsStore />} />

                    {/* Phase 17 Routes */}
                    <Route path="/worker/request-review" element={<FeedbackRequest />} />

                    <Route path="/settings" element={<Settings />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/help" element={<SupportHub />} />
                    <Route path="/notifications" element={<Notifications />} />
                  </Route>

                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
              <Toaster position="top-center" />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
