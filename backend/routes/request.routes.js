import express from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  submitRequest,
  getReceiverRequests,
  matchOfferToRequest,
  getMatchingOffers,
} from '../controllers/request.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import {
  validateCreateRequest,
  validateUpdateRequest,
  validateUUID,
  handleValidationErrors,
} from '../utils/validation.js';

const router = express.Router();

// Public route - get verified requests (for transparency page)
router.get('/public', optionalAuth, getRequests);

// Protected routes
router.post('/', authenticate, authorize('RECEIVER'), validateCreateRequest, handleValidationErrors, createRequest);
router.get('/', authenticate, getRequests);
router.get('/receiver', authenticate, authorize('RECEIVER'), getReceiverRequests);
router.get('/:id', authenticate, validateUUID('id'), handleValidationErrors, getRequestById);
router.put('/:id', authenticate, authorize('RECEIVER'), validateUUID('id'), validateUpdateRequest, handleValidationErrors, updateRequest);
router.delete('/:id', authenticate, authorize('RECEIVER'), validateUUID('id'), handleValidationErrors, deleteRequest);
router.post('/:id/submit', authenticate, authorize('RECEIVER', 'AID_SEEKER'), validateUUID('id'), handleValidationErrors, submitRequest);
router.post('/:id/match/:offerId', authenticate, authorize('ADMIN', 'AID_SEEKER'), validateUUID('id'), handleValidationErrors, matchOfferToRequest);
router.get('/:id/matches', authenticate, validateUUID('id'), handleValidationErrors, getMatchingOffers);

export default router;

