import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import FormField from '../../components/FormField';
import { FaUser, FaEnvelope, FaLock, FaShieldAlt, FaHandHoldingHeart, FaUsers, FaBuilding } from 'react-icons/fa';
import { useToast } from '../../hooks/useToast';

const RegisterWithVerification = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Basic Info, 2: Role Selection, 3: Verification Info
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: '',
    organizationName: '',
    organizationType: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!formData.role) {
      setErrors({ role: 'Please select a role' });
      return false;
    }
    return true;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    if (!formData.agreeToTerms) {
      showToast('Please accept the Terms of Service and Privacy Policy', 'error');
      return;
    }
    
    setLoading(true);

    try {
      console.log('Attempting registration with:', {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        hasPassword: !!formData.password,
      });
      
      // Register user
      const userData = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role.toUpperCase()
      );

      console.log('Registration successful, user data:', userData);

      if (userData) {
        // Check if user is verified
        if (userData.verified) {
          // User is auto-verified (e.g., DONOR)
          showToast('Registration successful! Your account is verified.', 'success');
          
          // Redirect to appropriate dashboard based on role
          const role = userData.role?.toLowerCase();
          if (role === 'aid_seeker' || role === 'receiver') {
            navigate('/aid-seeker/dashboard', { replace: true });
          } else if (role === 'aid_provider' || role === 'donor') {
            navigate('/aid-provider/dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          // User needs verification
          showToast('Registration successful! Please complete verification to access all features.', 'success');
          
          // Navigate to verification page
          navigate('/verify-account', {
            state: {
              userId: userData.id,
              email: formData.email,
              role: formData.role,
            },
            replace: true
          });
        }
      }
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        error: error,
        stack: error.stack,
      });
      
      // Show user-friendly error message
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('already exists')) {
          errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection and ensure the backend is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'aid_seeker',
      label: 'Aid Seeker (Needy)',
      description: 'I need help with food, clothing, medical aid, or other assistance',
      icon: FaHandHoldingHeart,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      hoverColor: 'hover:bg-blue-200 hover:border-blue-400',
    },
    {
      value: 'aid_provider',
      label: 'Aid Provider (Donor)',
      description: 'I want to help others by providing food, goods, services, or money',
      icon: FaShieldAlt,
      color: 'bg-green-100 text-green-700 border-green-300',
      hoverColor: 'hover:bg-green-200 hover:border-green-400',
    },
    {
      value: 'organization',
      label: 'Organization Representative',
      description: 'I represent a church, NGO, community group, or organization',
      icon: FaBuilding,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      hoverColor: 'hover:bg-purple-200 hover:border-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  step >= s
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 transition-all ${
                    step > s ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16">
            <span className={`text-sm ${step >= 1 ? 'text-primary font-semibold' : 'text-gray-400'}`}>
              Basic Info
            </span>
            <span className={`text-sm ${step >= 2 ? 'text-primary font-semibold' : 'text-gray-400'}`}>
              Choose Role
            </span>
            <span className={`text-sm ${step >= 3 ? 'text-primary font-semibold' : 'text-gray-400'}`}>
              Verification
            </span>
          </div>
        </div>

        <Card className="shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-dark mb-2">
              {t('auth.register.title', 'Create Your Account')}
            </h1>
            <p className="text-gray-600">
              {t('auth.register.subtitle', 'Join our community to help or receive help')}
            </p>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleStep1Next(); }} className="space-y-6">
              <FormField
                label={t('auth.register.name', 'Full Name')}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={FaUser}
                required
                placeholder="Enter your full name"
              />

              <FormField
                label={t('auth.register.email', 'Email Address')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={FaEnvelope}
                required
                placeholder="your.email@example.com"
              />

              <FormField
                label={t('auth.register.phone', 'Phone Number')}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+251 9XX XXX XXX"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label={t('auth.register.password', 'Password')}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={FaLock}
                  required
                  placeholder="At least 8 characters"
                />

                <FormField
                  label={t('auth.register.confirmPassword', 'Confirm Password')}
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={FaLock}
                  required
                  placeholder="Re-enter password"
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-600 text-sm">{errors.agreeToTerms}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Continue to Role Selection →
              </button>
            </form>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-text-dark mb-2">
                  How do you want to use this platform?
                </h2>
                <p className="text-gray-600">
                  Select the role that best describes you. You can change this later.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, role: role.value }));
                        setErrors({});
                      }}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        formData.role === role.value
                          ? `${role.color} border-current shadow-lg scale-105`
                          : `bg-white border-gray-200 ${role.hoverColor}`
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                          formData.role === role.value ? 'bg-current text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{role.label}</h3>
                        </div>
                        {formData.role === role.value && (
                          <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm opacity-80">{role.description}</p>
                    </button>
                  );
                })}
              </div>

              {errors.role && (
                <p className="text-red-600 text-sm text-center">{errors.role}</p>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleStep2Next}
                  disabled={!formData.role}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Verification Info */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <FaShieldAlt className="text-blue-600 text-xl mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Account Verification Required</h3>
                    <p className="text-sm text-blue-800">
                      After registration, your account will be <strong>Unverified</strong>. You'll need to:
                    </p>
                    <ul className="text-sm text-blue-800 mt-2 list-disc list-inside space-y-1">
                      <li>Complete your profile</li>
                      <li>Upload identification documents</li>
                      <li>Wait for admin/organization approval</li>
                    </ul>
                    <p className="text-sm text-blue-800 mt-2 font-semibold">
                      ⚠️ You cannot request or provide aid until verified.
                    </p>
                  </div>
                </div>
              </div>

              {formData.role === 'organization' && (
                <>
                  <FormField
                    label="Organization Name"
                    name="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Your organization name"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Type
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="CHURCH">Church</option>
                      <option value="NGO">NGO</option>
                      <option value="COMMUNITY_GROUP">Community Group</option>
                      <option value="SCHOOL">School</option>
                      <option value="HOSPITAL">Hospital</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterWithVerification;

