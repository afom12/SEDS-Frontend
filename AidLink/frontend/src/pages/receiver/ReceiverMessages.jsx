import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { FaComments } from 'react-icons/fa';

const ReceiverMessages = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          {t('receiver.messages.title', 'Messages')}
        </h1>
        <p className="text-gray-600">
          {t('receiver.messages.subtitle', 'Secure communication with donors and coordinators')}
        </p>
      </div>

      <Card>
        <EmptyState
          icon={FaComments}
          title={t('receiver.messages.emptyTitle', 'No messages yet')}
          message={t('receiver.messages.emptyDesc', 'Once your request is matched, you can communicate here.')}
          action={
            <Link
              to="/receiver/status"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              {t('receiver.messages.viewStatus', 'Track Requests')}
            </Link>
          }
        />
      </Card>
    </div>
  );
};

export default ReceiverMessages;

