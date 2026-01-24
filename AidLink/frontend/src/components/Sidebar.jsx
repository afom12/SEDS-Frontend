import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  FaBell,
  FaComments,
} from 'react-icons/fa';
import { normalizeRole } from '../utils/roleUtils';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  const donorMenu = [
    { path: '/donor/dashboard', label: t('nav.dashboard'), icon: FaHome },
    { path: '/donor/requests', label: t('donor.dashboard.browseRequests'), icon: FaHandHoldingHeart },
    { path: '/donor/history', label: t('donor.dashboard.donationHistory'), icon: FaHistory },
    { path: '/donor/messages', label: t('nav.messages', 'Messages'), icon: FaComments },
    { path: '/donor/notifications', label: t('nav.notifications', 'Notifications'), icon: FaBell },
  ];

  const receiverMenu = [
    { path: '/receiver/dashboard', label: t('nav.dashboard'), icon: FaHome },
    { path: '/receiver/request', label: t('receiver.submitRequest.title'), icon: FaFileAlt },
    { path: '/receiver/status', label: t('receiver.dashboard.requestStatus'), icon: FaClipboardCheck },
    { path: '/receiver/profile', label: t('receiver.profile.title'), icon: FaUsers },
    { path: '/receiver/messages', label: t('nav.messages', 'Messages'), icon: FaComments },
    { path: '/receiver/notifications', label: t('nav.notifications', 'Notifications'), icon: FaBell },
  ];

  const adminMenu = [
    { path: '/admin/dashboard', label: t('nav.dashboard'), icon: FaHome },
    { path: '/admin/requests', label: t('admin.reviewRequests.title'), icon: FaClipboardCheck },
    { path: '/admin/users', label: t('admin.userManagement.title'), icon: FaUsers },
    { path: '/admin/analytics', label: t('admin.analytics.title'), icon: FaChartBar },
    { path: '/admin/logs', label: t('admin.activityLogs.title'), icon: FaFileAlt },
  ];

  const getMenuItems = () => {
    if (!user) return [];
    const role = normalizeRole(user.role);
    if (role === 'donor') return donorMenu;
    if (role === 'recipient') return receiverMenu;
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

