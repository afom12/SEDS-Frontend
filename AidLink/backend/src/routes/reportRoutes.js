const { Router } = require('express');
const { body } = require('express-validator');
const reportController = require('../controllers/reportController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', requireAuth, requireRoles('admin'), reportController.listReports);
router.post(
  '/',
  requireAuth,
  requireRoles('admin'),
  body('title').notEmpty(),
  reportController.createReport
);

module.exports = router;


