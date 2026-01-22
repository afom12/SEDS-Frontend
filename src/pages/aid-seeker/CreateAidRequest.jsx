import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import FormField from '../../components/FormField';
import { aidService } from '../../services/aidService';
import { dataService } from '../../services/dataService';
import { useToast } from '../../hooks/useToast';
import { calculateFoodUrgency } from '../../utils/food-urgency';
import { BYPASS_VERIFICATION } from '../../config/dev';
import {
  FaUtensils,
  FaTshirt,
  FaHeartbeat,
  FaDollarSign,
  FaBook,
  FaHome,
  FaCog,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSpinner,
} from 'react-icons/fa';

const CreateAidRequest = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [aidTypes, setAidTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    aidTypeId: '',
    category: 'FOOD',
    quantity: '',
    unit: '',
    urgency: 'MEDIUM',
    neededBy: '',
    expiresAt: '',
    isPerishable: false,
    location: '',
    deliveryMethod: 'PICKUP',
    preferredDeliveryTime: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAidTypes();
  }, []);

  const loadAidTypes = async () => {
    try {
      const response = await aidService.getAidTypes();
      if (response.success) {
        setAidTypes(response.data || []);
      }
    } catch (error) {
      console.error('Error loading aid types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-set perishable if food type selected
    if (name === 'aidTypeId') {
      const selectedType = aidTypes.find(t => t.id === value);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          isPerishable: selectedType.isPerishable || false,
          category: selectedType.category,
        }));
      }
    }

    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.aidTypeId) newErrors.aidTypeId = 'Please select an aid type';
    if (formData.isPerishable && !formData.expiresAt) {
      newErrors.expiresAt = 'Expiry date is required for perishable items';
    }
    if (formData.urgency === 'URGENT' && !formData.neededBy) {
      newErrors.neededBy = 'Deadline is required for urgent requests';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    // Check if user is verified (bypass in dev mode)
    if (!BYPASS_VERIFICATION && !user?.verified) {
      showToast('Your account must be verified before creating requests. Please complete verification first.', 'error');
      navigate('/verify-account');
      return;
    }

    setSubmitting(true);

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        aidTypeId: formData.aidTypeId,
        aidTypeCode: aidTypes.find(t => t.id === formData.aidTypeId)?.code,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        unit: formData.unit || null,
        urgency: formData.urgency,
        neededBy: formData.neededBy ? new Date(formData.neededBy).toISOString() : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        isPerishable: formData.isPerishable,
        location: formData.location || null,
        deliveryMethod: formData.deliveryMethod,
        preferredDeliveryTime: formData.preferredDeliveryTime ? new Date(formData.preferredDeliveryTime).toISOString() : null,
      };

      const response = await dataService.createRequest(requestData);

      if (response.success) {
        showToast('Aid request created successfully! It will be reviewed by admin.', 'success');
        navigate('/aid-seeker/requests');
      } else {
        throw new Error(response.message || 'Failed to create request');
      }
    } catch (error) {
      showToast(error.message || 'Failed to create aid request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-dark mb-2">
            Request Help
          </h1>
          <p className="text-gray-600">
            Tell us what you need. We'll match you with people who can help.
          </p>
        </div>

        {/* Urgency Alert */}
        {formData.urgency === 'URGENT' && (
          <Card className="mb-6 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-600 text-2xl mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Urgent Request</h3>
                <p className="text-sm text-red-800">
                  This request will be prioritized and highlighted to donors. Make sure to set a deadline.
                </p>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-text-dark mb-6">What do you need?</h2>

            {/* Aid Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Aid Type <span className="text-red-500">*</span>
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aidTypes.filter(t => t.isActive).map((type) => {
                  const Icon = getAidTypeIcon(type.category);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'aidTypeId', value: type.id } })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.aidTypeId === type.id
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className={`text-xl mr-2 ${
                          formData.aidTypeId === type.id ? 'text-primary' : 'text-gray-400'
                        }`} />
                        <span className="font-semibold text-sm">{type.name}</span>
                      </div>
                      {type.isPerishable && (
                        <span className="text-xs text-red-600 font-medium">⚠️ Perishable</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.aidTypeId && (
                <p className="text-red-600 text-sm mt-2">{errors.aidTypeId}</p>
              )}
            </div>

            {/* Title */}
            <FormField
              label="Request Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="e.g., Urgent food needed for family of 5"
            />

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your situation and what you need..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Quantity and Unit */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <FormField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 10"
              />
              <FormField
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., kg, pieces, people"
              />
            </div>
          </Card>

          {/* Urgency and Timing */}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-text-dark mb-6">Urgency & Timing</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Urgency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="LOW">Low - Can wait</option>
                  <option value="MEDIUM">Medium - Needed soon</option>
                  <option value="HIGH">High - Needed urgently</option>
                  <option value="URGENT">Urgent - Immediate need</option>
                </select>
              </div>

              {/* Needed By */}
              <FormField
                label="Needed By"
                name="neededBy"
                type="datetime-local"
                value={formData.neededBy}
                onChange={handleChange}
                error={errors.neededBy}
                icon={FaCalendarAlt}
              />
            </div>

            {/* Perishable Food Warning */}
            {formData.isPerishable && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-yellow-600 text-xl mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Perishable Food Item</h4>
                    <p className="text-sm text-yellow-800 mb-3">
                      This item will expire. Please set an expiry date below.
                    </p>
                    <FormField
                      label="Expires At"
                      name="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={handleChange}
                      error={errors.expiresAt}
                      required={formData.isPerishable}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Location and Delivery */}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-text-dark mb-6">Location & Delivery</h2>

            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              icon={FaMapMarkerAlt}
              placeholder="e.g., Addis Ababa, Bole"
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Method
              </label>
              <select
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="PICKUP">I can pick up</option>
                <option value="DELIVERY">Need delivery</option>
                <option value="ORGANIZATION_MANAGED">Organization will coordinate</option>
                <option value="MEETUP">Meet at location</option>
              </select>
            </div>

            {formData.deliveryMethod === 'DELIVERY' && (
              <FormField
                label="Preferred Delivery Time"
                name="preferredDeliveryTime"
                type="datetime-local"
                value={formData.preferredDeliveryTime}
                onChange={handleChange}
                className="mt-4"
              />
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/aid-seeker/dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" />
                  Creating Request...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAidRequest;

