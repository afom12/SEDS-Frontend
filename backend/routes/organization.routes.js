import express from 'express';
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  verifyOrganization,
  addMember,
  getMembers,
  getVerifiedRequests,
} from '../controllers/organization.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import { validateUUID, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getOrganizations);
router.get('/:id', optionalAuth, validateUUID('id'), handleValidationErrors, getOrganizationById);

// Protected routes
router.use(authenticate);

router.post('/', authorize('ADMIN'), createOrganization);
router.put('/:id', authorize('ADMIN'), validateUUID('id'), handleValidationErrors, updateOrganization);
router.post('/:id/verify', authorize('ADMIN'), validateUUID('id'), handleValidationErrors, verifyOrganization);
router.post('/:id/members', authorize('ADMIN', 'AID_PROVIDER'), validateUUID('id'), handleValidationErrors, addMember);
router.get('/:id/members', validateUUID('id'), handleValidationErrors, getMembers);
router.get('/:id/requests', validateUUID('id'), handleValidationErrors, getVerifiedRequests);

export default router;

