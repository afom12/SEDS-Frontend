import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { FaBell } from 'react-icons/fa';

const ReceiverNotifications = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('receiver.notifications.title', 'Notifications')}
        </h1>
        <p className="text-gray-600">
          {t('receiver.notifications.subtitle', 'Updates on your request status and aid delivery')}
        </p>
      </div>

      <Card>
        <EmptyState
          icon={FaBell}
          title={t('receiver.notifications.emptyTitle', 'No notifications yet')}
          message={t('receiver.notifications.emptyDesc', 'We will notify you when your request is reviewed or matched.')}
          action={
            <Link
              to="/receiver/status"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              {t('receiver.notifications.viewStatus', 'Track Requests')}
            </Link>
          }
        />
      </Card>
    </div>
  );
};

export default ReceiverNotifications;

