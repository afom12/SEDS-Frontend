import express from 'express';
import {
  getPublicLedger,
  getPublicRequest,
  getPublicStats,
} from '../controllers/transparency.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public transparency routes (no authentication required)
router.get('/ledger', optionalAuth, getPublicLedger);
router.get('/requests/:id', optionalAuth, getPublicRequest);
router.get('/stats', getPublicStats);

export default router;

