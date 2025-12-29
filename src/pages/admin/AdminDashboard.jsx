import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { mockStats, mockDonationRequests, mockUsers } from '../../data/mockData';
import { FaUsers, FaClipboardCheck, FaChartBar, FaHandHoldingHeart, FaArrowRight, FaFileAlt, FaListAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const pendingRequests = mockDonationRequests.filter(r => 
    r.status === 'submitted' || r.status === 'under_verification'
  );

  const totalRaised = mockDonationRequests.reduce((sum, r) => sum + r.currentAmount, 0);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('admin.dashboard.title')}
        </h1>
        <p className="text-gray-600">{t('admin.dashboard.subtitle')}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('admin.dashboard.totalUsers')}</p>
              <p className="text-2xl font-bold text-text-dark">{mockUsers.length}</p>
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
              <p className="text-2xl font-bold text-text-dark">{pendingRequests.length}</p>
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
              <p className="text-2xl font-bold text-text-dark">${totalRaised.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-text-dark">{mockStats.totalRequests}</p>
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
              <p className="text-sm text-gray-600 mb-3">{pendingRequests.length} {t('admin.dashboard.reviewRequestsDesc')}</p>
              <span className="text-primary font-medium flex items-center justify-center">
                {t('admin.reviewRequests.title')} <FaArrowRight className="ml-2" />
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
              <p className="text-sm text-gray-600 mb-3">{mockUsers.length} {t('admin.dashboard.userManagementDesc')}</p>
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

      {/* Recent Pending Requests */}
      {pendingRequests.length > 0 && (
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
                      <span>${request.amount.toLocaleString()}</span>
                      <span className="capitalize">{request.urgency} urgency</span>
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
      )}
    </div>
  );
};

export default AdminDashboard;






