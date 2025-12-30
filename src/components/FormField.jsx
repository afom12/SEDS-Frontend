import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  validation,
  showPasswordToggle = false,
  helpText,
  icon: Icon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (touched && validation && value) {
      setIsValidating(true);
      const result = validation(value);
      if (result !== true) {
        setValidationError(result);
      } else {
        setValidationError('');
      }
      setIsValidating(false);
    } else if (touched && !value && required) {
      setValidationError(`${label} is required`);
    } else {
      setValidationError('');
    }
  }, [value, touched, validation, label, required]);

  const displayError = error || validationError;
  const isValid = touched && value && !displayError && !isValidating;
  const inputType = type === 'password' && showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const handleBlur = (e) => {
    setTouched(true);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={`text-lg ${displayError ? 'text-red-500' : isValid ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${name}-error` : helpText ? `${name}-help` : undefined}
          className={`
            w-full ${Icon ? 'pl-12' : 'pl-4'} ${showPasswordToggle && type === 'password' ? 'pr-12' : 'pr-4'} py-3
            border-2 rounded-lg
            focus:outline-none focus:ring-2
            transition-all duration-200
            ${displayError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
              : isValid 
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50' 
                : 'border-gray-200 focus:border-primary focus:ring-primary focus:ring-opacity-20'
            }
          `}
          {...props}
        />

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}

        {isValid && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <FaCheckCircle className="text-green-500" />
          </div>
        )}
      </div>

      {helpText && !displayError && (
        <p id={`${name}-help`} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {displayError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 flex items-center" role="alert">
          <FaExclamationCircle className="mr-1 text-xs" />
          {displayError}
        </p>
      )}
    </div>
  );
};

export default FormField;

