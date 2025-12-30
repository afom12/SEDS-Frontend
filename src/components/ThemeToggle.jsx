import React, { useContext } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import Tooltip from './Tooltip';

const ThemeToggle = () => {
  const themeContext = useContext(ThemeContext);
  
  // If context is not available, don't render
  if (!themeContext) {
    return null;
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <Tooltip content={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <FaMoon className="text-gray-700 dark:text-gray-300" />
        ) : (
          <FaSun className="text-gray-700 dark:text-gray-300" />
        )}
      </button>
    </Tooltip>
  );
};

export default ThemeToggle;

