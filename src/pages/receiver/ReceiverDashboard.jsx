import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { dataService } from '../../services/dataService';
import { FaFileAlt, FaClipboardCheck, FaHandHoldingHeart, FaArrowRight, FaPlus } from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';

const ReceiverDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReceiverData();
  }, []);

  const loadReceiverData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch REAL receiver requests from API - NO MOCK DATA
      const result = await dataService.getReceiverRequests();

      if (result.success) {
        setRequests(result.data || []);
      } else {
        setError('Failed to load requests');
      }
    } catch (err) {
      setError(err.message || 'Failed to load requests');
      console.error('Receiver dashboard load error:', err);
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

  // Compute metrics from REAL data
  const activeRequests = requests.filter(r => 
    r.status === 'VERIFIED' || r.status === 'SUBMITTED' || r.status === 'FUNDED'
  );
  const approvedRequests = requests.filter(r => r.status === 'VERIFIED' || r.status === 'FUNDED');
  const totalReceived = approvedRequests.reduce((sum, r) => sum + (Number(r.currentAmount) || 0), 0);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            {t('receiver.dashboard.title', { name: user?.name })}
          </h1>
          <p className="text-gray-600">{t('receiver.dashboard.subtitle')}</p>
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
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('receiver.dashboard.title', { name: user?.name })}
        </h1>
        <p className="text-gray-600">{t('receiver.dashboard.subtitle')}</p>
      </div>

      {/* Stats Cards - ALL FROM REAL DATABASE DATA */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaFileAlt className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('receiver.dashboard.activeRequests')}</p>
              {/* Real count from requests table where receiverId = current user and status is active */}
              <p className="text-2xl font-bold text-text-dark">{activeRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaClipboardCheck className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('receiver.dashboard.approved')}</p>
              {/* Real count from requests table where receiverId = current user and status = VERIFIED/FUNDED */}
              <p className="text-2xl font-bold text-text-dark">{approvedRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('receiver.dashboard.totalReceived')}</p>
              {/* Real sum of currentAmount from requests table where receiverId = current user */}
              <p className="text-2xl font-bold text-text-dark">{formatCurrency(totalReceived)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/receiver/request" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">{t('receiver.dashboard.submitNewRequest')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('receiver.dashboard.submitNewRequestDesc')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('receiver.dashboard.getStarted')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaPlus className="text-primary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/receiver/status" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">{t('receiver.dashboard.requestStatus')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('receiver.dashboard.requestStatusDesc')}
                </p>
                <span className="text-primary font-medium flex items-center">
                  {t('receiver.dashboard.viewStatus')} <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaClipboardCheck className="text-secondary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>
      </div>

      {/* Recent Requests - REAL DATA */}
      {requests.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-dark">{t('receiver.dashboard.yourRequests')}</h2>
            <Link to="/receiver/status" className="text-primary hover:text-primary-dark text-sm font-medium">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="space-y-4">
            {requests.slice(0, 3).map(request => (
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
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatCurrency(request.amount)}</span>
                      <span>{request.category}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-semibold text-text-dark mb-1">
                      {request.progress || 0}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${request.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={FaFileAlt}
            title={t('receiver.dashboard.noRequests', 'No Requests Yet')}
            message={t('receiver.dashboard.noRequestsDesc', 'You haven\'t submitted any requests yet. Click "Submit New Request" to get started.')}
            action={
              <Link
                to="/receiver/request"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <FaPlus className="mr-2" />
                {t('receiver.dashboard.submitNewRequest')}
              </Link>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default ReceiverDashboard;
