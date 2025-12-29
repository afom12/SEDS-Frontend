import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Mock users for testing
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

  useEffect(() => {
    // Check for user in sessionStorage (session-only, clears on browser close)
    // This ensures first-visit shows landing page, but users stay logged in during session
    const savedUser = sessionStorage.getItem('seds_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Validate that the user object has required fields
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
        } else {
          // Invalid user data, clear it
          sessionStorage.removeItem('seds_user');
        }
      } catch (error) {
        // Invalid JSON, clear it
        console.error('Error parsing saved user:', error);
        sessionStorage.removeItem('seds_user');
      }
    }
    // Also clear any old localStorage user data to ensure clean state
    localStorage.removeItem('seds_user');
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = Object.values(mockUsers).find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const userData = { ...user };
          delete userData.password; // Don't store password
          setUser(userData);
          // Use sessionStorage instead of localStorage for session-only persistence
          sessionStorage.setItem('seds_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500); // Simulate API delay
    });
  };

  const register = (email, password, name, role) => {
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
        // Use sessionStorage instead of localStorage for session-only persistence
        sessionStorage.setItem('seds_user', JSON.stringify(userData));
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('seds_user');
    localStorage.removeItem('seds_user'); // Clear any old localStorage data too
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





