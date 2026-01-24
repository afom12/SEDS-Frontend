import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { FaBell } from 'react-icons/fa';

const DonorNotifications = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('donor.notifications.title', 'Notifications')}
        </h1>
        <p className="text-gray-600">
          {t('donor.notifications.subtitle', 'Updates on donations, approvals, and deliveries')}
        </p>
      </div>

      <Card>
        <EmptyState
          icon={FaBell}
          title={t('donor.notifications.emptyTitle', 'No notifications yet')}
          message={t('donor.notifications.emptyDesc', 'We will notify you when your donations move forward.')}
          action={
            <Link
              to="/donor/history"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              {t('donor.notifications.viewHistory', 'View Donation History')}
            </Link>
          }
        />
      </Card>
    </div>
  );
};

export default DonorNotifications;

