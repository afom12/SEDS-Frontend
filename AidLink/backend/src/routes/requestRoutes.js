const { Router } = require('express');
const { body } = require('express-validator');
const requestController = require('../controllers/requestController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', requestController.listRequests);
router.get('/incoming', requireAuth, requestController.getIncomingRequests);
router.get('/outgoing', requireAuth, requestController.getOutgoingRequests);
router.get('/:id', requestController.getRequestById);

router.post(
  '/',
  requireAuth,
  body('title').notEmpty(),
  body('description').isLength({ min: 10 }),
  body('category').notEmpty(),
  body('amountRequested').isNumeric(),
  requestController.createRequest
);

router.put('/:id/approve', requireAuth, requireRoles('admin'), requestController.approveRequest);
router.put('/:id/reject', requireAuth, requireRoles('admin'), requestController.rejectRequest);

module.exports = router;




