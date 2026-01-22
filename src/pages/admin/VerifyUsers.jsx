import React, { useState, useEffect } from 'react';
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
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaSpinner,
  FaFilter,
  FaEye,
} from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const VerifyUsers = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, VERIFIED, REJECTED
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await dataService.getUsers();
      if (response.success) {
        const allUsers = response.data || [];
        // Filter by verification status
        const filtered = allUsers.filter(user => {
          if (filter === 'PENDING') return !user.verified;
          if (filter === 'VERIFIED') return user.verified;
          return false;
        });
        setUsers(filtered);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, action) => {
    try {
      setVerifying(true);
      
      if (action === 'approve') {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.VERIFY_USER(userId));
        if (response.success) {
          showToast('User verified successfully', 'success');
          await loadUsers();
          setShowModal(false);
          setSelectedUser(null);
        } else {
          throw new Error(response.message || 'Verification failed');
        }
      } else {
        // Reject user - you may need to add this endpoint
        showToast('Reject functionality coming soon', 'info');
      }
    } catch (error) {
      showToast(error.message || 'Failed to verify user', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
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

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          Verify Users
        </h1>
        <p className="text-gray-600">
          Review and verify user accounts. Users must be verified before they can request or provide aid.
        </p>
      </div>

      {/* Filter Tabs */}
      <Card className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              filter === 'PENDING'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Verification ({users.filter(u => !u.verified).length})
          </button>
          <button
            onClick={() => setFilter('VERIFIED')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              filter === 'VERIFIED'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Verified ({users.filter(u => u.verified).length})
          </button>
        </div>
      </Card>

      {/* Users List */}
      {users.length === 0 ? (
        <EmptyState
          icon={FaUser}
          title={`No ${filter === 'PENDING' ? 'Pending' : 'Verified'} Users`}
          message={
            filter === 'PENDING'
              ? "No users are waiting for verification."
              : "No verified users found."
          }
        />
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <Card key={user.id} className="hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <FaUser className="text-primary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-dark">{user.name}</h3>
                      <StatusBadge 
                        status={user.verified ? 'verified' : 'pending'} 
                        size="sm" 
                      />
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded capitalize">
                        {user.role?.toLowerCase() || 'user'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <FaEnvelope className="mr-2" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center">
                          <FaPhone className="mr-2" />
                          {user.phone}
                        </span>
                      )}
                      {user.createdAt && (
                        <span>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {user.documents && user.documents.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaIdCard className="text-gray-400" />
                        <span>{user.documents.length} document(s) uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => openUserModal(user)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </button>
                  {!user.verified && (
                    <>
                      <button
                        onClick={() => handleVerify(user.id, 'approve')}
                        disabled={verifying}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                      >
                        <FaCheckCircle className="mr-2" />
                        Verify
                      </button>
                      <button
                        onClick={() => handleVerify(user.id, 'reject')}
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
          ))}
        </div>
      )}

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          title="User Details"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-text-dark mb-2">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.verified ? 'Verified' : 'Pending'}</p>
              </div>
            </div>

            {selectedUser.documents && selectedUser.documents.length > 0 && (
              <div>
                <h3 className="font-semibold text-text-dark mb-2">Documents</h3>
                <div className="space-y-2">
                  {selectedUser.documents.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <FaIdCard className="text-gray-400 mr-3" />
                        <span className="text-sm">{doc.fileName}</span>
                      </div>
                      {doc.verified && (
                        <span className="text-green-600 text-sm">✓ Verified</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedUser.verified && (
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={() => handleVerify(selectedUser.id, 'approve')}
                  disabled={verifying}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FaCheckCircle className="inline mr-2" />
                  Verify User
                </button>
                <button
                  onClick={() => handleVerify(selectedUser.id, 'reject')}
                  disabled={verifying}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <FaTimesCircle className="inline mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VerifyUsers;

