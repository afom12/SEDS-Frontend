import express from 'express';
import {
  uploadDocument,
  getDocuments,
  verifyDocument,
  deleteDocument,
  upload,
} from '../controllers/document.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateUUID, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload document
router.post('/upload', upload.single('file'), uploadDocument);

// Get documents
router.get('/', getDocuments);

// Verify document (admin only)
router.post('/:id/verify', authorize('ADMIN'), validateUUID('id'), handleValidationErrors, verifyDocument);

// Delete document
router.delete('/:id', validateUUID('id'), handleValidationErrors, deleteDocument);

export default router;

