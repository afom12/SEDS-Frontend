const { Router } = require('express');
const { body } = require('express-validator');
const complaintController = require('../controllers/complaintController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRoles('donor', 'recipient', 'admin'),
  body('message').isLength({ min: 5 }),
  complaintController.submitComplaint
);

router.get('/', requireAuth, requireRoles('admin'), complaintController.getComplaints);
router.put('/:id/resolve', requireAuth, requireRoles('admin'), complaintController.resolveComplaint);

module.exports = router;


