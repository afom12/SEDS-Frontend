import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'Ethiopia',
    householdSize: '',
    householdIncome: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      country: 'Ethiopia',
      householdSize: '',
      householdIncome: '',
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-dark mb-2">{t('receiver.profile.title')}</h1>
            <p className="text-gray-600">{t('receiver.profile.subtitle')}</p>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-outline">
              <FaEdit className="inline mr-2" />
              {t('receiver.profile.editProfile')}
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="btn-outline">
                <FaTimes className="inline mr-2" />
                {t('common.cancel')}
              </button>
              <button onClick={handleSave} className="btn-primary">
                <FaSave className="inline mr-2" />
                {t('receiver.profile.saveChanges')}
              </button>
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <Alert
          type="success"
          message={t('receiver.profile.successMessage')}
          onClose={() => setShowSuccess(false)}
          className="mb-6"
        />
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <h2 className="text-xl font-semibold text-text-dark mb-6">{t('receiver.profile.personalInfo')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('receiver.profile.fullName')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <FaUser className="mr-2 text-gray-400" />
                  {formData.name || t('receiver.profile.notProvided')}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('receiver.profile.emailAddress')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  {formData.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('receiver.profile.phoneNumber')}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('receiver.profile.phonePlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="text-gray-900">
                  {formData.phone || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Address Information */}
        <Card>
          <h2 className="text-xl font-semibold text-text-dark mb-6">{t('receiver.profile.addressInfo')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Street Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  {formData.address || 'Not provided'}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-gray-900">
                    {formData.city || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-gray-900">
                    {formData.country}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Household Information */}
        <Card className="md:col-span-2">
          <h2 className="text-xl font-semibold text-text-dark mb-6">{t('receiver.profile.householdInfo')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Household Size
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="householdSize"
                  value={formData.householdSize}
                  onChange={handleChange}
                  min="1"
                  placeholder="Number of people"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="text-gray-900">
                  {formData.householdSize ? `${formData.householdSize} people` : 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Household Income (ETB)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="householdIncome"
                  value={formData.householdIncome}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="text-gray-900">
                  {formData.householdIncome ? `ETB ${parseFloat(formData.householdIncome).toLocaleString()}` : 'Not provided'}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This information helps us verify requests and is kept confidential.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

