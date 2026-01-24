import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import FormField from '../../components/FormField';
import { aidService } from '../../services/aidService';
import { useToast } from '../../hooks/useToast';
import { BYPASS_VERIFICATION } from '../../config/dev';
import {
  FaUtensils,
  FaTshirt,
  FaHeartbeat,
  FaDollarSign,
  FaBook,
  FaHome,
  FaCog,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTruck,
  FaSpinner,
  FaCheckCircle,
} from 'react-icons/fa';

const CreateAidOffer = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [aidTypes, setAidTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    aidTypeId: '',
    title: '',
    description: '',
    quantity: '',
    unit: '',
    amount: '',
    availableFrom: '',
    availableUntil: '',
    expiresAt: '',
    location: '',
    canDeliver: false,
    deliveryRadius: '',
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

    // Auto-set expiry if perishable type selected
    if (name === 'aidTypeId') {
      const selectedType = aidTypes.find(t => t.id === value);
      if (selectedType?.isPerishable) {
        // Set expiry to 3 days from now by default
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3);
        setFormData(prev => ({
          ...prev,
          expiresAt: expiryDate.toISOString().slice(0, 16),
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
    
    const selectedType = aidTypes.find(t => t.id === formData.aidTypeId);
    if (selectedType?.category === 'CASH') {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Amount is required for cash offers';
      }
    } else {
      if (!formData.quantity || parseInt(formData.quantity) <= 0) {
        newErrors.quantity = 'Quantity is required';
      }
    }

    if (selectedType?.isPerishable && !formData.expiresAt) {
      newErrors.expiresAt = 'Expiry date is required for perishable items';
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
      showToast('Your account must be verified before creating offers. Please complete verification first.', 'error');
      navigate('/verify-account');
      return;
    }

    setSubmitting(true);

    try {
      const selectedType = aidTypes.find(t => t.id === formData.aidTypeId);
      
      const offerData = {
        aidTypeId: formData.aidTypeId,
        aidTypeCode: selectedType?.code,
        title: formData.title,
        description: formData.description,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        unit: formData.unit || null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        availableFrom: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : null,
        availableUntil: formData.availableUntil ? new Date(formData.availableUntil).toISOString() : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        location: formData.location || null,
        canDeliver: formData.canDeliver,
        deliveryRadius: formData.deliveryRadius ? parseInt(formData.deliveryRadius) : null,
      };

      const response = await aidService.createOffer(offerData);

      if (response.success) {
        showToast('Aid offer created successfully! It will be visible to aid seekers.', 'success');
        navigate('/aid-provider/offers');
      } else {
        throw new Error(response.message || 'Failed to create offer');
      }
    } catch (error) {
      showToast(error.message || 'Failed to create aid offer. Please try again.', 'error');
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

  const selectedType = aidTypes.find(t => t.id === formData.aidTypeId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-dark mb-2">
            Offer Aid
          </h1>
          <p className="text-gray-600">
            Help those in need by offering food, goods, services, or money.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Aid Type Selection */}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-text-dark mb-6">What are you offering?</h2>

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
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className={`text-xl mr-2 ${
                          formData.aidTypeId === type.id ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <span className="font-semibold text-sm">{type.name}</span>
                      </div>
                      {type.isPerishable && (
                        <span className="text-xs text-orange-600 font-medium">⚠️ Perishable</span>
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
              label="Offer Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="e.g., Fresh vegetables available - 50kg"
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
                placeholder="Describe what you're offering, condition, and any relevant details..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </Card>

          {/* Quantity/Amount */}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-text-dark mb-6">Quantity & Availability</h2>

            {selectedType?.category === 'CASH' ? (
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Amount (ETB)"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  error={errors.amount}
                  required
                  placeholder="e.g., 5000"
                  icon={FaDollarSign}
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  error={errors.quantity}
                  required
                  placeholder="e.g., 50"
                />
                <FormField
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g., kg, pieces, people"
                />
              </div>
            )}

            {/* Availability Window */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Available From"
                name="availableFrom"
                type="datetime-local"
                value={formData.availableFrom}
                onChange={handleChange}
                icon={FaCalendarAlt}
              />
              <FormField
                label="Available Until"
                name="availableUntil"
                type="datetime-local"
                value={formData.availableUntil}
                onChange={handleChange}
                icon={FaCalendarAlt}
              />
            </div>

            {/* Expiry Date for Perishable */}
            {selectedType?.isPerishable && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start">
                  <FaCheckCircle className="text-orange-600 text-xl mr-3 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900 mb-1">Perishable Item</h4>
                    <p className="text-sm text-orange-800 mb-3">
                      This item will expire. Please set an expiry date.
                    </p>
                    <FormField
                      label="Expires At"
                      name="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={handleChange}
                      error={errors.expiresAt}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Location & Delivery */}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-text-dark mb-6">Location & Delivery</h2>

            <FormField
              label="Your Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              icon={FaMapMarkerAlt}
              placeholder="e.g., Addis Ababa, Bole"
            />

            <div className="mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="canDeliver"
                  checked={formData.canDeliver}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <span className="ml-3 text-gray-700">
                  <FaTruck className="inline mr-2" />
                  I can deliver this aid
                </span>
              </label>
            </div>

            {formData.canDeliver && (
              <FormField
                label="Delivery Radius (km)"
                name="deliveryRadius"
                type="number"
                value={formData.deliveryRadius}
                onChange={handleChange}
                placeholder="e.g., 10"
                className="mt-4"
              />
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/aid-provider/dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" />
                  Creating Offer...
                </>
              ) : (
                'Create Offer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAidOffer;

