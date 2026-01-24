import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { API_CONFIG } from '../config/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Card from '../components/Card';
import { FaHandHoldingHeart, FaUsers, FaCheckCircle, FaChartLine } from 'react-icons/fa';

const Transparency = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, ledgerRes] = await Promise.all([
        apiClient.get(API_CONFIG.ENDPOINTS.TRANSPARENCY.STATS),
        apiClient.get(API_CONFIG.ENDPOINTS.TRANSPARENCY.LEDGER),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ledgerRes.success) setLedger(ledgerRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load transparency data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-dark dark:text-white mb-4">
            {t('transparency.title', 'Transparency & Accountability')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('transparency.description', 'Every donation is tracked, verified, and publicly visible. We believe in complete transparency to build trust and ensure your contributions make a real impact.')}
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-secondary/10 p-4 rounded-full">
                  <FaHandHoldingHeart className="text-secondary text-2xl" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-dark dark:text-white mb-2">
                {stats.totalDonations?.toLocaleString() || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('transparency.totalDonations', 'Total Donations')}
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <FaChartLine className="text-primary text-2xl" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-dark dark:text-white mb-2">
                {formatCurrency(stats.totalAmount || 0)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('transparency.totalAmount', 'Total Amount Raised')}
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-accent/10 p-4 rounded-full">
                  <FaUsers className="text-accent text-2xl" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-dark dark:text-white mb-2">
                {stats.totalRequests?.toLocaleString() || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('transparency.totalRequests', 'Verified Requests')}
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-500/10 p-4 rounded-full">
                  <FaCheckCircle className="text-green-500 text-2xl" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-dark dark:text-white mb-2">
                {stats.completedRequests?.toLocaleString() || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('transparency.completedRequests', 'Completed Requests')}
              </p>
            </Card>
          </div>
        )}

        {/* Trust Indicators */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-6">
            {t('transparency.trustIndicators', 'Why You Can Trust Us')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <FaCheckCircle className="text-green-500 mr-2" />
                <h3 className="font-semibold text-text-dark dark:text-white">
                  {t('transparency.verified', 'Verified Requests')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('transparency.verifiedDesc', 'All requests go through admin verification before being published.')}
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <FaCheckCircle className="text-green-500 mr-2" />
                <h3 className="font-semibold text-text-dark dark:text-white">
                  {t('transparency.transparent', 'Public Ledger')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('transparency.transparentDesc', 'Every donation is recorded in our public ledger for complete transparency.')}
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <FaCheckCircle className="text-green-500 mr-2" />
                <h3 className="font-semibold text-text-dark dark:text-white">
                  {t('transparency.audit', 'Audit Trail')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('transparency.auditDesc', 'All admin actions are logged immutably for accountability.')}
              </p>
            </div>
          </div>
        </Card>

        {/* Donation Ledger */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-dark dark:text-white">
              {t('transparency.ledger', 'Recent Donations')}
            </h2>
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-medium"
            >
              {t('transparency.viewAll', 'View All')} →
            </Link>
          </div>

          {ledger.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {t('transparency.noDonations', 'No donations yet. Be the first to make a difference!')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('transparency.date', 'Date')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('transparency.request', 'Request')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('transparency.donor', 'Donor')}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('transparency.amount', 'Amount')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('transparency.receipt', 'Receipt')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.slice(0, 20).map((donation) => (
                    <tr
                      key={donation.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/transparency/requests/${donation.request.id}`}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          {donation.request.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {donation.anonymous ? (
                          <span className="text-gray-500 dark:text-gray-400 italic">
                            {t('transparency.anonymous', 'Anonymous')}
                          </span>
                        ) : (
                          donation.donor?.name || t('transparency.anonymous', 'Anonymous')
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-text-dark dark:text-white">
                        {formatCurrency(donation.amount)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                        {donation.receiptNumber || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Ethical Disclaimer */}
        <Card className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            {t('transparency.disclaimer', 'Important Notice')}
          </h3>
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            {t('transparency.disclaimerText', 'AidLink is committed to transparency and accountability. All donations are processed securely, and all requests are verified before publication. We maintain a public ledger of all transactions to ensure complete transparency. If you have any concerns, please contact us.')}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Transparency;

