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
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('seds_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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
          localStorage.setItem('seds_user', JSON.stringify(userData));
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
        localStorage.setItem('seds_user', JSON.stringify(userData));
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('seds_user');
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

