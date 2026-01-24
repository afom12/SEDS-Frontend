const { Router } = require('express');
const { body } = require('express-validator');
const itemController = require('../controllers/itemController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', itemController.getApprovedItems);
router.get('/admin', requireAuth, requireRoles('admin'), itemController.getAllItems);
router.get('/:id', itemController.getItemById);

router.post(
  '/',
  requireAuth,
  requireRoles('donor', 'admin'),
  body('title').notEmpty(),
  body('description').isLength({ min: 5 }),
  body('category').notEmpty(),
  itemController.createItem
);

router.put('/:id', requireAuth, requireRoles('donor', 'admin'), itemController.updateItem);
router.delete('/:id', requireAuth, requireRoles('donor', 'admin'), itemController.deleteItem);
router.put('/:id/approve', requireAuth, requireRoles('admin'), itemController.approveItem);
router.put('/:id/reject', requireAuth, requireRoles('admin'), itemController.rejectItem);

module.exports = router;


