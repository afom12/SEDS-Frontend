import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaHandHoldingHeart } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="bg-white shadow-md sticky top-0 z-40">
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
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-text hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="text-text hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-text hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-text">
                  Welcome, {user.name}
                </span>
                <button onClick={handleLogout} className="btn-outline">
                  Logout
                </button>
              </>
            )}
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
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    className="text-text hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="text-text hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-text hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <span className="text-text">Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="btn-outline">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

