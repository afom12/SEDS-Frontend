import express from 'express';
import {
  updateProfile,
  uploadDocument,
  getDocuments,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateUUID, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

router.use(authenticate);

router.put('/profile', updateProfile);
router.post('/documents', uploadDocument);
router.get('/documents', getDocuments);

export default router;

