import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { aidService } from '../../services/aidService';
import { dataService } from '../../services/dataService';
import { FaHandHoldingHeart, FaClock, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaPlus, FaTruck, FaSyncAlt, FaSpinner } from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';

const AidProviderDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);
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

      const [offersResult, requestsResult, deliveriesResult] = await Promise.all([
        aidService.getOffers({ providerId: user?.id }),
        dataService.getDonationRequests({ urgent: 'true', requestType: 'aid' }),
        aidService.getDeliveries({ providerId: user?.id }),
      ]);

      if (offersResult.success) {
        setOffers(offersResult.data || []);
      }

      if (requestsResult.success) {
        setUrgentRequests(requestsResult.data?.slice(0, 5) || []);
      }

      if (deliveriesResult.success) {
        setDeliveries(deliveriesResult.data || []);
      }
      if (offersResult.success || requestsResult.success || deliveriesResult.success) {
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
  const availableOffers = offers.filter(o => o.status === 'AVAILABLE');
  const matchedOffers = offers.filter(o => ['MATCHED', 'ACCEPTED', 'IN_TRANSIT'].includes(o.status));
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
            {t('aidProvider.dashboard.title', 'Aid Provider Dashboard')}
          </h1>
          <p className="text-gray-600">{t('aidProvider.dashboard.subtitle', 'Offer aid and help those in need')}</p>
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
            {t('aidProvider.dashboard.title', 'Aid Provider Dashboard')}
          </h1>
          <p className="text-gray-600">
            {t('aidProvider.dashboard.subtitle', 'Offer aid and help those in need')}
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
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('aidProvider.dashboard.availableOffers', 'Available Offers')}</p>
              {/* Real count from aid_offers table where status = AVAILABLE */}
              <p className="text-2xl font-bold text-text-dark">{availableOffers.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('aidProvider.dashboard.matched', 'Matched')}</p>
              {/* Real count of matched offers */}
              <p className="text-2xl font-bold text-text-dark">{matchedOffers.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('aidProvider.dashboard.completed', 'Completed')}</p>
              {/* Real count of confirmed deliveries */}
              <p className="text-2xl font-bold text-text-dark">{completedDeliveries.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('aidProvider.dashboard.urgentNeeds', 'Urgent Needs')}</p>
              {/* Real count of urgent requests */}
              <p className="text-2xl font-bold text-text-dark">{urgentRequests.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/aid-provider/offer" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {t('aidProvider.dashboard.createOffer', 'Offer Aid')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('aidProvider.dashboard.createOfferDesc', 'Offer food, clothing, medical aid, or other assistance')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('common.getStarted')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaPlus className="text-primary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/aid-provider/deliveries" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {t('aidProvider.dashboard.myDeliveries', 'My Deliveries')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('aidProvider.dashboard.myDeliveriesDesc', 'Track your aid deliveries')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('common.viewAll')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaTruck className="text-secondary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/aid-provider/requests" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">
                  {t('aidProvider.dashboard.browseRequests', 'Browse Requests')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('aidProvider.dashboard.browseRequestsDesc', 'Find requests you can help with')}
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

      {/* Urgent Needs Alert */}
      {urgentRequests.length > 0 && (
        <Card className="mb-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <FaExclamationTriangle className="text-red-600 text-2xl mr-4 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                  {t('aidProvider.dashboard.urgentNeedsAlert', 'Urgent Needs Nearby')}
                </h3>
                <p className="text-red-800 dark:text-red-300 text-sm mb-4">
                  {t('aidProvider.dashboard.urgentNeedsAlertDesc', 'There are {count} urgent requests that need immediate help.', { count: urgentRequests.length })}
                </p>
                <Link
                  to="/aid-provider/requests?urgent=true"
                  className="text-red-700 dark:text-red-300 font-medium text-sm hover:underline"
                >
                  {t('common.viewDetails')} →
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* My Offers */}
      {offers.length > 0 ? (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-dark">
              {t('aidProvider.dashboard.myOffers', 'My Offers')}
            </h2>
            <Link to="/aid-provider/offers" className="text-primary hover:text-primary-dark text-sm font-medium">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="space-y-4">
            {offers.slice(0, 5).map(offer => (
              <div
                key={offer.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-dark">{offer.title}</h3>
                      <StatusBadge status={offer.status} size="sm" />
                      {offer.expiresAt && new Date(offer.expiresAt) < new Date(Date.now() + 24 * 60 * 60 * 1000) && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                          {t('common.expiringSoon', 'Expiring Soon')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{offer.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {offer.aidType && (
                        <span className="font-medium">{offer.aidType.name}</span>
                      )}
                      {offer.quantity && (
                        <span>{offer.quantity} {offer.unit || 'units'}</span>
                      )}
                      {offer.location && (
                        <span>📍 {offer.location}</span>
                      )}
                      {offer.canDeliver && (
                        <span className="text-green-600">✓ {t('common.canDeliver', 'Can Deliver')}</span>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/aid-provider/offers/${offer.id}`}
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
        <Card className="mb-8">
          <EmptyState
            icon={FaHandHoldingHeart}
            title={t('aidProvider.dashboard.noOffers', 'No Offers Yet')}
            message={t('aidProvider.dashboard.noOffersDesc', 'You haven\'t created any aid offers yet. Click "Offer Aid" to get started.')}
            action={
              <Link
                to="/aid-provider/offer"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <FaPlus className="mr-2" />
                {t('aidProvider.dashboard.createOffer', 'Offer Aid')}
              </Link>
            }
          />
        </Card>
      )}

      {/* Recent Deliveries */}
      {deliveries.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-dark">
              {t('aidProvider.dashboard.recentDeliveries', 'Recent Deliveries')}
            </h2>
            <Link to="/aid-provider/deliveries" className="text-primary hover:text-primary-dark text-sm font-medium">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="space-y-4">
            {deliveries.slice(0, 3).map(delivery => (
              <div
                key={delivery.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-dark mb-1">
                      {delivery.request?.title || 'Delivery'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{delivery.quantity} {delivery.unit}</span>
                      <StatusBadge status={delivery.status} size="sm" />
                      {delivery.deliveredAt && (
                        <span>{new Date(delivery.deliveredAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AidProviderDashboard;

