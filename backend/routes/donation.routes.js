import express from 'express';
import {
  createDonation,
  getDonations,
  getDonationById,
  getDonationHistory,
} from '../controllers/donation.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  validateCreateDonation,
  validateUUID,
  handleValidationErrors,
} from '../utils/validation.js';

const router = express.Router();

// All donation routes require authentication
router.use(authenticate);

router.post('/', authorize('DONOR'), validateCreateDonation, handleValidationErrors, createDonation);
router.get('/', getDonations);
router.get('/history', authorize('DONOR'), getDonationHistory);
router.get('/:id', validateUUID('id'), handleValidationErrors, getDonationById);

export default router;

