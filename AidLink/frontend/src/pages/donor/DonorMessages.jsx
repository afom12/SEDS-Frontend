import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { FaComments } from 'react-icons/fa';

const DonorMessages = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('donor.messages.title', 'Messages')}
        </h1>
        <p className="text-gray-600">
          {t('donor.messages.subtitle', 'Secure communication with verified recipients and coordinators')}
        </p>
      </div>

      <Card>
        <EmptyState
          icon={FaComments}
          title={t('donor.messages.emptyTitle', 'No messages yet')}
          message={t('donor.messages.emptyDesc', 'When a request is matched, you can communicate securely here.')}
          action={
            <Link
              to="/donor/requests"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              {t('donor.messages.viewRequests', 'Browse Requests')}
            </Link>
          }
        />
      </Card>
    </div>
  );
};

export default DonorMessages;

