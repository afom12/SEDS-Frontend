import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { dataService } from '../../services/dataService';
import { FaHandHoldingHeart, FaHistory, FaCheckCircle, FaArrowRight, FaClock, FaSpinner, FaSyncAlt, FaComments, FaBell } from 'react-icons/fa';

const DonorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [totalDonated, setTotalDonated] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [activeRequests, setActiveRequests] = useState([]);
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

      const [donationsResult, requestsResult] = await Promise.all([
        dataService.getDonations(),
        dataService.getDonationRequests(),
      ]);

      if (donationsResult.success) {
        const donations = donationsResult.data || [];
        // Filter by REAL payment status from database (COMPLETED, not 'completed')
        const completedDonations = donations.filter(d => 
          d.paymentStatus === 'COMPLETED' || d.paymentStatus === 'completed'
        );
        const total = completedDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        setTotalDonated(total);
        setCompletedCount(completedDonations.length);
        // Total donations includes all statuses for accurate count
        setTotalDonations(donations.length);
      }

      if (requestsResult.success) {
        // Filter by REAL status from database (VERIFIED, not 'approved')
        const verifiedRequests = requestsResult.data.filter(r => 
          r.status === 'VERIFIED' || r.status === 'verified' || r.status === 'FUNDED'
        );
        setActiveRequests(verifiedRequests.slice(0, 3));
      }

      if (donationsResult.success || requestsResult.success) {
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
            {t('donor.dashboard.title', { name: user?.name })}
          </h1>
          <p className="text-gray-600">{t('donor.dashboard.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
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
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {t('donor.dashboard.title', { name: user?.name })}
          </h1>
          <p className="text-gray-600">{t('donor.dashboard.subtitle')}</p>
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

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('donor.dashboard.totalDonated')}</p>
              <p className="text-2xl font-bold text-text-dark">{formatCurrency(totalDonated)}</p>
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('donor.dashboard.completed')}</p>
              <p className="text-2xl font-bold text-text-dark">{completedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaHistory className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('donor.dashboard.totalDonations')}</p>
              <p className="text-2xl font-bold text-text-dark">{totalDonations}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/donor/requests" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">{t('donor.dashboard.browseRequests')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('donor.dashboard.browseRequestsDesc')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('donor.dashboard.viewRequests')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaHandHoldingHeart className="text-primary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Link to="/donor/history" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">{t('donor.dashboard.donationHistory')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('donor.dashboard.donationHistoryDesc')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('donor.dashboard.viewHistory')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaHistory className="text-secondary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/donor/messages" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {t('donor.dashboard.messages', 'Messages')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('donor.dashboard.messagesDesc', 'Secure communication with matched recipients')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('common.viewAll')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaComments className="text-accent text-2xl" />
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <Link to="/donor/notifications" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {t('donor.dashboard.notifications', 'Notifications')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('donor.dashboard.notificationsDesc', 'Status updates on donations and deliveries')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('common.viewAll')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaBell className="text-primary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>
      </div>

      {/* Featured Requests */}
      {activeRequests.length > 0 ? (
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-dark">{t('donor.dashboard.featuredRequests')}</h2>
            <Link to="/donor/requests" className="text-primary hover:text-primary-dark text-sm font-medium">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {activeRequests.map(request => (
              <Link
                key={request.id}
                to={`/donor/requests/${request.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-text-dark mb-2 line-clamp-2">{request.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <FaClock className="mr-1" />
                    {request.urgency}
                  </span>
                  <span className="text-primary font-medium">{formatCurrency(request.amount)}</span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${request.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{request.progress}% {t('common.funded')}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <EmptyState
            icon={FaHandHoldingHeart}
            title={t('donor.dashboard.noFeaturedRequests', 'No featured requests')}
            message={t('donor.dashboard.noFeaturedRequestsDesc', 'Check back soon for new verified requests ready for funding.')}
            action={
              <Link
                to="/donor/requests"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                {t('donor.dashboard.viewRequests', 'Browse Requests')}
              </Link>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default DonorDashboard;





