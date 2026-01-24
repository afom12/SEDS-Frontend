import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { dataService } from '../../services/dataService';
import { useToast } from '../../hooks/useToast';
import { API_CONFIG } from '../../config/api';
import apiClient from '../../services/apiClient';
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaClock,
  FaMapMarkerAlt,
  FaSpinner,
  FaEye,
  FaUtensils,
} from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const VerifyRequests = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('SUBMITTED'); // SUBMITTED, VERIFIED, REJECTED
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await dataService.getDonationRequests({ 
        status: filter === 'SUBMITTED' ? 'SUBMITTED' : filter,
        requestType: 'aid',
      });
      if (response.success) {
        // Sort: urgent first
        const sorted = (response.data || []).sort((a, b) => {
          if (a.urgency === 'URGENT' && b.urgency !== 'URGENT') return -1;
          if (a.urgency !== 'URGENT' && b.urgency === 'URGENT') return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setRequests(sorted);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      showToast('Failed to load requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setVerifying(true);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.APPROVE_REQUEST(requestId));
      
      if (response.success) {
        showToast('Request approved successfully', 'success');
        await loadRequests();
        setShowModal(false);
        setSelectedRequest(null);
      } else {
        throw new Error(response.message || 'Approval failed');
      }
    } catch (error) {
      showToast(error.message || 'Failed to approve request', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }

    try {
      setVerifying(true);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.REJECT_REQUEST(requestId), {
        reason: rejectReason,
      });
      
      if (response.success) {
        showToast('Request rejected', 'success');
        await loadRequests();
        setShowModal(false);
        setSelectedRequest(null);
        setRejectReason('');
      } else {
        throw new Error(response.message || 'Rejection failed');
      }
    } catch (error) {
      showToast(error.message || 'Failed to reject request', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setRejectReason('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'SUBMITTED').length;
  const urgentCount = requests.filter(r => r.urgency === 'URGENT').length;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          Verify Requests
        </h1>
        <p className="text-gray-600">
          Review and verify aid requests. Urgent requests are prioritized.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-text-dark">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgent Requests</p>
              <p className="text-2xl font-bold text-text-dark">{urgentCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified Today</p>
              <p className="text-2xl font-bold text-text-dark">
                {requests.filter(r => r.verified && new Date(r.verifiedAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('SUBMITTED')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              filter === 'SUBMITTED'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('VERIFIED')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              filter === 'VERIFIED'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Verified ({requests.filter(r => r.status === 'VERIFIED').length})
          </button>
        </div>
      </Card>

      {/* Urgent Alert */}
      {urgentCount > 0 && filter === 'SUBMITTED' && (
        <Card className="mb-6 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                {urgentCount} Urgent Request{urgentCount !== 1 ? 's' : ''} Need Immediate Review
              </h3>
              <p className="text-sm text-red-800">
                These requests are marked as urgent and need immediate attention.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <EmptyState
          icon={FaUtensils}
          title={`No ${filter === 'SUBMITTED' ? 'Pending' : 'Verified'} Requests`}
          message={
            filter === 'SUBMITTED'
              ? "No requests are waiting for verification."
              : "No verified requests found."
          }
        />
      ) : (
        <div className="space-y-4">
          {requests.map(request => {
            const isUrgent = request.urgency === 'URGENT';
            const isPerishable = request.isPerishable;
            const isExpiring = request.expiresAt && new Date(request.expiresAt) < new Date(Date.now() + 24 * 60 * 60 * 1000);

            return (
              <Card
                key={request.id}
                className={`hover:shadow-lg transition-all ${
                  isUrgent ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isUrgent ? 'bg-red-100' : 'bg-primary/10'
                        }`}>
                          <FaUtensils className={`text-xl ${isUrgent ? 'text-red-600' : 'text-primary'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-text-dark mb-1">
                            {request.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={request.status} size="sm" />
                            {isUrgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                URGENT
                              </span>
                            )}
                            {isPerishable && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                                Perishable
                              </span>
                            )}
                            {isExpiring && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                Expiring Soon
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{request.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {request.aidType && (
                        <span className="font-medium">{request.aidType.name}</span>
                      )}
                      {request.quantity && (
                        <span>{request.quantity} {request.unit || 'units'}</span>
                      )}
                      {request.location && (
                        <span className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {request.location}
                        </span>
                      )}
                      {request.neededBy && (
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          Needed by {formatDate(request.neededBy)}
                        </span>
                      )}
                      {request.expiresAt && (
                        <span className="text-red-600">
                          Expires: {formatDate(request.expiresAt)}
                        </span>
                      )}
                    </div>

                    {request.receiver && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Requested by:</strong> {request.receiver.name}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 ml-6">
                    <button
                      onClick={() => openRequestModal(request)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <FaEye className="mr-2" />
                      Review
                    </button>
                    {request.status === 'SUBMITTED' && (
                      <>
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={verifying}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                        >
                          <FaCheckCircle className="mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => openRequestModal(request)}
                          disabled={verifying}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
                        >
                          <FaTimesCircle className="mr-2" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Request Detail Modal */}
      {showModal && selectedRequest && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
            setRejectReason('');
          }}
          title="Request Details"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-text-dark mb-2">{selectedRequest.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{selectedRequest.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Status:</strong> <StatusBadge status={selectedRequest.status} size="sm" />
              </div>
              <div>
                <strong>Urgency:</strong> {selectedRequest.urgency}
              </div>
              {selectedRequest.aidType && (
                <div>
                  <strong>Aid Type:</strong> {selectedRequest.aidType.name}
                </div>
              )}
              {selectedRequest.quantity && (
                <div>
                  <strong>Quantity:</strong> {selectedRequest.quantity} {selectedRequest.unit}
                </div>
              )}
              {selectedRequest.location && (
                <div>
                  <strong>Location:</strong> {selectedRequest.location}
                </div>
              )}
              {selectedRequest.neededBy && (
                <div>
                  <strong>Needed By:</strong> {formatDate(selectedRequest.neededBy)}
                </div>
              )}
              {selectedRequest.expiresAt && (
                <div>
                  <strong>Expires:</strong> {formatDate(selectedRequest.expiresAt)}
                </div>
              )}
            </div>

            {selectedRequest.receiver && (
              <div className="pt-4 border-t">
                <strong>Requested by:</strong> {selectedRequest.receiver.name} ({selectedRequest.receiver.email})
              </div>
            )}

            {selectedRequest.status === 'SUBMITTED' && (
              <div className="pt-4 border-t space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Provide a reason for rejection..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={verifying}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FaCheckCircle className="inline mr-2" />
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={verifying || !rejectReason.trim()}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <FaTimesCircle className="inline mr-2" />
                    Reject Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VerifyRequests;

