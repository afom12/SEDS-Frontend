import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { dataService } from '../../services/dataService';
import { FaSearch, FaUser, FaEnvelope, FaCalendarAlt, FaHandHoldingHeart } from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch REAL users from API - NO MOCK DATA
      const result = await dataService.getUsers();

      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError(err.message || 'Failed to load users');
      console.error('User management load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users - computed from REAL data
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role?.toLowerCase() === roleFilter.toLowerCase();
    // Status filter based on verified field (real database field)
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.verified) ||
      (statusFilter === 'pending' && !user.verified);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Compute metrics from REAL data
  const totalUsers = users.length;
  const donors = users.filter(u => u.role === 'DONOR' || u.role?.toLowerCase() === 'donor').length;
  const receivers = users.filter(u => u.role === 'RECEIVER' || u.role?.toLowerCase() === 'receiver').length;
  const activeUsers = users.filter(u => u.verified).length;

  const getRoleIcon = (role) => {
    const roleLower = role?.toLowerCase();
    switch (roleLower) {
      case 'admin':
        return '👤';
      case 'donor':
        return '💝';
      case 'receiver':
        return '🙏';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">User Management</h1>
          <p className="text-gray-600">Manage platform users and their accounts</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">User Management</h1>
        <p className="text-gray-600">Manage platform users and their accounts</p>
      </div>

      {/* Summary Cards - ALL FROM REAL DATABASE DATA */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              {/* Real count from users table */}
              <p className="text-2xl font-bold text-text-dark">{totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Donors</p>
              {/* Real count from users table where role = DONOR */}
              <p className="text-2xl font-bold text-text-dark">{donors}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Receivers</p>
              {/* Real count from users table where role = RECEIVER */}
              <p className="text-2xl font-bold text-text-dark">{receivers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaUser className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified Users</p>
              {/* Real count from users table where verified = true */}
              <p className="text-2xl font-bold text-text-dark">{activeUsers}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Roles</option>
            <option value="donor">Donors</option>
            <option value="receiver">Receivers</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Verified</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </Card>

      {/* Users List - REAL DATA */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={FaUser}
          title="No Users Found"
          message={searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
            ? "No users match your filters. Try adjusting your search criteria."
            : "No users found in the system. Users will appear here once they register."}
        />
      ) : (
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-4 text-2xl">
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-text-dark">{user.name}</h3>
                      <StatusBadge 
                        status={user.verified ? 'verified' : 'pending'} 
                        size="sm" 
                      />
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
                        {user.role?.toLowerCase() || 'user'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FaEnvelope className="mr-2" />
                        {user.email}
                      </span>
                      {user.createdAt && (
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-2" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {user._count && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        {user.role?.toLowerCase() === 'donor' && user._count.donations !== undefined && (
                          <span>{user._count.donations} donations</span>
                        )}
                        {user.role?.toLowerCase() === 'receiver' && user._count.requests !== undefined && (
                          <span>{user._count.requests} requests</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
