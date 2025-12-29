import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import Stepper from '../../components/Stepper';
import { useToastContext } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { FaFileUpload, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const SubmitRequest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    amount: '',
    urgency: 'medium',
    location: '',
    documents: [],
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { label: t('receiver.submitRequest.basicInfo'), description: t('receiver.submitRequest.basicInfoDesc') },
    { label: t('receiver.submitRequest.categoryAmount'), description: t('receiver.submitRequest.categoryAmountDesc') },
    { label: t('receiver.submitRequest.additionalInfo'), description: t('receiver.submitRequest.additionalInfoDesc') },
    { label: t('receiver.submitRequest.documents'), description: t('receiver.submitRequest.documentsDesc') },
    { label: t('receiver.submitRequest.review'), description: t('receiver.submitRequest.reviewDesc') },
  ];

  const categories = ['Medical', 'Education', 'Food', 'Clothing', 'Housing', 'Transportation'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.description.length < 50) {
        newErrors.description = 'Description must be at least 50 characters';
      }
    } else if (step === 1) {
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.amount) newErrors.amount = 'Amount is required';
      if (formData.amount && parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
    } else if (step === 2) {
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files.map(f => f.name)],
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.warning('Please complete all required fields');
      return;
    }

    setLoading(true);
    const result = await dataService.submitRequest(formData);
    setLoading(false);

    if (result.success) {
      toast.success('Request submitted successfully! It will be reviewed by our admin team.');
      setTimeout(() => {
        navigate('/receiver/status');
      }, 2000);
    } else {
      toast.error(result.error || 'Failed to submit request. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('receiver.submitRequest.requestTitle')} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('receiver.submitRequest.titlePlaceholder')}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.title ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('receiver.submitRequest.description')} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder={t('receiver.submitRequest.descriptionPlaceholder')}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.description.length}/50 {t('receiver.submitRequest.minimumChars')}
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
                  errors.category ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">{t('receiver.submitRequest.selectCategory')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('receiver.submitRequest.requestedAmount')} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder={t('receiver.submitRequest.enterAmount')}
                  min="1"
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.amount ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
              <p className="text-gray-500 text-xs mt-1">
                {t('receiver.submitRequest.beRealistic')}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Addis Ababa, Ethiopia"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.location ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                    className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                      formData.urgency === level
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('receiver.submitRequest.supportingDocuments')}
              </label>
              <p className="text-sm text-gray-600 mb-4">
                {t('receiver.submitRequest.documentsNote')}
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <FaFileUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                <label className="cursor-pointer">
                  <span className="text-primary font-medium">{t('receiver.submitRequest.clickToUpload')}</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">{t('receiver.submitRequest.fileTypes')}</p>
              </div>

              {formData.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{doc}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            documents: prev.documents.filter((_, i) => i !== index),
                          }));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        {t('receiver.submitRequest.remove')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Alert
              type="info"
              message={t('receiver.submitRequest.reviewNote')}
            />
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">{t('receiver.submitRequest.titleLabel')}</h3>
                <p className="text-gray-900">{formData.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">{t('receiver.submitRequest.descriptionLabel')}</h3>
                <p className="text-gray-900 whitespace-pre-line">{formData.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">{t('common.category')}</h3>
                  <p className="text-gray-900">{formData.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">{t('common.amount')}</h3>
                  <p className="text-gray-900">${parseFloat(formData.amount).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">{t('common.location')}</h3>
                  <p className="text-gray-900">{formData.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">{t('common.urgency')}</h3>
                  <p className="text-gray-900 capitalize">{t(`common.${formData.urgency}`)}</p>
                </div>
              </div>
              {formData.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">{t('receiver.submitRequest.documents')}</h3>
                  <p className="text-gray-900">{formData.documents.length} {t('receiver.submitRequest.filesUploaded')}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-text-dark mb-2">{t('receiver.submitRequest.title')}</h1>
        <p className="text-gray-600">{t('receiver.submitRequest.subtitle')}</p>
      </div>

      <Card className="animate-fade-in-up">
        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px] mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.back')}
          </button>
          {currentStep < steps.length - 1 ? (
            <button onClick={handleNext} className="btn-primary">
              {t('common.next')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-secondary disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" />
                  {t('common.submitting')}...
                </>
              ) : (
                <>
                  <FaCheckCircle className="inline mr-2" />
                  {t('common.submit')}
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SubmitRequest;

