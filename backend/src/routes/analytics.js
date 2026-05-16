// ============================================
// Analytics Routes
// ============================================

const { Router } = require('express');
const { query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getSummary,
  getTrend,
  getQuestionStats,
} = require('../controllers/analyticsController');

const router = Router();

// ── Validation Rules ─────────────────────────

const trendRules = [
  query('period')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Period must be daily, weekly, or monthly.'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date.'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date.'),
];

// ── All analytics routes require admin/doctor auth ──

router.use(authenticate);
router.use(authorize('ADMIN', 'DOCTOR'));

// GET /api/analytics/summary
router.get('/summary', getSummary);

// GET /api/analytics/trend
router.get('/trend', trendRules, validate, getTrend);

// GET /api/analytics/questions
router.get('/questions', getQuestionStats);

module.exports = router;
