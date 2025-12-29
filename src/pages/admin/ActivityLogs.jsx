import React, { useState } from 'react';
import Card from '../../components/Card';
import { mockActivityLogs } from '../../data/mockData';
import { FaSearch, FaClock, FaUser, FaFileAlt, FaHandHoldingHeart, FaCheckCircle } from 'react-icons/fa';

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredLogs = mockActivityLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'request_approved':
        return <FaCheckCircle className="text-green-600" />;
      case 'donation_completed':
        return <FaHandHoldingHeart className="text-secondary" />;
      case 'request_submitted':
        return <FaFileAlt className="text-blue-600" />;
      case 'user_registered':
        return <FaUser className="text-primary" />;
      default:
        return <FaFileAlt className="text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'request_approved':
        return 'bg-green-50 border-green-200';
      case 'donation_completed':
        return 'bg-secondary bg-opacity-10 border-secondary border-opacity-30';
      case 'request_submitted':
        return 'bg-blue-50 border-blue-200';
      case 'user_registered':
        return 'bg-primary bg-opacity-10 border-primary border-opacity-30';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Activity Logs</h1>
        <p className="text-gray-600">Track all platform activities and events</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Activities</option>
            <option value="request_approved">Request Approved</option>
            <option value="donation_completed">Donation Completed</option>
            <option value="request_submitted">Request Submitted</option>
            <option value="user_registered">User Registered</option>
          </select>
        </div>
      </Card>

      {/* Activity Logs */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FaFileAlt className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">No activities found</p>
            </div>
          </Card>
        ) : (
          filteredLogs.map(log => (
            <Card key={log.id} className={`border-l-4 ${getActivityColor(log.type)}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4 mt-1">
                  {getActivityIcon(log.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-text-dark">{log.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FaUser className="mr-1" />
                          {log.userName}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-600 capitalize">
                      {log.type.replace('_', ' ')}
                    </span>
                  </div>
                  {log.metadata && (
                    <div className="mt-2 text-xs text-gray-500">
                      {log.metadata.requestId && `Request ID: ${log.metadata.requestId}`}
                      {log.metadata.amount && ` • Amount: $${log.metadata.amount}`}
                      {log.metadata.role && ` • Role: ${log.metadata.role}`}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;

