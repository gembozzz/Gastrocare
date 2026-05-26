// ============================================
// Assessment Routes
// ============================================

const { Router } = require('express');
const { body, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  submitAssessment,
  getAssessments,
  getAssessmentById,
} = require('../controllers/assessmentController');

const router = Router();

// ── Validation Rules ─────────────────────────

const submitAssessmentRules = [
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be a non-empty array.'),
  body('answers.*.questionId')
    .isInt({ min: 1 })
    .withMessage('Each answer must have a valid questionId.'),
  body('answers.*.optionId')
    .isInt({ min: 1 })
    .withMessage('Each answer must have a valid optionId.'),
  body('answers.*.score')
    .isInt({ min: 0, max: 3 })
    .withMessage('Each answer score must be between 0 and 3.'),
  body('userEmail')
    .optional({ values: 'null' })
    .isEmail()
    .withMessage('Please provide a valid email.')
    .normalizeEmail(),
  body('userName')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters.'),
  body('sessionId')
    .optional({ values: 'null' })
    .isString()
    .trim(),
];

const listAssessmentRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100.'),
  query('riskLevel')
    .optional()
    .isIn(['LOW', 'MODERATE', 'HIGH'])
    .withMessage('riskLevel must be LOW, MODERATE, or HIGH.'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date.'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date.'),
  query('search')
    .optional()
    .isString()
    .trim(),
];

// ── Routes ───────────────────────────────────

// POST /api/assessments — Public (submit assessment)
router.post('/', submitAssessmentRules, validate, submitAssessment);

// GET /api/assessments — Admin only (list with pagination & filters)
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'DOCTOR'),
  listAssessmentRules,
  validate,
  getAssessments
);

// GET /api/assessments/:id — Admin only (detail)
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'DOCTOR'),
  getAssessmentById
);

module.exports = router;
