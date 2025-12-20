import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DonorDashboard from './pages/donor/DonorDashboard';
import ReceiverDashboard from './pages/receiver/ReceiverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

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
    </AuthProvider>
  );
}

export default App;

