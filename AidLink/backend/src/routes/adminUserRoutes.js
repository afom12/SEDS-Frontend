const { Router } = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', requireAuth, requireRoles('admin'), userController.listUsers);
router.put('/:id/verify', requireAuth, requireRoles('admin'), userController.verifyUser);
router.put(
  '/:id/suspend',
  requireAuth,
  requireRoles('admin'),
  body('isSuspended').optional().isBoolean(),
  userController.suspendUser
);
router.put(
  '/:id/role',
  requireAuth,
  requireRoles('admin'),
  body('role').notEmpty(),
  userController.updateUserRole
);
router.delete('/:id', requireAuth, requireRoles('admin'), userController.deleteUser);

module.exports = router;


