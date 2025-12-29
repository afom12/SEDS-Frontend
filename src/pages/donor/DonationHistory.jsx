import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { mockDonations, mockDonationRequests } from '../../data/mockData';
import { FaHandHoldingHeart, FaCalendarAlt, FaLock, FaUser, FaSearch } from 'react-icons/fa';

const DonationHistory = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Enrich donations with request details
  const enrichedDonations = mockDonations.map(donation => {
    const request = mockDonationRequests.find(r => r.id === donation.requestId);
    return {
      ...donation,
      request: request || null,
    };
  });

  const filteredDonations = enrichedDonations.filter(donation => {
    const matchesSearch = donation.requestTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.request?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const totalDonated = mockDonations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">{t('donor.donationHistory.title')}</h1>
        <p className="text-gray-600">{t('donor.donationHistory.subtitle')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('donor.dashboard.totalDonated')}</p>
              <p className="text-2xl font-bold text-text-dark">${totalDonated.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-text-dark">{mockDonations.length}</p>
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
              <p className="text-2xl font-bold text-text-dark">
                {mockDonations.filter(d => d.status === 'completed').length}
              </p>
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

      {/* Donations List */}
      {filteredDonations.length === 0 ? (
        <EmptyState
          icon={FaHandHoldingHeart}
          title={t('donor.donationHistory.noDonations')}
          message={t('donor.donationHistory.noDonationsDesc')}
        />
      ) : (
        <div className="space-y-4">
          {filteredDonations.map(donation => (
            <Card key={donation.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-text-dark">
                      {donation.requestTitle || donation.request?.title || 'Unknown Request'}
                    </h3>
                    <StatusBadge status={donation.status} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {new Date(donation.date).toLocaleDateString()}
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
                          {donation.donorName}
                        </>
                      )}
                    </span>
                  </div>

                  {donation.request && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {donation.request.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end md:ml-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">
                      ${donation.amount.toLocaleString()}
                    </p>
                    <p className={`text-sm font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
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

