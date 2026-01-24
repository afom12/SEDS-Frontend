const { Router } = require('express');
const notificationController = require('../controllers/notificationController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', requireAuth, notificationController.getMyNotifications);
router.put('/:id/read', requireAuth, notificationController.markNotificationRead);
router.post(
  '/announcement',
  requireAuth,
  requireRoles('admin'),
  notificationController.createAnnouncement
);

module.exports = router;


