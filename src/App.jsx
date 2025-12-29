import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import BrowseRequests from './pages/donor/BrowseRequests';
import RequestDetails from './pages/donor/RequestDetails';
import DonationHistory from './pages/donor/DonationHistory';

// Receiver Pages
import ReceiverDashboard from './pages/receiver/ReceiverDashboard';
import SubmitRequest from './pages/receiver/SubmitRequest';
import RequestStatus from './pages/receiver/RequestStatus';
import Profile from './pages/receiver/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ReviewRequests from './pages/admin/ReviewRequests';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import ActivityLogs from './pages/admin/ActivityLogs';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 md:ml-64 bg-background min-h-screen">
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

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Landing />
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
                <Footer />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
                <Footer />
              </>
            }
          />

          {/* Donor Routes */}
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <DonorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/requests"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <BrowseRequests />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/requests/:id"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <RequestDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/history"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <DonationHistory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/*"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DashboardLayout>
                  <DonorDashboard />
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
                  <ReceiverDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver/request"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <SubmitRequest />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver/status"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <RequestStatus />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver/profile"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver/*"
            element={
              <ProtectedRoute allowedRoles={['receiver']}>
                <DashboardLayout>
                  <ReceiverDashboard />
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
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <ReviewRequests />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <ActivityLogs />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

