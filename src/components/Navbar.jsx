import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { FaBars, FaTimes, FaHandHoldingHeart } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    const role = user.role.toLowerCase();
    return `/${role}/dashboard`;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-md">
                <FaHandHoldingHeart className="text-white text-xl" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-text-dark">SEDS</span>
              <span className="text-xs text-gray-500 hidden lg:block">Share & Donor Platform</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {loading ? (
              <div className="flex items-center space-x-6">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : !isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-text hover:text-primary transition-colors"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/login"
                  className="text-text hover:text-primary transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary">
                  {t('nav.getStarted')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-text hover:text-primary transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
                <span className="text-text">
                  {t('nav.welcome', { name: user.name })}
                </span>
                <button onClick={handleLogout} className="btn-outline">
                  {t('nav.logout')}
                </button>
              </>
            )}
            {/* Language Toggle & Theme Toggle */}
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4">
              <ThemeToggle />
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-sm font-medium transition-colors ${
                  i18n.language === 'en'
                    ? 'text-primary font-bold'
                    : 'text-gray-500 hover:text-text dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                EN
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                onClick={() => changeLanguage('am')}
                className={`px-2 py-1 text-sm font-medium transition-colors ${
                  i18n.language === 'am'
                    ? 'text-primary font-bold'
                    : 'text-gray-500 hover:text-text dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                አማ
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : !isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    className="text-text hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.home')}
                  </Link>
                  <Link
                    to="/login"
                    className="text-text hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.getStarted')}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-text hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <span className="text-text">{t('nav.welcome', { name: user.name })}</span>
                  <button onClick={handleLogout} className="btn-outline">
                    {t('nav.logout')}
                  </button>
                </>
              )}
              {/* Mobile Language Toggle & Theme */}
              <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />
                <span className="text-sm text-gray-500 dark:text-gray-400">Language:</span>
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-sm font-medium transition-colors ${
                    i18n.language === 'en'
                      ? 'text-primary font-bold'
                      : 'text-gray-500 hover:text-text'
                  }`}
                >
                  EN
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    changeLanguage('am');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-sm font-medium transition-colors ${
                    i18n.language === 'am'
                      ? 'text-primary font-bold'
                      : 'text-gray-500 hover:text-text'
                  }`}
                >
                  አማ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

