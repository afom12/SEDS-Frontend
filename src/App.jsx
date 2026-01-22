import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import SkipToContent from './components/SkipToContent';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Component to handle keyboard shortcuts (must be inside Router)
const KeyboardShortcutsHandler = () => {
  useKeyboardShortcuts();
  return null;
};

// Pages - Lazy loaded for better performance
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const RegisterWithVerification = React.lazy(() => import('./pages/auth/RegisterWithVerification'));
const VerificationPending = React.lazy(() => import('./pages/verify/VerificationPending'));
const Transparency = React.lazy(() => import('./pages/Transparency'));

// Donor Pages
const DonorDashboard = React.lazy(() => import('./pages/donor/DonorDashboard'));
const BrowseRequests = React.lazy(() => import('./pages/donor/BrowseRequests'));
const RequestDetails = React.lazy(() => import('./pages/donor/RequestDetails'));
const DonationHistory = React.lazy(() => import('./pages/donor/DonationHistory'));

// Receiver Pages
const ReceiverDashboard = React.lazy(() => import('./pages/receiver/ReceiverDashboard'));
const SubmitRequest = React.lazy(() => import('./pages/receiver/SubmitRequest'));
const RequestStatus = React.lazy(() => import('./pages/receiver/RequestStatus'));
const Profile = React.lazy(() => import('./pages/receiver/Profile'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ReviewRequests = React.lazy(() => import('./pages/admin/ReviewRequests'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const Analytics = React.lazy(() => import('./pages/admin/Analytics'));
const ActivityLogs = React.lazy(() => import('./pages/admin/ActivityLogs'));
const VerifyUsers = React.lazy(() => import('./pages/admin/VerifyUsers'));
const VerifyRequests = React.lazy(() => import('./pages/admin/VerifyRequests'));

// Aid Provider Pages
const AidProviderDashboard = React.lazy(() => import('./pages/aid-provider/AidProviderDashboard'));
const CreateAidOffer = React.lazy(() => import('./pages/aid-provider/CreateAidOffer'));
const BrowseAidRequests = React.lazy(() => import('./pages/aid-provider/BrowseRequests'));
const DeliveryTracking = React.lazy(() => import('./pages/aid-provider/DeliveryTracking'));

// Aid Seeker Pages
const AidSeekerDashboard = React.lazy(() => import('./pages/aid-seeker/AidSeekerDashboard'));
const CreateAidRequest = React.lazy(() => import('./pages/aid-seeker/CreateAidRequest'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main id="main-content" className="flex-1 md:ml-64 bg-background dark:bg-gray-900 min-h-screen" tabIndex={-1}>
          <div className="md:hidden p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-text hover:text-primary"
              aria-label="Open sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <KeyboardShortcutsHandler />
      <SkipToContent />
      <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <Navbar />
                <Landing />
                <Footer />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <Navbar />
                <Login />
                <Footer />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<PageLoader />}>
                <Navbar />
                <RegisterWithVerification />
                <Footer />
              </Suspense>
            }
          />
          <Route
            path="/register-old"
            element={
              <Suspense fallback={<PageLoader />}>
                <Navbar />
                <Register />
                <Footer />
              </Suspense>
            }
          />
          <Route
            path="/verify-account"
            element={
              <Suspense fallback={<PageLoader />}>
                <Navbar />
                <VerificationPending />
                <Footer />
              </Suspense>
            }
          />
          <Route
            path="/transparency"
            element={
              <Suspense fallback={<PageLoader />}>
                <Navbar />
                <Transparency />
                <Footer />
              </Suspense>
            }
          />
          <Route
            path="/transparency/requests/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <Navbar />
                <Transparency />
                <Footer />
              </Suspense>
            }
          />

          {/* Donor Routes */}
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <DonorDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/requests"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <BrowseRequests />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/requests/:id"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <RequestDetails />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/history"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <DonationHistory />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/*"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <DonorDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Receiver Routes */}
          <Route
            path="/receiver/dashboard"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <ReceiverDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver/request"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <SubmitRequest />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver/status"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <RequestStatus />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver/profile"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Profile />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver/*"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <ReceiverDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <ReviewRequests />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <UserManagement />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Analytics />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <ActivityLogs />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verify-users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <VerifyUsers />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verify-requests"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <VerifyRequests />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Aid Seeker Routes */}
          <Route
            path="/aid-seeker/dashboard"
            element={
              <ProtectedRoute allowedRoles={['aid_seeker', 'receiver']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <AidSeekerDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aid-seeker/request"
            element={
              <ProtectedRoute allowedRoles={['aid_seeker', 'receiver']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <CreateAidRequest />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aid-seeker/*"
            element={
              <ProtectedRoute allowedRoles={['aid_seeker', 'receiver']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <AidSeekerDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Aid Provider Routes */}
          <Route
            path="/aid-provider/dashboard"
            element={
              <ProtectedRoute allowedRoles={['aid_provider', 'donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <AidProviderDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aid-provider/offer"
            element={
              <ProtectedRoute allowedRoles={['aid_provider', 'donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <CreateAidOffer />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aid-provider/requests"
            element={
              <ProtectedRoute allowedRoles={['aid_provider', 'donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <BrowseAidRequests />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aid-provider/deliveries"
            element={
              <ProtectedRoute allowedRoles={['aid_provider', 'donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <DeliveryTracking />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aid-provider/*"
            element={
              <ProtectedRoute allowedRoles={['aid_provider', 'donor']}>
                <DashboardLayout>
                  <Suspense fallback={<PageLoader />}>
                    <AidProviderDashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
  );
}

function App() {
  console.log('App component rendering...');
  try {
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Application Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}

export default App;

