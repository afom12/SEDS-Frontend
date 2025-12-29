import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { RequestCardSkeleton } from '../../components/LoadingSkeleton';
import { dataService } from '../../services/dataService';
import { FaSearch, FaFilter, FaHandHoldingHeart, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const BrowseRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const categories = ['all', 'Medical', 'Education', 'Food', 'Clothing', 'Housing', 'Transportation'];
  const urgencyLevels = ['all', 'high', 'medium', 'low'];

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const result = await dataService.getDonationRequests();
      if (result.success) {
        setRequests(result.data);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'all' || request.urgency === selectedUrgency;
    const isApproved = request.status === 'approved';

    return matchesSearch && matchesCategory && matchesUrgency && isApproved;
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <RequestCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Browse Requests</h1>
        <p className="text-gray-600">Find verified requests that need your support</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
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
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              {urgencyLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Urgency' : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-text-dark">{filteredRequests.length}</span> verified request{filteredRequests.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={FaHandHoldingHeart}
          title="No requests found"
          message="Try adjusting your filters to see more requests."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => (
            <Card key={request.id} className="hover:shadow-xl transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-text-dark flex-1 pr-2">
                  {request.title}
                </h3>
                <StatusBadge status={request.status} size="sm" />
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {request.description}
              </p>

              {/* Category and Urgency */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium text-primary bg-primary bg-opacity-10 px-2 py-1 rounded">
                  {request.category}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getUrgencyColor(request.urgency)}`}>
                  <FaClock className="inline mr-1" />
                  {request.urgency} urgency
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <FaMapMarkerAlt className="mr-2" />
                {request.location}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-text-dark">{request.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all"
                    style={{ width: `${request.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${request.currentAmount.toLocaleString()}</span>
                  <span>${request.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Donor Count */}
              <div className="text-sm text-gray-600 mb-4">
                <FaHandHoldingHeart className="inline mr-1 text-secondary" />
                {request.donorCount} donor{request.donorCount !== 1 ? 's' : ''} contributed
              </div>

              {/* Action Button */}
              <Link
                to={`/donor/requests/${request.id}`}
                className="block w-full btn-secondary text-center"
              >
                View Details & Donate
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseRequests;

