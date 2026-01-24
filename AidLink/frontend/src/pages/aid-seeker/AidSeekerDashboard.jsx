import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { dataService } from '../../services/dataService';
import { aidService } from '../../services/aidService';
import { FaFileAlt, FaHandHoldingHeart, FaClock, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaSyncAlt, FaSpinner } from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';

const AidSeekerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const [requestsResult, deliveriesResult] = await Promise.all([
        dataService.getReceiverRequests(),
        aidService.getDeliveries({ seekerId: user?.id }),
      ]);

      if (requestsResult.success) {
        setRequests(requestsResult.data || []);
      }

      if (deliveriesResult.success) {
        setDeliveries(deliveriesResult.data || []);
      }
      if (requestsResult.success || deliveriesResult.success) {
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (!silent) {
        setError(err.message || 'Failed to load dashboard data');
      }
      console.error('Dashboard load error:', err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  // Compute metrics from REAL data
  const activeRequests = requests.filter(r => 
    ['VERIFIED', 'MATCHED', 'IN_PROGRESS'].includes(r.status)
  );
  const urgentRequests = requests.filter(r => r.urgency === 'URGENT');
  const matchedRequests = requests.filter(r => r.status === 'MATCHED' || r.status === 'IN_PROGRESS');
  const completedDeliveries = deliveries.filter(d => d.status === 'CONFIRMED');

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {t('aidSeeker.dashboard.title', 'My Aid Requests')}
          </h1>
          <p className="text-gray-600">{t('aidSeeker.dashboard.subtitle', 'Manage your aid requests and track deliveries')}</p>
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

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {t('aidSeeker.dashboard.title', 'My Aid Requests')}
          </h1>
          <p className="text-gray-600">
            {t('aidSeeker.dashboard.subtitle', 'Manage your aid requests and track deliveries')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              {t('common.lastUpdated', 'Last updated')} {lastUpdated.toLocaleString()}
            </span>
          )}
          <button
            type="button"
            onClick={() => loadDashboardData({ silent: true })}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
            {t('common.refresh', 'Refresh')}
          </button>
        </div>
      </div>

      {/* Stats Cards - ALL FROM REAL DATA */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaFileAlt className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('aidSeeker.dashboard.activeRequests', 'Active Requests')}</p>
              {/* Real count from requests table */}
              <p className="text-2xl font-bold text-text-dark">{activeRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('aidSeeker.dashboard.urgent', 'Urgent')}</p>
              {/* Real count of urgent requests */}
              <p className="text-2xl font-bold text-text-dark">{urgentRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('aidSeeker.dashboard.matched', 'Matched')}</p>
              {/* Real count of matched requests */}
              <p className="text-2xl font-bold text-text-dark">{matchedRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('aidSeeker.dashboard.completed', 'Completed')}</p>
              {/* Real count of confirmed deliveries */}
              <p className="text-2xl font-bold text-text-dark">{completedDeliveries.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/aid-seeker/request" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {t('aidSeeker.dashboard.createRequest', 'Create Aid Request')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('aidSeeker.dashboard.createRequestDesc', 'Request food, clothing, medical aid, or other assistance')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('common.getStarted')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-primary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/aid-seeker/dashboard#recent-requests" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {t('aidSeeker.dashboard.myRequests', 'My Requests')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('aidSeeker.dashboard.myRequestsDesc', 'View and manage all your aid requests')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('common.viewAll')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaHandHoldingHeart className="text-secondary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>
      </div>

      {/* Urgent Requests Alert */}
      {urgentRequests.length > 0 && (
        <Card className="mb-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-600 text-2xl mr-4 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                {t('aidSeeker.dashboard.urgentAlert', 'Urgent Requests Need Attention')}
              </h3>
              <p className="text-red-800 dark:text-red-300 text-sm mb-4">
                {t('aidSeeker.dashboard.urgentAlertDesc', 'You have {count} urgent requests that need immediate attention.', { count: urgentRequests.length })}
              </p>
              <Link
                to="/aid-seeker/requests"
                className="text-red-700 dark:text-red-300 font-medium text-sm hover:underline"
              >
                {t('common.viewDetails')} →
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Requests */}
      {requests.length > 0 ? (
        <Card id="recent-requests">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-dark">
              {t('aidSeeker.dashboard.recentRequests', 'Recent Requests')}
            </h2>
            <Link to="/aid-seeker/requests" className="text-primary hover:text-primary-dark text-sm font-medium">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="space-y-4">
            {requests.slice(0, 5).map(request => (
              <div
                key={request.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-dark">{request.title}</h3>
                      <StatusBadge status={request.status} size="sm" />
                      {request.urgency === 'URGENT' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                          {t('common.urgent', 'URGENT')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {request.aidType && (
                        <span className="font-medium">{request.aidType.name}</span>
                      )}
                      {request.quantity && (
                        <span>{request.quantity} {request.unit || 'units'}</span>
                      )}
                      {request.location && (
                        <span>📍 {request.location}</span>
                      )}
                      {request.expiresAt && (
                        <span className="text-red-600">
                          ⏰ {t('common.expires', 'Expires')}: {new Date(request.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {request.matchedOffers && request.matchedOffers.length > 0 && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ {request.matchedOffers.length} {t('aidSeeker.dashboard.offersMatched', 'offer(s) matched')}
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/aid-seeker/requests/${request.id}`}
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
            icon={FaFileAlt}
            title={t('aidSeeker.dashboard.noRequests', 'No Requests Yet')}
            message={t('aidSeeker.dashboard.noRequestsDesc', 'You haven\'t created any aid requests yet. Click "Create Aid Request" to get started.')}
            action={
              <Link
                to="/aid-seeker/request"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <FaFileAlt className="mr-2" />
                {t('aidSeeker.dashboard.createRequest', 'Create Aid Request')}
              </Link>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default AidSeekerDashboard;

