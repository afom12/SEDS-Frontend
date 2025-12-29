import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Alert from '../../components/Alert';
import { mockDonationRequests } from '../../data/mockData';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaClock, 
  FaHandHoldingHeart, 
  FaFileAlt,
  FaCheckCircle,
  FaUser,
  FaLock
} from 'react-icons/fa';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const request = mockDonationRequests.find(r => r.id === id);

  if (!request) {
    return (
      <div className="p-8">
        <Alert type="error" message="Request not found" />
        <Link to="/donor/requests" className="btn-primary mt-4 inline-block">
          Back to Requests
        </Link>
      </div>
    );
  }

  const remainingAmount = request.amount - request.currentAmount;
  const suggestedAmounts = [50, 100, 200, 500];

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowDonateDialog(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/donor/history');
      }, 2000);
    }, 1500);
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
        Back to Requests
      </Link>

      {showSuccess && (
        <Alert
          type="success"
          message="Donation submitted successfully! Redirecting to your donation history..."
          onClose={() => setShowSuccess(false)}
          className="mb-6"
        />
      )}

      <div className="grid lg:grid-cols-3 gap-6">
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
                    Posted {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Urgency Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-lg border ${getUrgencyColor(request.urgency)} mb-4`}>
              <FaClock className="mr-2" />
              <span className="font-medium capitalize">{request.urgency} Urgency</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-dark mb-3">About This Request</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {request.description}
              </p>
            </div>

            {/* Category */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
              <span className="inline-block px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-lg font-medium">
                {request.category}
              </span>
            </div>

            {/* Documents */}
            {request.documents && request.documents.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Supporting Documents</h3>
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
            <h2 className="text-xl font-semibold text-text-dark mb-4">Funding Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Raised</span>
                <span className="font-bold text-text-dark">
                  ${request.currentAmount.toLocaleString()} of ${request.amount.toLocaleString()}
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
                <p className="text-xs text-gray-600">Complete</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-dark">{request.donorCount}</p>
                <p className="text-xs text-gray-600">Donors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-dark">${remainingAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Remaining</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Donation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-semibold text-text-dark mb-4">Make a Donation</h2>

            {/* Suggested Amounts */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Quick Select</p>
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
                Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="1"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
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
                  Donate anonymously
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Your name will not be visible to the receiver
              </p>
            </div>

            {/* Donate Button */}
            <button
              onClick={() => setShowDonateDialog(true)}
              disabled={!donationAmount || parseFloat(donationAmount) <= 0}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaHandHoldingHeart className="inline mr-2" />
              Donate ${donationAmount || '0'}
            </button>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <FaCheckCircle className="inline mr-1" />
                This request has been verified by our admin team
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
        title="Confirm Donation"
        message={`Are you sure you want to donate $${donationAmount}${isAnonymous ? ' anonymously' : ''} to "${request.title}"?`}
        confirmText={loading ? 'Processing...' : 'Confirm Donation'}
        type="info"
      />
    </div>
  );
};

export default RequestDetails;

