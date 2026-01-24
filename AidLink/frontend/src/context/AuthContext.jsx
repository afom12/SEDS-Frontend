import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { API_CONFIG } from '../config/api';
import { normalizeRole } from '../utils/roleUtils';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token first
        const token = apiClient.getToken();
        const savedUser = sessionStorage.getItem('seds_user');

        if (token && savedUser) {
          try {
            // Try to verify token with backend
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
            if (response.success && response.data) {
              setUser(response.data);
              setUseMockData(false);
              setLoading(false);
              return;
            }
          } catch (error) {
            // If API call fails, check if we should use mock data
            console.warn('API not available, checking for saved user:', error);
          }
        }

        // If API fails, clear saved user to avoid stale sessions
        if (savedUser) {
          sessionStorage.removeItem('seds_user');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      // Try API first
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        // Store tokens (access + refresh)
        if (accessToken && refreshToken) {
          apiClient.setTokens(accessToken, refreshToken, rememberMe);
        } else if (response.data.token) {
          // Fallback for old token format
          apiClient.setToken(response.data.token, rememberMe);
        }

        // Store user data
        setUser(userData);
        sessionStorage.setItem('seds_user', JSON.stringify(userData));
        setUseMockData(false);
        
        return userData;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(
        error?.message?.includes('network')
          ? 'Cannot connect to the authentication service. Please try again later.'
          : error.message || 'Login failed. Please try again.'
      );
    }
  };

  const register = async (email, password, name, role) => {
    try {
      // Try API first
      // Backend expects username instead of name, and role is optional (defaults to 'donor')
      const normalizedRole = normalizeRole(role);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        username: name || email.split('@')[0], // Use name as username, or derive from email
        fullName: name, // Also send fullName for the user's display name
        role: normalizedRole || 'donor',
      });

      // Backend returns { statusCode, data: { user, accessToken, refreshToken }, message, success }
      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        // Store tokens (access + refresh)
        if (accessToken && refreshToken) {
          apiClient.setTokens(accessToken, refreshToken, false);
        } else if (response.data.token) {
          // Fallback for old token format
          apiClient.setToken(response.data.token, false);
        }

        // Store user data
        setUser(userData);
        sessionStorage.setItem('seds_user', JSON.stringify(userData));
        setUseMockData(false);
        
        return userData;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(
        error?.message?.includes('network')
          ? 'Cannot connect to the registration service. Please try again later.'
          : error.message || 'Registration failed. Please try again.'
      );
    }
  };

  const logout = async () => {
    try {
      // Try to logout on backend
      try {
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
        console.warn('Logout API call failed:', error);
      }
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      apiClient.removeToken();
      sessionStorage.removeItem('seds_user');
      localStorage.removeItem('seds_user');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};





