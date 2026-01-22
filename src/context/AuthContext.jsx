import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { API_CONFIG } from '../config/api';
import { AUTO_VERIFY_IN_DEV } from '../config/dev';

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
  const [useMockData, setUseMockData] = useState(false);

  // Mock users for fallback/testing
  const mockUsers = {
    admin: {
      id: '1',
      email: 'admin@seds.com',
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
    },
    donor: {
      id: '2',
      email: 'donor@seds.com',
      password: 'donor123',
      role: 'donor',
      name: 'John Donor',
    },
    receiver: {
      id: '3',
      email: 'receiver@seds.com',
      password: 'receiver123',
      role: 'receiver',
      name: 'Jane Receiver',
    },
  };

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

        // Fallback to saved user if API fails
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
              setUser(parsedUser);
              setUseMockData(true); // Use mock data if API unavailable
            } else {
              sessionStorage.removeItem('seds_user');
            }
          } catch (error) {
            console.error('Error parsing saved user:', error);
            sessionStorage.removeItem('seds_user');
          }
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
      // Fallback to mock data if API is unavailable
      console.warn('API login failed, using mock data:', error);
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const mockUser = Object.values(mockUsers).find(
            (u) => u.email === email && u.password === password
          );

          if (mockUser) {
            const userData = { ...mockUser };
            delete userData.password;
            setUser(userData);
            sessionStorage.setItem('seds_user', JSON.stringify(userData));
            setUseMockData(true);
            resolve(userData);
          } else {
            reject(new Error(error.message || 'Invalid email or password'));
          }
        }, 500);
      });
    }
  };

  const register = async (email, password, name, role) => {
    try {
      // Try API first
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        name,
        role: role || 'donor',
      });

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
      // Fallback to mock data if API is unavailable
      console.warn('API registration failed, using mock data:', error);
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if user already exists
          const existingUser = Object.values(mockUsers).find(
            (u) => u.email === email
          );

          if (existingUser) {
            reject(new Error('User already exists'));
            return;
          }

          // Create new user
          const newUser = {
            id: Date.now().toString(),
            email,
            password,
            role: role || 'donor',
            name,
          };

          const userData = { ...newUser };
          delete userData.password;
          setUser(userData);
          sessionStorage.setItem('seds_user', JSON.stringify(userData));
          setUseMockData(true);
          resolve(userData);
        }, 500);
      });
    }
  };

  const logout = async () => {
    try {
      // Try to logout on backend
      if (!useMockData) {
        try {
          await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
          console.warn('Logout API call failed:', error);
        }
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
    useMockData, // Expose this so components know if they're using mock data
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};





