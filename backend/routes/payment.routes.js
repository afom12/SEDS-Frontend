import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  handleChapaWebhook,
  getPaymentStatus,
} from '../controllers/payment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateUUID, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

// Webhook routes (no auth - verified by signature)
router.post('/webhooks/stripe', handleStripeWebhook);
router.post('/webhooks/chapa', handleChapaWebhook);

// Protected routes
router.use(authenticate);

router.post('/intent', authorize('DONOR'), createPaymentIntent);
router.post('/confirm', authorize('DONOR'), confirmPayment);
router.get('/status/:donationId', validateUUID('donationId'), handleValidationErrors, getPaymentStatus);

export default router;

