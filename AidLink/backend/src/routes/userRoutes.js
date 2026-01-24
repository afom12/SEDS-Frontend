const { Router } = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/auth');

const router = Router();

router.get('/:id', requireAuth, userController.getUserById);
router.put(
  '/:id',
  requireAuth,
  body('email').optional().isEmail(),
  userController.updateUser
);

module.exports = router;


