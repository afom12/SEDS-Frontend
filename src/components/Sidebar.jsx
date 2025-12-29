import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaHandHoldingHeart,
  FaHistory,
  FaUsers,
  FaClipboardCheck,
  FaChartBar,
  FaFileAlt,
  FaTimes,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const donorMenu = [
    { path: '/donor/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/donor/requests', label: 'Browse Requests', icon: FaHandHoldingHeart },
    { path: '/donor/history', label: 'Donation History', icon: FaHistory },
  ];

  const receiverMenu = [
    { path: '/receiver/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/receiver/request', label: 'Submit Request', icon: FaFileAlt },
    { path: '/receiver/status', label: 'Request Status', icon: FaClipboardCheck },
    { path: '/receiver/profile', label: 'Profile', icon: FaUsers },
  ];

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/admin/requests', label: 'Review Requests', icon: FaClipboardCheck },
    { path: '/admin/users', label: 'User Management', icon: FaUsers },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
    { path: '/admin/logs', label: 'Activity Logs', icon: FaFileAlt },
  ];

  const getMenuItems = () => {
    if (!user) return [];
    const role = user.role.toLowerCase();
    if (role === 'donor') return donorMenu;
    if (role === 'receiver') return receiverMenu;
    if (role === 'admin') return adminMenu;
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg min-h-screen fixed left-0 top-16 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close sidebar"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Check if current path matches or starts with the menu item path
              const isActive = location.pathname === item.path || 
                               (item.path !== `/${user?.role?.toLowerCase()}/dashboard` && 
                                location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-text hover:bg-gray-100'
                    }`}
                  >
                    <Icon />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

