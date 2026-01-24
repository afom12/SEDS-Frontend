const { Router } = require('express');
const { body } = require('express-validator');
const deliveryController = require('../controllers/deliveryController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', requireAuth, deliveryController.listDeliveries);
router.get('/:id', requireAuth, deliveryController.getDeliveryById);

router.post(
  '/',
  requireAuth,
  requireRoles('donor', 'admin'),
  body('requestId').notEmpty(),
  deliveryController.createDelivery
);

router.put(
  '/:id/status',
  requireAuth,
  requireRoles('donor', 'admin'),
  deliveryController.updateDeliveryStatus
);

router.post(
  '/:id/confirm',
  requireAuth,
  requireRoles('recipient', 'admin'),
  deliveryController.confirmDelivery
);

module.exports = router;


