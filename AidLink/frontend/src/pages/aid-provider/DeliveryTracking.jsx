import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { aidService } from '../../services/aidService';
import { useToast } from '../../hooks/useToast';
import {
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSpinner,
  FaCamera,
  FaExclamationCircle,
} from 'react-icons/fa';
import EmptyState from '../../components/EmptyState';

const DeliveryTracking = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, scheduled, in_transit, delivered, confirmed

  useEffect(() => {
    loadDeliveries();
  }, [filter]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const filters = { providerId: user?.id };
      if (filter !== 'all') {
        filters.status = filter.toUpperCase();
      }

      const response = await aidService.getDeliveries(filters);
      if (response.success) {
        setDeliveries(response.data || []);
      }
    } catch (error) {
      console.error('Error loading deliveries:', error);
      showToast('Failed to load deliveries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      const response = await aidService.updateDeliveryStatus(deliveryId, newStatus);
      if (response.success) {
        showToast('Delivery status updated successfully', 'success');
        await loadDeliveries();
      }
    } catch (error) {
      showToast(error.message || 'Failed to update status', 'error');
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <FaCalendarAlt className="text-blue-600" />;
      case 'IN_TRANSIT':
        return <FaTruck className="text-yellow-600" />;
      case 'DELIVERED':
        return <FaCheckCircle className="text-green-600" />;
      case 'CONFIRMED':
        return <FaCheckCircle className="text-green-600" />;
      case 'FAILED':
        return <FaExclamationCircle className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
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

  const statusCounts = {
    all: deliveries.length,
    scheduled: deliveries.filter(d => d.status === 'SCHEDULED').length,
    in_transit: deliveries.filter(d => d.status === 'IN_TRANSIT').length,
    delivered: deliveries.filter(d => d.status === 'DELIVERED').length,
    confirmed: deliveries.filter(d => d.status === 'CONFIRMED').length,
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          Delivery Tracking
        </h1>
        <p className="text-gray-600">
          Track your aid deliveries and update their status.
        </p>
      </div>

      {/* Status Filter */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'all', label: 'All Deliveries' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'in_transit', label: 'In Transit' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'confirmed', label: 'Confirmed' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === status.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label} ({statusCounts[status.value] || 0})
            </button>
          ))}
        </div>
      </Card>

      {/* Deliveries List */}
      {deliveries.length === 0 ? (
        <EmptyState
          icon={FaTruck}
          title="No Deliveries"
          message="You haven't made any deliveries yet. Create an aid offer to get started."
        />
      ) : (
        <div className="space-y-4">
          {deliveries.map(delivery => (
            <Card key={delivery.id} className="hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getStatusIcon(delivery.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-dark mb-1">
                        {delivery.request?.title || 'Delivery'}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <StatusBadge status={delivery.status} size="sm" />
                        <span className="text-sm text-gray-600">
                          To: {delivery.seeker?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>{delivery.quantity} {delivery.unit || 'units'}</span>
                        {delivery.deliveryLocation && (
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {delivery.deliveryLocation}
                          </span>
                        )}
                        {delivery.scheduledAt && (
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            Scheduled: {formatDate(delivery.scheduledAt)}
                          </span>
                        )}
                        {delivery.deliveredAt && (
                          <span className="text-green-600">
                            Delivered: {formatDate(delivery.deliveredAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {delivery.deliveryNotes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{delivery.deliveryNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:ml-6">
                  {delivery.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleStatusUpdate(delivery.id, 'IN_TRANSIT')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                    >
                      Start Delivery
                    </button>
                  )}
                  {delivery.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => handleStatusUpdate(delivery.id, 'DELIVERED')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {delivery.status === 'DELIVERED' && (
                    <div className="text-sm text-gray-600 text-center">
                      Waiting for confirmation
                    </div>
                  )}
                  {delivery.status === 'CONFIRMED' && (
                    <div className="flex items-center text-green-600 text-sm">
                      <FaCheckCircle className="mr-2" />
                      Confirmed
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;

