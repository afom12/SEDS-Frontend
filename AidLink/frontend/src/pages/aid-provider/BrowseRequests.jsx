import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { dataService } from '../../services/dataService';
import { aidService } from '../../services/aidService';
import { useToast } from '../../hooks/useToast';
import {
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaClock,
  FaMapMarkerAlt,
  FaHandHoldingHeart,
  FaSpinner,
  FaUtensils,
  FaTshirt,
  FaHeartbeat,
  FaDollarSign,
  FaBook,
  FaHome,
  FaCog,
} from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';

const BrowseRequests = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    aidTypeId: '',
    urgency: '',
    location: '',
    urgent: false,
  });
  const [aidTypes, setAidTypes] = useState([]);

  useEffect(() => {
    loadAidTypes();
    loadRequests();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const loadAidTypes = async () => {
    try {
      const response = await aidService.getAidTypes();
      if (response.success) {
        setAidTypes(response.data || []);
      }
    } catch (error) {
      console.error('Error loading aid types:', error);
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const queryParams = {
        requestType: 'aid',
        verified: 'true',
        status: 'VERIFIED',
        ...filters,
      };

      const response = await dataService.getDonationRequests(queryParams);
      if (response.success) {
        // Sort: urgent first, then by date
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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMatchRequest = async (requestId) => {
    try {
      // Get matching offers for this request
      const matchesResponse = await aidService.getMatchingOffers(requestId);
      if (matchesResponse.success && matchesResponse.data?.length > 0) {
        showToast(`Found ${matchesResponse.data.length} matching offers. Check your offers to match.`, 'info');
      } else {
        showToast('No matching offers found. Create an offer first.', 'info');
      }
    } catch (error) {
      showToast('Error checking matches', 'error');
    }
  };

  const getAidTypeIcon = (category) => {
    const icons = {
      FOOD: FaUtensils,
      CLOTHING: FaTshirt,
      MEDICAL: FaHeartbeat,
      CASH: FaDollarSign,
      EDUCATION: FaBook,
      SHELTER: FaHome,
      SERVICES: FaCog,
      OTHER: FaCog,
    };
    return icons[category] || FaCog;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredRequests = requests.filter(request => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!request.title?.toLowerCase().includes(searchLower) &&
          !request.description?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.aidTypeId && request.aidTypeId !== filters.aidTypeId) return false;
    if (filters.urgency && request.urgency !== filters.urgency) return false;
    if (filters.urgent && request.urgency !== 'URGENT') return false;
    return true;
  });

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
          Browse Aid Requests
        </h1>
        <p className="text-gray-600">
          Find requests you can help with. Urgent requests are highlighted.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <select
            value={filters.aidTypeId}
            onChange={(e) => handleFilterChange('aidTypeId', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">All Aid Types</option>
            {aidTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>

          <select
            value={filters.urgency}
            onChange={(e) => handleFilterChange('urgency', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">All Urgency Levels</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.urgent}
              onChange={(e) => handleFilterChange('urgent', e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <span className="ml-2 text-gray-700">Urgent Only</span>
          </label>
        </div>
      </Card>

      {/* Urgent Requests Alert */}
      {filters.urgent && filteredRequests.length > 0 && (
        <Card className="mb-6 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                {filteredRequests.length} Urgent Request{filteredRequests.length !== 1 ? 's' : ''} Need Immediate Help
              </h3>
              <p className="text-sm text-red-800">
                These requests need urgent attention. Please help if you can.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={FaHandHoldingHeart}
          title="No Requests Found"
          message={filters.search || filters.aidTypeId || filters.urgency || filters.urgent
            ? "No requests match your filters. Try adjusting your search criteria."
            : "No verified requests available at the moment. Check back later."}
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(request => {
            const AidIcon = request.aidType ? getAidTypeIcon(request.aidType.category) : FaHandHoldingHeart;
            const isUrgent = request.urgency === 'URGENT';
            const isExpiring = request.expiresAt && new Date(request.expiresAt) < new Date(Date.now() + 24 * 60 * 60 * 1000);

            return (
              <Card
                key={request.id}
                className={`hover:shadow-lg transition-all ${
                  isUrgent ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isUrgent ? 'bg-red-100' : 'bg-primary/10'
                        }`}>
                          <AidIcon className={`text-xl ${isUrgent ? 'text-red-600' : 'text-primary'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-text-dark mb-1">
                            {request.title}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            <StatusBadge status={request.status} size="sm" />
                            {isUrgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                URGENT
                              </span>
                            )}
                            {isExpiring && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
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
                  </div>

                  <div className="flex flex-col md:items-end md:ml-6 gap-3">
                    <Link
                      to={`/aid-provider/requests/${request.id}`}
                      className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleMatchRequest(request.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Match Offer
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseRequests;

