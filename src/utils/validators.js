// Form validation utilities

export const validators = {
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (value.length > 50) {
      return 'Password must be less than 50 characters';
    }
    return true;
  },

  passwordStrength: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    let strength = 0;
    let feedback = [];
    
    if (value.length >= 8) strength++;
    if (/[a-z]/.test(value)) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^a-zA-Z0-9]/.test(value)) strength++;
    
    if (strength < 3) {
      return 'Password is too weak. Include uppercase, lowercase, numbers, and special characters';
    }
    
    return true;
  },

  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return true;
  },

  minLength: (value, min, fieldName = 'This field') => {
    if (!value || value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return true;
  },

  maxLength: (value, max, fieldName = 'This field') => {
    if (value && value.length > max) {
      return `${fieldName} must be less than ${max} characters`;
    }
    return true;
  },

  number: (value, fieldName = 'This field') => {
    if (!value) return `${fieldName} is required`;
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} must be a valid number`;
    }
    return true;
  },

  min: (value, min, fieldName = 'This field') => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min) {
      return `${fieldName} must be at least ${min}`;
    }
    return true;
  },

  max: (value, max, fieldName = 'This field') => {
    const num = parseFloat(value);
    if (isNaN(num) || num > max) {
      return `${fieldName} must be less than ${max}`;
    }
    return true;
  },

  phone: (value) => {
    if (!value) return 'Phone number is required';
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return true;
  },

  url: (value) => {
    if (!value) return 'URL is required';
    try {
      new URL(value);
      return true;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  match: (value, otherValue, fieldName = 'Fields') => {
    if (value !== otherValue) {
      return `${fieldName} do not match`;
    }
    return true;
  },
};

// Helper function to combine validators
export const combineValidators = (...validators) => {
  return (value) => {
    for (const validator of validators) {
      const result = typeof validator === 'function' ? validator(value) : validator;
      if (result !== true) {
        return result;
      }
    }
    return true;
  };
};

// Password strength calculator
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };
  
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['red', 'orange', 'yellow', 'blue', 'green'];
  
  return {
    strength: Math.min(strength, 4),
    label: labels[Math.min(strength, 4)],
    color: colors[Math.min(strength, 4)],
  };
};

