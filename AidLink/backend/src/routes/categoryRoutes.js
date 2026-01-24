const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', categoryController.listCategories);
router.post('/', requireAuth, requireRoles('admin'), categoryController.createCategory);
router.put('/:id', requireAuth, requireRoles('admin'), categoryController.updateCategory);
router.delete('/:id', requireAuth, requireRoles('admin'), categoryController.deleteCategory);

module.exports = router;


