import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      // Check localStorage first
      if (typeof window !== 'undefined' && localStorage) {
        const savedTheme = localStorage.getItem('seds_theme');
        if (savedTheme) {
          return savedTheme;
        }
      }
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      }
    } catch (error) {
      console.warn('Error accessing theme preferences:', error);
    }
    return 'light';
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem('seds_theme', theme);
      }
    } catch (error) {
      console.warn('Error setting theme:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

