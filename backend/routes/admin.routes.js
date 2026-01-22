import express from 'express';
import {
  approveRequest,
  rejectRequest,
  getUsers,
  getUserById,
  verifyUser,
  getAnalytics,
  getActivityLogs,
  getStats,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  validateApproveRequest,
  validateRejectRequest,
  validateUUID,
  handleValidationErrors,
} from '../utils/validation.js';

const router = express.Router();

// All admin routes require admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

// Request management
router.post('/requests/:id/approve', validateUUID('id'), validateApproveRequest, handleValidationErrors, approveRequest);
router.post('/requests/:id/reject', validateUUID('id'), validateRejectRequest, handleValidationErrors, rejectRequest);

// User management
router.get('/users', getUsers);
router.get('/users/:id', validateUUID('id'), handleValidationErrors, getUserById);
router.post('/users/:id/verify', validateUUID('id'), handleValidationErrors, verifyUser);

// Analytics and reports
router.get('/analytics', getAnalytics);
router.get('/stats', getStats);
router.get('/logs', getActivityLogs);

export default router;

