import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ReportProvider } from './context/ReportContext';
import { LanguageProvider } from './context/LanguageContext';

// UI Layout Components
import { DemoRoleBanner } from './components/ui/DemoRoleBanner';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { ToastContainer } from './components/ui/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage, SignInPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { PublicMapPage } from './pages/PublicMapPage';
import { SafeRoutePage } from './pages/SafeRoutePage';
import { ReportsPage } from './pages/ReportsPage';
import { ReportDetailsPage } from './pages/ReportDetailsPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CommunityWinsPage } from './pages/CommunityWinsPage';
import { WardScorecardsPage } from './pages/WardScorecardsPage';
import { CommunityChatPage } from './pages/CommunityChatPage';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminReportDetailsPage } from './pages/AdminReportDetailsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

// Layout wrapper for standard public & citizen pages
const StandardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Demo Environment Banner */}
      <DemoRoleBanner />

      {/* Routes */}
      <div className="flex-1">
        <Routes>
          {/* Public & Citizen Routes */}
          <Route path="/" element={<StandardLayout><LandingPage /></StandardLayout>} />
          <Route path="/signin" element={<StandardLayout><SignInPage /></StandardLayout>} />
          <Route path="/sign-in" element={<StandardLayout><SignInPage /></StandardLayout>} />
          <Route path="/login" element={<StandardLayout><SignInPage /></StandardLayout>} />
          <Route path="/signup" element={<StandardLayout><SignupPage /></StandardLayout>} />
          <Route path="/citizen" element={<StandardLayout><CitizenDashboard /></StandardLayout>} />
          <Route path="/report/new" element={<StandardLayout><ReportIssuePage /></StandardLayout>} />
          <Route path="/map" element={<StandardLayout><PublicMapPage /></StandardLayout>} />
          <Route path="/safe-route" element={<StandardLayout><SafeRoutePage /></StandardLayout>} />
          <Route path="/routes" element={<StandardLayout><SafeRoutePage /></StandardLayout>} />
          <Route path="/reports" element={<StandardLayout><ReportsPage /></StandardLayout>} />
          <Route path="/reports/:id" element={<StandardLayout><ReportDetailsPage /></StandardLayout>} />
          <Route path="/community-wins" element={<StandardLayout><CommunityWinsPage /></StandardLayout>} />
          <Route path="/scorecards" element={<StandardLayout><WardScorecardsPage /></StandardLayout>} />
          <Route path="/community-chat" element={<StandardLayout><CommunityChatPage /></StandardLayout>} />
          <Route path="/my-reports" element={<StandardLayout><MyReportsPage /></StandardLayout>} />
          <Route path="/profile" element={<StandardLayout><ProfilePage /></StandardLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<StandardLayout><AdminLoginPage /></StandardLayout>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/reports/:id" element={<AdminReportDetailsPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/scorecards" element={<StandardLayout><WardScorecardsPage /></StandardLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Floating Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <ReportProvider>
              <AppContent />
            </ReportProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
