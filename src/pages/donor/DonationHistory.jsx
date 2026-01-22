import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { dataService } from '../../services/dataService';
import { FaHandHoldingHeart, FaCalendarAlt, FaLock, FaUser, FaSearch } from 'react-icons/fa';

const DonationHistory = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDonationHistory();
  }, []);

  const loadDonationHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch REAL donation history from API - NO MOCK DATA
      const result = await dataService.getDonationHistory();

      if (result.success) {
        setDonations(result.data || []);
      } else {
        setError('Failed to load donation history');
      }
    } catch (err) {
      setError(err.message || 'Failed to load donation history');
      console.error('Donation history load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter donations
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.request?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Match by REAL payment status from database
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'completed' && donation.paymentStatus === 'COMPLETED') ||
      (statusFilter === 'pending' && donation.paymentStatus === 'PENDING') ||
      (statusFilter === 'cancelled' && (donation.paymentStatus === 'CANCELLED' || donation.paymentStatus === 'FAILED'));
    
    return matchesSearch && matchesStatus;
  });

  // Compute metrics from REAL data
  const completedDonations = donations.filter(d => d.paymentStatus === 'COMPLETED');
  const totalDonated = completedDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'completed':
        return 'text-green-600';
      case 'PENDING':
      case 'pending':
      case 'PROCESSING':
        return 'text-yellow-600';
      case 'CANCELLED':
      case 'cancelled':
      case 'FAILED':
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
          <h1 className="text-3xl font-bold text-text-dark mb-2">{t('donor.donationHistory.title')}</h1>
          <p className="text-gray-600">{t('donor.donationHistory.subtitle')}</p>
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
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">{t('donor.donationHistory.title')}</h1>
        <p className="text-gray-600">{t('donor.donationHistory.subtitle')}</p>
      </div>

      {/* Summary Cards - ALL FROM REAL DATABASE DATA */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('donor.dashboard.totalDonated')}</p>
              {/* Real sum from donations table where paymentStatus = COMPLETED */}
              <p className="text-2xl font-bold text-text-dark">{formatCurrency(totalDonated)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('donor.dashboard.totalDonations')}</p>
              {/* Real count from donations table */}
              <p className="text-2xl font-bold text-text-dark">{donations.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('donor.dashboard.completed')}</p>
              {/* Real count from donations table where paymentStatus = COMPLETED */}
              <p className="text-2xl font-bold text-text-dark">{completedDonations.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('donor.donationHistory.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">{t('donor.donationHistory.allStatus')}</option>
            <option value="completed">{t('donor.dashboard.completed')}</option>
            <option value="pending">{t('common.pending')}</option>
            <option value="cancelled">{t('common.cancelled')}</option>
          </select>
        </div>
      </Card>

      {/* Donations List - REAL DATA */}
      {filteredDonations.length === 0 ? (
        <EmptyState
          icon={FaHandHoldingHeart}
          title={t('donor.donationHistory.noDonations')}
          message={t('donor.donationHistory.noDonationsDesc', 'You haven\'t made any donations yet. Browse requests to get started.')}
        />
      ) : (
        <div className="space-y-4">
          {filteredDonations.map(donation => (
            <Card key={donation.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-text-dark">
                      {donation.request?.title || 'Unknown Request'}
                    </h3>
                    <StatusBadge status={donation.paymentStatus || donation.status} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {new Date(donation.createdAt || donation.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      {donation.anonymous ? (
                        <>
                          <FaLock className="mr-2" />
                          Anonymous
                        </>
                      ) : (
                        <>
                          <FaUser className="mr-2" />
                          {donation.donor?.name || 'You'}
                        </>
                      )}
                    </span>
                    {donation.receiptNumber && (
                      <span className="text-xs text-gray-500">
                        Receipt: {donation.receiptNumber}
                      </span>
                    )}
                  </div>

                  {donation.request && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {donation.request.description}
                    </p>
                  )}

                  {donation.message && (
                    <p className="text-sm text-gray-500 italic mt-2">
                      "{donation.message}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end md:ml-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">
                      {formatCurrency(donation.amount)}
                    </p>
                    <p className={`text-sm font-medium ${getStatusColor(donation.paymentStatus || donation.status)}`}>
                      {(donation.paymentStatus || donation.status).charAt(0).toUpperCase() + 
                       (donation.paymentStatus || donation.status).slice(1).toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;
