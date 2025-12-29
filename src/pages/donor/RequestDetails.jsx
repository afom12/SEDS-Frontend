import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { RequestCardSkeleton } from '../../components/LoadingSkeleton';
import { useToastContext } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaClock, 
  FaHandHoldingHeart, 
  FaFileAlt,
  FaCheckCircle,
  FaUser,
  FaLock,
  FaSpinner
} from 'react-icons/fa';

const RequestDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToastContext();
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoadingRequest(true);
      const result = await dataService.getRequestById(id);
      if (result.success) {
        setRequest(result.data);
      } else {
        toast.error(result.error || 'Request not found');
      }
      setLoadingRequest(false);
    };
    fetchRequest();
  }, [id, toast]);

  if (loadingRequest) {
    return (
      <div className="p-6 md:p-8">
        <RequestCardSkeleton />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8">
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-text-dark mb-4">{t('donor.requestDetails.requestNotFound')}</h2>
          <p className="text-gray-600 mb-6">{t('donor.requestDetails.requestNotFoundDesc')}</p>
          <Link to="/donor/requests" className="btn-primary inline-block">
            {t('donor.requestDetails.backToRequests')}
          </Link>
        </div>
      </div>
    );
  }

  const remainingAmount = request.amount - request.currentAmount;
  const suggestedAmounts = [50, 100, 200, 500];

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.warning(t('donor.requestDetails.validAmount'));
      return;
    }

    const amount = parseFloat(donationAmount);
    if (amount > remainingAmount) {
      toast.warning(t('donor.requestDetails.maxAmount', { amount: remainingAmount.toLocaleString() }));
      return;
    }

    setLoading(true);
    const result = await dataService.createDonation({
      requestId: request.id,
      requestTitle: request.title,
      amount: amount,
      anonymous: isAnonymous,
      donorName: isAnonymous ? t('common.anonymous') : user?.name || t('common.anonymous'),
    });

    setLoading(false);
    setShowDonateDialog(false);

    if (result.success) {
      toast.success(t('donor.requestDetails.donationSuccess', { amount: amount.toLocaleString() }));
      // Update local request state
      setRequest({
        ...request,
        currentAmount: request.currentAmount + amount,
        progress: Math.min(100, Math.round(((request.currentAmount + amount) / request.amount) * 100)),
        donorCount: request.donorCount + 1,
      });
      setDonationAmount('');
      setTimeout(() => {
        navigate('/donor/history');
      }, 2000);
    } else {
      toast.error(result.error || t('donor.requestDetails.donationError'));
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Back Button */}
      <Link
        to="/donor/requests"
        className="inline-flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <FaArrowLeft className="mr-2" />
        {t('donor.requestDetails.backToRequests')}
      </Link>

      <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-text-dark">{request.title}</h1>
                  <StatusBadge status={request.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {request.location}
                  </span>
                  <span className="flex items-center">
                    <FaClock className="mr-2" />
                    {t('donor.requestDetails.posted')} {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Urgency Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-lg border ${getUrgencyColor(request.urgency)} mb-4`}>
              <FaClock className="mr-2" />
              <span className="font-medium capitalize">{t(`common.${request.urgency}`)} {t('donor.requestDetails.urgency')}</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-dark mb-3">{t('donor.requestDetails.aboutRequest')}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {request.description}
              </p>
            </div>

            {/* Category */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('common.category')}</h3>
              <span className="inline-block px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-lg font-medium">
                {request.category}
              </span>
            </div>

            {/* Documents */}
            {request.documents && request.documents.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('donor.requestDetails.supportingDocuments')}</h3>
                <div className="space-y-2">
                  {request.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <FaFileAlt className="text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">{doc}</span>
                      <span className="ml-auto text-xs text-gray-500">Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Progress Card */}
          <Card>
            <h2 className="text-xl font-semibold text-text-dark mb-4">{t('donor.requestDetails.fundingProgress')}</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{t('donor.requestDetails.raised')}</span>
                <span className="font-bold text-text-dark">
                  ${request.currentAmount.toLocaleString()} {t('common.of')} ${request.amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-secondary h-4 rounded-full transition-all"
                  style={{ width: `${request.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-dark">{request.progress}%</p>
                <p className="text-xs text-gray-600">{t('donor.requestDetails.complete')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-dark">{request.donorCount}</p>
                <p className="text-xs text-gray-600">{t('donor.requestDetails.donors')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-dark">${remainingAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-600">{t('common.remaining')}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Donation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-semibold text-text-dark mb-4">{t('donor.requestDetails.makeDonation')}</h2>

            {/* Suggested Amounts */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{t('donor.requestDetails.quickSelect')}</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount.toString())}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      donationAmount === amount.toString()
                        ? 'border-secondary bg-secondary bg-opacity-10 text-secondary'
                        : 'border-gray-200 hover:border-primary text-gray-700'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('donor.requestDetails.customAmount')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="1"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder={t('donor.requestDetails.enterAmount')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Anonymous Option */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <FaLock className="mr-1 text-gray-400" />
                  {t('donor.requestDetails.donateAnonymously')}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                {t('donor.requestDetails.anonymousNote')}
              </p>
            </div>

            {/* Donate Button */}
            <button
              onClick={() => setShowDonateDialog(true)}
              disabled={!donationAmount || parseFloat(donationAmount) <= 0 || loading}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="inline mr-2 animate-spin" />
                  {t('donor.requestDetails.processing')}
                </>
              ) : (
                <>
                  <FaHandHoldingHeart className="inline mr-2" />
                  {t('donor.requestDetails.donate')} ${donationAmount || '0'}
                </>
              )}
            </button>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <FaCheckCircle className="inline mr-1" />
                {t('donor.requestDetails.verifiedNote')}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDonateDialog}
        onClose={() => setShowDonateDialog(false)}
        onConfirm={handleDonate}
        title={t('donor.requestDetails.confirmDonation')}
        message={t('donor.requestDetails.confirmMessage', { 
          amount: donationAmount, 
          anonymous: isAnonymous ? ' ' + t('common.anonymous').toLowerCase() : '',
          title: request.title 
        })}
        confirmText={loading ? t('donor.requestDetails.processing') : t('donor.requestDetails.confirmDonation')}
        type="info"
      />
    </div>
  );
};

export default RequestDetails;

