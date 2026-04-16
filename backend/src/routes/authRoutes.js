const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticate, optionalAuthenticate, authorizeRoles } = require('../middlewares/auth');
const { loginLimiter } = require('../middlewares/rateLimiter');
const {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateAdminUserUpdate,
} = require('../middlewares/validators');

const router = express.Router();

// Publico para bootstrap (primer usuario) y login
router.post('/register', optionalAuthenticate, validateRegister, handleValidationErrors, (req, res, next) => {
  AuthController.register(req, res, next);
});

router.post('/login', loginLimiter, validateLogin, handleValidationErrors, (req, res, next) => {
  AuthController.login(req, res, next);
});

// Refresh token - publico (no requiere auth)
router.post('/refresh', (req, res, next) => {
  AuthController.refresh(req, res, next);
});

// Logout - requiere auth
router.post('/logout', authenticate, (req, res, next) => {
  AuthController.logout(req, res, next);
});

// Perfil autenticado
router.get('/me', authenticate, (req, res, next) => {
  AuthController.me(req, res, next);
});

router.get('/users', authenticate, authorizeRoles('ADMIN'), (req, res, next) => {
  AuthController.listUsers(req, res, next);
});

router.patch(
  '/users/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  validateAdminUserUpdate,
  handleValidationErrors,
  (req, res, next) => {
    AuthController.updateUserByAdmin(req, res, next);
  }
);

module.exports = router;
