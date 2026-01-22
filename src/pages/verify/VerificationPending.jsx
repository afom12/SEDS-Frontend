import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import { FaClock, FaCheckCircle, FaTimesCircle, FaUpload, FaIdCard, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';
import { API_CONFIG } from '../../config/api';
import { useToast } from '../../hooks/useToast';

const VerificationPending = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [verificationStatus, setVerificationStatus] = useState('PENDING');
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = location.state?.userId || user?.id;
  const userEmail = location.state?.email || user?.email;
  const userRole = location.state?.role || user?.role?.toLowerCase();

  useEffect(() => {
    if (userId || user?.id) {
      checkVerificationStatus();
    } else {
      // If no user ID, redirect to login
      navigate('/login');
    }
  }, [userId, user?.id]);

  const checkVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.USERS.BY_ID(userId)}`);
      
      if (response.success && response.data) {
        setVerificationStatus(response.data.verified ? 'VERIFIED' : 'PENDING');
        
        // Check if user has documents
        if (response.data.documents) {
          setDocuments(response.data.documents);
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid file type. Please upload JPG, PNG, or PDF.', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size too large. Maximum 5MB.', 'error');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'ID_CARD');
      formData.append('userId', userId);

      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.DOCUMENTS.UPLOAD,
        formData
      );

      if (response.success) {
        showToast('Document uploaded successfully!', 'success');
        await checkVerificationStatus();
      }
    } catch (error) {
      showToast(error.message || 'Failed to upload document.', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'VERIFIED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-4">
            Account Verified! ✅
          </h1>
          <p className="text-gray-600 mb-8">
            Your account has been verified. You can now use all platform features.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Status Header */}
        <Card className="mb-6 border-l-4 border-yellow-500">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <FaClock className="text-yellow-600 text-2xl" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-dark mb-2">
                Verification Pending
              </h1>
              <p className="text-gray-600 mb-4">
                Your account is currently <strong>Unverified</strong>. Complete the steps below to get verified.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> You cannot request or provide aid until your account is verified.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Verification Steps */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-text-dark mb-6">Verification Steps</h2>
          
          <div className="space-y-6">
            {/* Step 1: Complete Profile */}
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                user ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {user ? '✓' : '1'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-dark mb-1">Complete Your Profile</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Add your personal information and contact details.
                </p>
                {!user && (
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Complete Profile →
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: Upload Documents */}
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                documents.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {documents.length > 0 ? '✓' : '2'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-dark mb-1">Upload Identification</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a valid ID card, passport, or recommendation letter from a trusted organization.
                </p>
                
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FaFileAlt className="text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700">{doc.fileName}</span>
                        {doc.verified && (
                          <span className="ml-auto text-green-600 text-sm">✓ Verified</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-dark transition-colors">
                      <FaUpload className="mr-2" />
                      Upload Document
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {uploading && (
                      <span className="ml-4 text-gray-600 text-sm">
                        <FaSpinner className="animate-spin inline mr-2" />
                        Uploading...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Wait for Review */}
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-dark mb-1">Wait for Review</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our admin team or trusted organizations will review your profile and documents.
                  This usually takes 24-48 hours.
                </p>
                {verificationStatus === 'PENDING' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Status:</strong> Pending Verification
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      You'll receive an email notification once your account is verified.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Role-Specific Information */}
        <Card>
          <h2 className="text-xl font-semibold text-text-dark mb-4">What Happens After Verification?</h2>
          
          {userRole === 'aid_seeker' && (
            <div className="space-y-3">
              <p className="text-gray-700">
                Once verified, you'll be able to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Create aid requests for food, clothing, medical assistance, etc.</li>
                <li>Set urgency levels and deadlines for your requests</li>
                <li>Receive matched aid offers from donors</li>
                <li>Track delivery status and confirm receipt</li>
                <li>View your request history</li>
              </ul>
            </div>
          )}

          {userRole === 'aid_provider' && (
            <div className="space-y-3">
              <p className="text-gray-700">
                Once verified, you'll be able to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Browse urgent aid requests</li>
                <li>Create aid offers (food, goods, services, money)</li>
                <li>Match your offers to requests</li>
                <li>Schedule and track deliveries</li>
                <li>See the impact of your contributions</li>
              </ul>
            </div>
          )}

          {userRole === 'organization' && (
            <div className="space-y-3">
              <p className="text-gray-700">
                Once verified, your organization will be able to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Verify aid seekers and requests</li>
                <li>Manage organization members</li>
                <li>Coordinate aid distributions</li>
                <li>View organization-specific analytics</li>
                <li>Get verified badge on your profile</li>
              </ul>
            </div>
          )}
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-blue-50">
          <div className="flex items-start">
            <FaIdCard className="text-blue-600 text-xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-800">
                If you have questions about verification or need assistance, please contact our support team.
              </p>
              <button className="mt-3 text-blue-700 hover:underline text-sm font-medium">
                Contact Support →
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPending;

