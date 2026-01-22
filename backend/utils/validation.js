import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Auth validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['DONOR', 'RECEIVER'])
    .withMessage('Role must be either DONOR or RECEIVER'),
];

// Request validation rules
export const validateCreateRequest = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 5000 })
    .withMessage('Description must be between 20 and 5000 characters'),
  body('category')
    .isIn(['MEDICAL', 'EDUCATION', 'FOOD', 'SHELTER', 'EMERGENCY', 'COMMUNITY', 'OTHER'])
    .withMessage('Invalid category'),
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),
  body('organizationName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Organization name must be less than 200 characters'),
  body('organizationType')
    .optional()
    .isIn(['INDIVIDUAL', 'CHURCH', 'NGO', 'COMMUNITY_GROUP', 'SCHOOL', 'HOSPITAL', 'OTHER'])
    .withMessage('Invalid organization type'),
];

export const validateUpdateRequest = [
  param('id')
    .isUUID()
    .withMessage('Invalid request ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 5000 }),
];

// Donation validation rules
export const validateCreateDonation = [
  body('requestId')
    .isUUID()
    .withMessage('Valid request ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('anonymous')
    .optional()
    .isBoolean()
    .withMessage('Anonymous must be a boolean'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message must be less than 500 characters'),
];

// Admin validation rules
export const validateApproveRequest = [
  param('id')
    .isUUID()
    .withMessage('Invalid request ID'),
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes must be less than 1000 characters'),
];

export const validateRejectRequest = [
  param('id')
    .isUUID()
    .withMessage('Invalid request ID'),
  body('adminNotes')
    .trim()
    .notEmpty()
    .withMessage('Rejection reason is required')
    .isLength({ max: 1000 })
    .withMessage('Admin notes must be less than 1000 characters'),
];

// UUID parameter validation
export const validateUUID = (paramName = 'id') => [
  param(paramName)
    .isUUID()
    .withMessage(`Invalid ${paramName}`),
];

