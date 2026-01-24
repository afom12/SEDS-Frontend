import React, { useState } from 'react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Alert from '../../components/Alert';
import { mockDonationRequests } from '../../data/mockData';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaEye, FaFileAlt } from 'react-icons/fa';

const ReviewRequests = () => {
  const [requests, setRequests] = useState(mockDonationRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pendingRequests = requests.filter(r => 
    r.status === 'submitted' || r.status === 'under_verification'
  );

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (requestId) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'approved', verified: true, verifiedAt: new Date().toISOString() } : r
    ));
    setShowApproveDialog(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReject = (requestId) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' } : r
    ));
    setShowRejectDialog(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Review Requests</h1>
        <p className="text-gray-600">Verify and approve donation requests</p>
      </div>

      {showSuccess && (
        <Alert
          type="success"
          message="Request status updated successfully!"
          onClose={() => setShowSuccess(false)}
          className="mb-6"
        />
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <FaFileAlt className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-text-dark">{pendingRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-text-dark">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-text-dark">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-text-dark">{requests.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_verification">Under Verification</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Requests Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Request</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-text-dark">{request.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{request.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{request.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-text-dark">${request.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={request.status} size="sm" />
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {request.status !== 'approved' && request.status !== 'rejected' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowApproveDialog(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRejectDialog(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDetailsModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-text-dark mb-4">{selectedRequest.title}</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-600">{selectedRequest.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Category</h3>
                    <p className="text-gray-600">{selectedRequest.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Amount</h3>
                    <p className="text-gray-600">${selectedRequest.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
                    <p className="text-gray-600">{selectedRequest.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Urgency</h3>
                    <p className="text-gray-600 capitalize">{selectedRequest.urgency}</p>
                  </div>
                </div>
                {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Documents</h3>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <FaFileAlt className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowDetailsModal(false)} className="btn-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Dialog */}
      <ConfirmationDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={() => handleApprove(selectedRequest?.id)}
        title="Approve Request"
        message={`Are you sure you want to approve "${selectedRequest?.title}"? This will make it visible to donors.`}
        confirmText="Approve"
        type="info"
      />

      {/* Reject Dialog */}
      <ConfirmationDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={() => handleReject(selectedRequest?.id)}
        title="Reject Request"
        message={`Are you sure you want to reject "${selectedRequest?.title}"? This action cannot be undone.`}
        confirmText="Reject"
        type="danger"
      />
    </div>
  );
};

export default ReviewRequests;

