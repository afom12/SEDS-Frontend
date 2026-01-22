import express from 'express';
import {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
  confirmDelivery,
  uploadProof,
} from '../controllers/delivery.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateUUID, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('AID_PROVIDER', 'ADMIN'), createDelivery);
router.get('/', getDeliveries);
router.get('/:id', validateUUID('id'), handleValidationErrors, getDeliveryById);
router.put('/:id/status', validateUUID('id'), handleValidationErrors, updateDeliveryStatus);
router.post('/:id/confirm', authorize('AID_SEEKER'), validateUUID('id'), handleValidationErrors, confirmDelivery);
router.post('/:id/proof', validateUUID('id'), handleValidationErrors, uploadProof);

export default router;

