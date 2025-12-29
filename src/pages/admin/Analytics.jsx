import React from 'react';
import Card from '../../components/Card';
import { mockStats, mockDonationRequests, mockDonations } from '../../data/mockData';
import { FaChartBar, FaHandHoldingHeart, FaUsers, FaClipboardCheck, FaDollarSign } from 'react-icons/fa';

const Analytics = () => {
  const categoryBreakdown = mockDonationRequests.reduce((acc, req) => {
    acc[req.category] = (acc[req.category] || 0) + req.amount;
    return acc;
  }, {});

  const statusBreakdown = {
    approved: mockDonationRequests.filter(r => r.status === 'approved').length,
    pending: mockDonationRequests.filter(r => r.status === 'submitted' || r.status === 'under_verification').length,
    rejected: mockDonationRequests.filter(r => r.status === 'rejected').length,
  };

  const totalRaised = mockDonationRequests.reduce((sum, r) => sum + r.currentAmount, 0);
  const totalRequested = mockDonationRequests.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Platform performance and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaDollarSign className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-text-dark">${totalRaised.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-text-dark">{mockDonations.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaClipboardCheck className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Requests</p>
              <p className="text-2xl font-bold text-text-dark">
                {mockDonationRequests.filter(r => r.status === 'approved').length}
              </p>
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
              <p className="text-2xl font-bold text-text-dark">{mockStats.activeDonors + mockStats.activeReceivers}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <h2 className="text-xl font-semibold text-text-dark mb-6">Donations by Category</h2>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([category, amount]) => {
              const percentage = (amount / totalRequested) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{category}</span>
                    <span className="text-gray-600">${amount.toLocaleString()}</span>
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
        </Card>

        {/* Status Breakdown */}
        <Card>
          <h2 className="text-xl font-semibold text-text-dark mb-6">Request Status</h2>
          <div className="space-y-4">
            {Object.entries(statusBreakdown).map(([status, count]) => {
              const total = Object.values(statusBreakdown).reduce((a, b) => a + b, 0);
              const percentage = (count / total) * 100;
              const colorClass = {
                approved: 'bg-green-500',
                pending: 'bg-yellow-500',
                rejected: 'bg-red-500',
              }[status] || 'bg-gray-500';

              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700 capitalize">{status}</span>
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
        </Card>

        {/* Funding Progress */}
        <Card className="md:col-span-2">
          <h2 className="text-xl font-semibold text-text-dark mb-6">Overall Funding Progress</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Total Raised</span>
                <span className="text-gray-600">
                  ${totalRaised.toLocaleString()} / ${totalRequested.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-secondary h-4 rounded-full transition-all"
                  style={{ width: `${(totalRaised / totalRequested) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((totalRaised / totalRequested) * 100).toFixed(1)}% of total requested amount raised
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-dark">{mockStats.totalRequests}</p>
                <p className="text-xs text-gray-600">Total Requests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-dark">{mockStats.completedRequests}</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-dark">
                  {mockDonationRequests.filter(r => r.status === 'approved').length}
                </p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

