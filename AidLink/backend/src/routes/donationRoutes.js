const { Router } = require('express');
const { body } = require('express-validator');
const donationController = require('../controllers/donationController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', requireAuth, donationController.listDonations);
router.get('/history', requireAuth, donationController.donationHistory);

router.post(
  '/',
  requireAuth,
  requireRoles('donor', 'admin'),
  body('requestId').notEmpty(),
  body('amount').isNumeric(),
  donationController.createDonation
);

module.exports = router;


