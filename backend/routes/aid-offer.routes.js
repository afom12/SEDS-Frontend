import express from 'express';
import {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  cancelOffer,
  acceptOffer,
  getAvailableOffers,
} from '../controllers/aid-offer.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import { validateUUID, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

// Public routes
router.get('/available', optionalAuth, getAvailableOffers);
router.get('/', optionalAuth, getOffers);
router.get('/:id', optionalAuth, validateUUID('id'), handleValidationErrors, getOfferById);

// Protected routes
router.use(authenticate);

router.post('/', authorize('AID_PROVIDER'), createOffer);
router.put('/:id', authorize('AID_PROVIDER'), validateUUID('id'), handleValidationErrors, updateOffer);
router.post('/:id/cancel', authorize('AID_PROVIDER'), validateUUID('id'), handleValidationErrors, cancelOffer);
router.post('/:id/accept', authorize('AID_SEEKER'), validateUUID('id'), handleValidationErrors, acceptOffer);

export default router;

