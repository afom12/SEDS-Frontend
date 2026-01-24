const { Router } = require('express');
const adminController = require('../controllers/adminController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/logs', requireAuth, requireRoles('admin'), adminController.getLogs);
router.get('/stats', requireAuth, requireRoles('admin'), adminController.getStats);
router.get('/analytics', requireAuth, requireRoles('admin'), adminController.getAnalytics);

module.exports = router;


