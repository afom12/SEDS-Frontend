import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { dataService } from '../../services/dataService';
import { FaChartBar, FaHandHoldingHeart, FaUsers, FaClipboardCheck, FaDollarSign } from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';

const Analytics = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch REAL analytics from API - NO MOCK DATA
      const result = await dataService.getAnalytics();

      if (result.success) {
        setAnalytics(result.data);
      } else {
        setError('Failed to load analytics');
      }
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      console.error('Analytics load error:', err);
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
          <h1 className="text-3xl font-bold text-text-dark mb-2">Analytics & Insights</h1>
          <p className="text-gray-600">Platform performance and statistics</p>
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

  if (!analytics) {
    return (
      <div className="p-6 md:p-8">
        <EmptyState
          icon={FaChartBar}
          title="No Analytics Data"
          message="Analytics data will appear here once the platform has activity."
        />
      </div>
    );
  }

  // Extract REAL data from API response - defaults to 0 if no data
  const donations = analytics.donations || {};
  const requests = analytics.requests || {};
  const users = analytics.users || {};
  const platform = analytics.platform || {};

  const totalRaised = donations.totalAmount || 0;
  const totalDonations = donations.count || 0;
  const activeRequests = requests.verified || 0;
  const activeUsers = users.donors + users.receivers || 0;
  const totalRequested = requests.totalRequested || 0;
  const totalRaisedAmount = requests.totalRaised || 0;

  // Category breakdown - REAL data from database
  const categoryBreakdown = requests.byCategory || {};
  const categoryEntries = Object.entries(categoryBreakdown);

  // Status breakdown - REAL data from database
  const statusBreakdown = requests.byStatus || {};
  const statusEntries = Object.entries(statusBreakdown);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Platform performance and statistics - All metrics computed from real data</p>
      </div>

      {/* Key Metrics - ALL FROM REAL DATABASE */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaDollarSign className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Raised</p>
              {/* Real sum from donations table where paymentStatus = COMPLETED */}
              <p className="text-2xl font-bold text-text-dark">{formatCurrency(totalRaised)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              {/* Real count from donations table where paymentStatus = COMPLETED */}
              <p className="text-2xl font-bold text-text-dark">{totalDonations}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaClipboardCheck className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified Requests</p>
              {/* Real count from requests table where verified = true */}
              <p className="text-2xl font-bold text-text-dark">{activeRequests}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaUsers className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              {/* Real count from users table (donors + receivers) */}
              <p className="text-2xl font-bold text-text-dark">{activeUsers}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown - REAL DATA */}
        <Card>
          <h2 className="text-xl font-semibold text-text-dark mb-6">Donations by Category</h2>
          {categoryEntries.length > 0 ? (
            <div className="space-y-4">
              {categoryEntries.map(([category, data]) => {
                const requested = data.requested || 0;
                const raised = data.raised || 0;
                const percentage = totalRequested > 0 ? (requested / totalRequested) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{category}</span>
                      <span className="text-gray-600">{formatCurrency(requested)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={FaChartBar}
              title="No Category Data"
              message="Category breakdown will appear once requests are created."
              size="sm"
            />
          )}
        </Card>

        {/* Status Breakdown - REAL DATA */}
        <Card>
          <h2 className="text-xl font-semibold text-text-dark mb-6">Request Status</h2>
          {statusEntries.length > 0 ? (
            <div className="space-y-4">
              {statusEntries.map(([status, count]) => {
                const total = Object.values(statusBreakdown).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const colorClass = {
                  VERIFIED: 'bg-green-500',
                  SUBMITTED: 'bg-yellow-500',
                  REJECTED: 'bg-red-500',
                  COMPLETED: 'bg-blue-500',
                  FUNDED: 'bg-purple-500',
                  DRAFT: 'bg-gray-500',
                }[status] || 'bg-gray-500';

                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700 capitalize">{status.toLowerCase()}</span>
                      <span className="text-gray-600">{count} requests</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colorClass} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={FaClipboardCheck}
              title="No Status Data"
              message="Status breakdown will appear once requests are created."
              size="sm"
            />
          )}
        </Card>

        {/* Funding Progress - REAL DATA */}
        <Card className="md:col-span-2">
          <h2 className="text-xl font-semibold text-text-dark mb-6">Overall Funding Progress</h2>
          {totalRequested > 0 ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Total Raised</span>
                  <span className="text-gray-600">
                    {formatCurrency(totalRaisedAmount)} / {formatCurrency(totalRequested)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-secondary h-4 rounded-full transition-all"
                    style={{ width: `${(totalRaisedAmount / totalRequested) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((totalRaisedAmount / totalRequested) * 100).toFixed(1)}% of total requested amount raised
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  {/* Real count from requests table */}
                  <p className="text-2xl font-bold text-text-dark">{requests.total || 0}</p>
                  <p className="text-xs text-gray-600">Total Requests</p>
                </div>
                <div className="text-center">
                  {/* Real count from requests table where status = COMPLETED */}
                  <p className="text-2xl font-bold text-text-dark">{requests.completed || 0}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  {/* Real count from requests table where verified = true */}
                  <p className="text-2xl font-bold text-text-dark">{requests.verified || 0}</p>
                  <p className="text-xs text-gray-600">Verified</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={FaDollarSign}
              title="No Funding Data"
              message="Funding progress will appear once requests are created and donations are made."
              size="sm"
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
