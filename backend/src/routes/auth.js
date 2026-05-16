// ============================================
// Auth Routes
// ============================================

const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { login, logout, getProfile } = require('../controllers/authController');

const router = Router();

// ── Validation Rules ─────────────────────────

const loginRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
];

// ── Routes ───────────────────────────────────

// POST /api/auth/login
router.post('/login', loginRules, validate, login);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/me
router.get('/me', authenticate, getProfile);

module.exports = router;
