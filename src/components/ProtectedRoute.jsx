import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user.role.toLowerCase();
    // Map role variations
    const roleMap = {
      'aid_seeker': ['aid_seeker', 'receiver'],
      'aid_provider': ['aid_provider', 'donor'],
      'receiver': ['aid_seeker', 'receiver'],
      'donor': ['aid_provider', 'donor'],
    };
    
    const allowedRolesExpanded = allowedRoles.flatMap(role => roleMap[role] || [role]);
    
    if (!allowedRolesExpanded.includes(userRole)) {
      // Redirect to user's own dashboard
      const dashboardMap = {
        'aid_seeker': '/aid-seeker/dashboard',
        'aid_provider': '/aid-provider/dashboard',
        'receiver': '/receiver/dashboard',
        'donor': '/donor/dashboard',
        'admin': '/admin/dashboard',
      };
      return <Navigate to={dashboardMap[userRole] || '/dashboard'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;







