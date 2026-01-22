/**
 * Cron Job Routes
 * For scheduled tasks like updating food urgency
 */

import express from 'express';
import { updateFoodUrgency } from '../utils/food-urgency.js';
import { expireOldItems } from '../utils/aid-matching.js';

const router = express.Router();

// Middleware to protect cron endpoints (should use API key in production)
const cronAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.CRON_API_KEY || 'dev-cron-key';
  
  if (apiKey === expectedKey) {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};

/**
 * Update food urgency for all perishable items
 * Should be called every hour
 * GET /api/cron/update-food-urgency
 */
router.get('/update-food-urgency', cronAuth, async (req, res) => {
  try {
    const result = await updateFoodUrgency();
    res.json({
      success: true,
      message: 'Food urgency updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Expire old requests and offers
 * Should be called every hour
 * GET /api/cron/expire-items
 */
router.get('/expire-items', cronAuth, async (req, res) => {
  try {
    const result = await expireOldItems();
    res.json({
      success: true,
      message: 'Items expired successfully',
      data: result,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Run all cron jobs
 * GET /api/cron/run-all
 */
router.get('/run-all', cronAuth, async (req, res) => {
  try {
    const [urgencyResult, expireResult] = await Promise.all([
      updateFoodUrgency(),
      expireOldItems(),
    ]);

    res.json({
      success: true,
      message: 'All cron jobs completed',
      data: {
        urgency: urgencyResult,
        expire: expireResult,
      },
    });
  } catch (error) {
    console.error('Cron job error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

