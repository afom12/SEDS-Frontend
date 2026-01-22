import express from 'express';
import {
  getAidTypes,
  getAidTypeById,
  createAidType,
  updateAidType,
} from '../controllers/aid-type.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import { validateUUID, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

// Public routes - anyone can see available aid types
router.get('/', optionalAuth, getAidTypes);
router.get('/:id', optionalAuth, validateUUID('id'), handleValidationErrors, getAidTypeById);

// Admin routes - only admins can create/update aid types
router.post('/', authenticate, authorize('ADMIN'), createAidType);
router.put('/:id', authenticate, authorize('ADMIN'), validateUUID('id'), handleValidationErrors, updateAidType);

export default router;

