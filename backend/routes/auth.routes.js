import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  validateLogin,
  validateRegister,
  handleValidationErrors,
} from '../utils/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/refresh', refreshToken);
router.post('/verify-email', verifyEmail);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;

