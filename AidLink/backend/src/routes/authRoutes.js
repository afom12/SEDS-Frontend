const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/auth');

const router = Router();

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('username').notEmpty(),
  authController.register
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  authController.login
);

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;





