import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { dataService } from '../../services/dataService';
import { API_CONFIG } from '../../config/api';
import apiClient from '../../services/apiClient';
import { FaUsers, FaClipboardCheck, FaChartBar, FaHandHoldingHeart, FaArrowRight, FaFileAlt, FaListAlt } from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch REAL stats from API - NO MOCK DATA
      const [statsResult, requestsResult] = await Promise.all([
        dataService.getStats(),
        dataService.getDonationRequests(),
      ]);

      if (statsResult.success) {
        setStats(statsResult.data);
      }

      if (requestsResult.success) {
        // Filter pending requests from REAL data
        const pending = requestsResult.data.filter(r => 
          r.status === 'SUBMITTED' || r.status === 'DRAFT'
        );
        setPendingRequests(pending);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {t('admin.dashboard.title')}
          </h1>
          <p className="text-gray-600">{t('admin.dashboard.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  // Use REAL data from API - defaults to 0 if no data
  const totals = stats?.totals || {};
  const totalUsers = totals.users || 0;
  const pendingCount = totals.pendingRequests || pendingRequests.length || 0;
  const totalRaised = totals.totalAmount || 0;
  const totalRequests = totals.requests || 0;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('admin.dashboard.title')}
        </h1>
        <p className="text-gray-600">{t('admin.dashboard.subtitle')}</p>
      </div>

      {/* Key Metrics - ALL FROM REAL DATABASE DATA */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('admin.dashboard.totalUsers')}</p>
              {/* Real count from users table */}
              <p className="text-2xl font-bold text-text-dark">{totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <FaClipboardCheck className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('admin.dashboard.pendingRequests')}</p>
              {/* Real count from requests table where status = SUBMITTED or DRAFT */}
              <p className="text-2xl font-bold text-text-dark">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('admin.dashboard.totalRaised')}</p>
              {/* Real sum from donations table where paymentStatus = COMPLETED */}
              <p className="text-2xl font-bold text-text-dark">{formatCurrency(totalRaised)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaChartBar className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('admin.dashboard.totalRequests')}</p>
              {/* Real count from requests table */}
              <p className="text-2xl font-bold text-text-dark">{totalRequests}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/admin/requests" className="block">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaClipboardCheck className="text-primary text-2xl" />
              </div>
              <h3 className="font-semibold text-text-dark mb-2">{t('admin.dashboard.reviewRequests')}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {pendingCount} {t('admin.dashboard.reviewRequestsDesc')}
              </p>
              <span className="text-primary font-medium flex items-center justify-center">
                {t('admin.reviewRequests.title')} <FaArrowRight className="ml-2" />
              </span>
            </div>
          </Link>
        </Card>

            <Card className="hover:shadow-xl transition-shadow cursor-pointer">
              <Link to="/admin/verify-users" className="block">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2">{t('admin.dashboard.verifyUsers', 'Verify Users')}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {t('admin.dashboard.verifyUsersDesc', 'Review and verify user accounts')}
                  </p>
                  <span className="text-primary font-medium flex items-center justify-center">
                    {t('common.viewAll')} <FaArrowRight className="ml-2" />
                  </span>
                </div>
              </Link>
            </Card>

            <Card className="hover:shadow-xl transition-shadow cursor-pointer">
              <Link to="/admin/verify-requests" className="block">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FaClipboardCheck className="text-yellow-600 text-2xl" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2">{t('admin.dashboard.verifyRequests', 'Verify Requests')}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {t('admin.dashboard.verifyRequestsDesc', 'Review and verify aid requests')}
                  </p>
                  <span className="text-primary font-medium flex items-center justify-center">
                    {t('common.viewAll')} <FaArrowRight className="ml-2" />
                  </span>
                </div>
              </Link>
            </Card>

            <Card className="hover:shadow-xl transition-shadow cursor-pointer">
              <Link to="/admin/users" className="block">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-secondary text-2xl" />
              </div>
              <h3 className="font-semibold text-text-dark mb-2">{t('admin.dashboard.userManagement')}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {totalUsers} {t('admin.dashboard.userManagementDesc')}
              </p>
              <span className="text-primary font-medium flex items-center justify-center">
                {t('admin.userManagement.title')} <FaArrowRight className="ml-2" />
              </span>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/admin/analytics" className="block">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaChartBar className="text-accent text-2xl" />
              </div>
              <h3 className="font-semibold text-text-dark mb-2">{t('admin.dashboard.analytics')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('admin.dashboard.analyticsDesc')}</p>
              <span className="text-primary font-medium flex items-center justify-center">
                {t('common.viewAll')} <FaArrowRight className="ml-2" />
              </span>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/admin/logs" className="block">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaListAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-text-dark mb-2">{t('admin.dashboard.activityLogs')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('admin.dashboard.activityLogsDesc')}</p>
              <span className="text-primary font-medium flex items-center justify-center">
                {t('common.viewAll')} <FaArrowRight className="ml-2" />
              </span>
            </div>
          </Link>
        </Card>
      </div>

      {/* Recent Pending Requests - REAL DATA */}
      {pendingRequests.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-dark">{t('admin.dashboard.pendingRequests')}</h2>
            <Link to="/admin/requests" className="text-primary hover:text-primary-dark text-sm font-medium">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="space-y-4">
            {pendingRequests.slice(0, 3).map(request => (
              <div
                key={request.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-dark">{request.title}</h3>
                      <StatusBadge status={request.status} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{request.category}</span>
                      <span>{formatCurrency(request.amount)}</span>
                    </div>
                  </div>
                  <Link
                    to="/admin/requests"
                    className="ml-4 text-primary hover:text-primary-dark"
                  >
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={FaClipboardCheck}
            title={t('admin.dashboard.noPendingRequests', 'No Pending Requests')}
            message={t('admin.dashboard.noPendingRequestsDesc', 'All requests have been reviewed. Check back later for new submissions.')}
          />
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
