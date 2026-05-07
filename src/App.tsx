import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Providers } from '@/app/providers';
import { useAuth } from '@/hooks/useAuth';
import ScrollToTop from '@/components/common/ScrollToTop';
import SplashScreen from '@/components/common/SplashScreen';

// Auth Pages
import Login from '@/app/login/page';
import Register from '@/app/register/page';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Layouts
import MainLayout from '@/app/(main)/layout';

// Customer Pages
import CustomerDashboard from '@/app/(main)/dashboard/page';
import PostJob from '@/app/(main)/post-job/page';
import WorkerMarketplace from '@/app/(main)/jobs/page';
import JobDetails from '@/app/(main)/jobs/[id]/page';
import SmartMatch from '@/app/(main)/jobs/smart-match/page';
import JobHistory from '@/app/(main)/jobs/history/page';
import JobAlerts from '@/app/(main)/jobs/alerts/page';
import CustomerProfile from '@/app/(main)/customer/profile/page';
import AvailableWorkPage from '@/app/(main)/available-work/page';
import AIEstimator from '@/app/(main)/customer/ai-estimator/page';

// Feature Pages
import WellnessHub from '@/app/(main)/wellness/page';
import ErgonomicsCoach from '@/app/(main)/wellness/ergonomics/page';
import Wallet from '@/app/(main)/wallet/page';
import SupportHub from '@/app/(main)/support/page';
import SafetyHub from '@/app/(main)/safety/page';
import Community from '@/app/(main)/community/page';
import HallOfFame from '@/app/(main)/community/hall-of-fame/page';
import Workshops from '@/app/(main)/community/workshops/page';
import Consultation from '@/app/(main)/consultation/page';
import Chat from '@/app/(main)/chat/page';
import MessagingHub from '@/app/(main)/chat/hub/page';
import ARVisualizer from '@/app/(main)/ar-visualizer/page';
import AdvancedAnalytics from '@/legacy_pages/AdvancedAnalytics';
import ARVisualizerLegacy from '@/legacy_pages/ARVisualizer';
import AvailabilityCalendarLegacy from '@/legacy_pages/AvailabilityCalendar';
import CareerPath from '@/legacy_pages/CareerPath';
import ChatLegacy from '@/legacy_pages/Chat';
import ChatRoomLegacy from '@/legacy_pages/ChatRoom';
import ClientManager from '@/legacy_pages/ClientManager';
import CommunityLegacy from '@/legacy_pages/Community';

import ComplianceHub from '@/legacy_pages/ComplianceHub';
import CreditSystem from '@/legacy_pages/CreditSystem';
import CustomerProfileLegacy from '@/legacy_pages/CustomerProfile';
import DashboardLegacy from '@/legacy_pages/Dashboard';
import WorkerDashboardLegacy from '@/legacy_pages/DashboardWorker';
import EarningsProjections from '@/legacy_pages/EarningsProjections';

// Worker Pages
import WorkerDashboard from '@/app/(main)/dashboard/worker/page';
import WorkerInvoice from '@/app/(main)/worker/invoice/page';
import WorkerActiveJob from '@/app/(main)/worker/job/[id]/page';
import JobComplete from '@/app/(main)/worker/job/[id]/complete/page';
import JobTracking from '@/app/(main)/tracking/[id]/page';
import AvailabilityCalendar from '@/app/(main)/worker/availability/page';
import BalanceTools from '@/legacy_pages/BalanceTools';
import FeedbackRequest from '@/app/(main)/worker/request-review/page';
import WorkerJobAlerts from '@/legacy_pages/JobAlerts';
import LegacyJobDetails from '@/legacy_pages/JobDetails';
import GrowthPage from '@/app/(main)/worker/growth/page';
import JobOfferPage from '@/app/(main)/worker/offer/[id]/page';
import FindJobsPage from '@/app/(main)/find-jobs/page';
import WorkerJobHistory from '@/app/(main)/worker/history/page';
import WorkerEarnings from '@/app/(main)/worker/earnings/page';
import WorkerSchedule from '@/app/(main)/worker/schedule/page';
import WorkerProjections from '@/app/(main)/worker/projections/page';
import WorkerSettings from '@/app/(main)/worker/settings/page';
import WorkerAcademy from '@/app/(main)/worker/academy/page';
import AIPortfolioBuilder from '@/app/(main)/worker/portfolio/page';
import OnJobAssistant from '@/app/(main)/worker/assistant/page';
import WorkerProfile from '@/app/(main)/worker/profile/page.tsx';
import RapidScan from '@/app/(main)/worker/rapid-scan/page.tsx';

import LegacyJobHistory from '@/legacy_pages/JobHistory';
import JobsAvailable from '@/legacy_pages/JobsAvailable';
import LegacyJobTracking from '@/legacy_pages/JobTracking';
import MentorshipLegacy from '@/legacy_pages/Mentorship';
import NotificationsLegacy from '@/legacy_pages/Notifications';
import PostJobLegacy from '@/legacy_pages/PostJob';
import PricingToolsLegacy from '@/legacy_pages/PricingTools';
import QualityControlLegacy from '@/legacy_pages/QualityControl';
import RewardsStoreLegacy from '@/legacy_pages/RewardsStore';
import SafetyGuidelinesLegacy from '@/legacy_pages/SafetyGuidelines';
import ServiceGuideLegacy from '@/legacy_pages/ServiceGuide';
import SettingsLegacy from '@/legacy_pages/Settings';
import SkillVerificationLegacy from '@/legacy_pages/SkillVerification';
import SmartMatchLegacy from '@/legacy_pages/SmartMatch';
import SupportHubLegacy from '@/legacy_pages/SupportHub';
import VirtualConsultationLegacy from '@/legacy_pages/VirtualConsultation';
import WalletLegacy from '@/legacy_pages/Wallet';
import WorkerAcademyLegacy from '@/legacy_pages/WorkerAcademy';
import WorkerActiveJobLegacy from '@/legacy_pages/WorkerActiveJob';
import WorkerAnalyticsLegacy from '@/legacy_pages/WorkerAnalytics';
import WorkerEarningsLegacy from '@/legacy_pages/WorkerEarnings';
import WorkerForumLegacy from '@/legacy_pages/WorkerForum';
import WorkerJobHistoryPageLegacy from '@/legacy_pages/WorkerJobHistory';
import WorkerScheduleLegacy from '@/legacy_pages/WorkerSchedule';
import WorkPreferencesLegacy from '@/legacy_pages/WorkPreferences';
import FeedbackRequestLegacy from '@/legacy_pages/FeedbackRequest';
import HallOfFameLegacy from '@/legacy_pages/HallOfFame';
import InsightsLegacy from '@/legacy_pages/Insights';
import RewardsLegacy from '@/legacy_pages/Rewards';

import PublicRoute from '@/components/auth/PublicRoute';

import SupervisorDashboard from '@/app/(main)/dashboard/supervisor/page';

function DashboardRedirect() {
    const { user, isLoading } = useAuth();
    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;

    if (user.userType === 'worker') return <Navigate to="/worker/dashboard" replace />;
    if (user.userType === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <SplashScreen />
            <Providers>
                <Routes>
                    {/* Public Routes - No loops allowed */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                    {/* Authenticated/Main Routes */}
                    <Route element={<MainLayout><Outlet /></MainLayout>}>
                        {/* Dashboards */}
                        <Route path="/customer/dashboard" element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/dashboard" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <WorkerDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/supervisor/dashboard" element={
                            <ProtectedRoute allowedRoles={['supervisor']}>
                                <SupervisorDashboard />
                            </ProtectedRoute>
                        } />

                        {/* Aliases for convenience */}
                        <Route path="/dashboard" element={<DashboardRedirect />} />
                        <Route path="/dashboard/worker" element={<Navigate to="/worker/dashboard" replace />} />
                        <Route path="/dashboard/supervisor" element={<Navigate to="/supervisor/dashboard" replace />} />

                        {/* Customer Flows */}
                        <Route path="/post-job" element={<PostJob />} />
                        <Route path="/jobs" element={<WorkerMarketplace />} />
                        <Route path="/jobs/:id" element={<JobDetails />} />
                        <Route path="/available-work" element={<AvailableWorkPage />} />
                        <Route path="/jobs/smart-match" element={<SmartMatch />} />
                        <Route path="/jobs/history" element={<JobHistory />} />
                        <Route path="/jobs/alerts" element={<JobAlerts />} />
                        <Route path="/customer/profile" element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <CustomerProfile />
                            </ProtectedRoute>
                        } />
                        <Route path="/customer/ai-estimator" element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <AIEstimator />
                            </ProtectedRoute>
                        } />

                        {/* Shared Features */}
                        <Route path="/wellness" element={<WellnessHub />} />
                        <Route path="/wellness/ergonomics" element={<ErgonomicsCoach />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/support" element={<SupportHub />} />
                        <Route path="/safety" element={<SafetyHub />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/community/hall-of-fame" element={<HallOfFame />} />
                        <Route path="/community/workshops" element={<Workshops />} />
                        <Route path="/consultation" element={<Consultation />} />
                        <Route path="/chat/hub" element={<MessagingHub />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/ar-visualizer" element={<ARVisualizer />} />
                        <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                        <Route path="/ar-visualizer-legacy" element={<ARVisualizerLegacy />} />

                        {/* Worker Flows */}
                        <Route path="/worker/invoice" element={<WorkerInvoice />} />
                        <Route path="/worker/job/:id" element={<WorkerActiveJob />} />
                        <Route path="/worker/job/:id/complete" element={<JobComplete />} />
                        <Route path="/worker/availability" element={<AvailabilityCalendar />} />
                        <Route path="/find-jobs" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <FindJobsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/availability-legacy" element={<AvailabilityCalendarLegacy />} />
                        <Route path="/worker/balance-tools" element={<BalanceTools />} />
                        <Route path="/worker/career-path" element={<CareerPath />} />
                        <Route path="/chat-legacy" element={<ChatLegacy />} />
                        <Route path="/chat-room-legacy" element={<ChatRoomLegacy />} />
                        <Route path="/worker/client-manager-legacy" element={<ClientManager />} />
                        <Route path="/community-legacy" element={<CommunityLegacy />} />

                        <Route path="/compliance-hub-legacy" element={<ComplianceHub />} />
                        <Route path="/credit-system-legacy" element={<CreditSystem />} />
                        <Route path="/customer/profile-legacy" element={<CustomerProfileLegacy />} />
                        <Route path="/dashboard-legacy" element={<DashboardLegacy />} />
                        <Route path="/dashboard/worker-legacy" element={<WorkerDashboardLegacy />} />
                        <Route path="/worker/earnings-projections-legacy" element={<EarningsProjections />} />
                        <Route path="/worker/request-review" element={<FeedbackRequest />} />

                        <Route path="/worker/history" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <WorkerJobHistory />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/earnings" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <WorkerEarnings />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/schedule" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <WorkerSchedule />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/projections" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <WorkerProjections />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/settings" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <WorkerSettings />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/academy" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <WorkerAcademy />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/portfolio" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <AIPortfolioBuilder />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/profile" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <WorkerProfile />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/rapid-scan" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <RapidScan />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/assistant" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <OnJobAssistant />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/career-path" element={
                            <ProtectedRoute allowedRoles={['worker']}>
                                <GrowthPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/worker/job-history-legacy" element={<LegacyJobHistory />} />
                        <Route path="/worker/jobs-available-legacy" element={<JobsAvailable />} />
                        <Route path="/worker/job-tracking-legacy/:id" element={<LegacyJobTracking />} />
                        <Route path="/main-legacy" element={<DashboardLegacy />} />
                        <Route path="/worker/mentorship-legacy" element={<MentorshipLegacy />} />
                        <Route path="/notifications-legacy" element={<NotificationsLegacy />} />
                        <Route path="/post-job-legacy" element={<PostJobLegacy />} />
                        <Route path="/worker/pricing-tools-legacy" element={<PricingToolsLegacy />} />
                        <Route path="/worker/quality-control-legacy" element={<QualityControlLegacy />} />
                        <Route path="/rewards-store-legacy" element={<RewardsStoreLegacy />} />
                        <Route path="/safety-guidelines-legacy" element={<SafetyGuidelinesLegacy />} />
                        <Route path="/worker/service-guide-legacy" element={<ServiceGuideLegacy />} />
                        <Route path="/worker/settings-legacy" element={<SettingsLegacy />} />
                        <Route path="/worker/skill-verification-legacy" element={<SkillVerificationLegacy />} />
                        <Route path="/worker/smart-match-legacy" element={<SmartMatchLegacy />} />
                        <Route path="/worker/support-hub-legacy" element={<SupportHubLegacy />} />
                        <Route path="/worker/virtual-consultation-legacy" element={<VirtualConsultationLegacy />} />
                        <Route path="/worker/wallet-legacy" element={<WalletLegacy />} />
                        <Route path="/worker/academy-legacy" element={<WorkerAcademyLegacy />} />
                        <Route path="/worker/active-job-legacy/:id" element={<WorkerActiveJobLegacy />} />
                        <Route path="/worker/analytics-legacy" element={<WorkerAnalyticsLegacy />} />
                        <Route path="/worker/earnings-legacy" element={<WorkerEarningsLegacy />} />
                        <Route path="/worker/forum-legacy" element={<WorkerForumLegacy />} />
                        <Route path="/worker/job-history-legacy-v2" element={<WorkerJobHistoryPageLegacy />} />
                        <Route path="/worker/schedule-legacy" element={<WorkerScheduleLegacy />} />
                        <Route path="/worker/preferences-legacy" element={<WorkPreferencesLegacy />} />
                        <Route path="/worker/feedback-review-legacy" element={<FeedbackRequestLegacy />} />
                        <Route path="/community/hall-of-fame-legacy" element={<HallOfFameLegacy />} />
                        <Route path="/worker/insights-legacy" element={<InsightsLegacy />} />
                        <Route path="/worker/rewards-legacy" element={<RewardsLegacy />} />

                        {/* Tracking */}
                        <Route path="/tracking/:id" element={<JobTracking />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Providers>
        </BrowserRouter>
    );
}

export default App;
