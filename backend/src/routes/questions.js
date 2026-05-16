// ============================================
// Question Routes
// ============================================

const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

const router = Router();

// ── Validation Rules ─────────────────────────

const createQuestionRules = [
  body('text')
    .notEmpty()
    .withMessage('Question text is required.')
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Question text must not exceed 500 characters.'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer.'),
  body('options')
    .isArray({ min: 2 })
    .withMessage('At least 2 options are required.'),
  body('options.*.text')
    .notEmpty()
    .withMessage('Option text is required.')
    .isString()
    .trim(),
  body('options.*.score')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Score must be between 0 and 10.'),
  body('options.*.order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Option order must be a positive integer.'),
];

const updateQuestionRules = [
  body('text')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Question text must not exceed 500 characters.'),
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer.'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean.'),
  body('options')
    .optional()
    .isArray({ min: 2 })
    .withMessage('At least 2 options are required.'),
  body('options.*.text')
    .optional()
    .isString()
    .trim(),
  body('options.*.score')
    .optional()
    .isInt({ min: 0, max: 10 }),
];

// ── Routes ───────────────────────────────────

// GET /api/questions — Public (active questions for the questionnaire)
router.get('/', getQuestions);

// GET /api/questions/all — Admin only (includes inactive)
router.get('/all', authenticate, authorize('ADMIN', 'DOCTOR'), getAllQuestions);

// POST /api/questions — Admin only
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  createQuestionRules,
  validate,
  createQuestion
);

// PUT /api/questions/:id — Admin only
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  updateQuestionRules,
  validate,
  updateQuestion
);

// DELETE /api/questions/:id — Admin only (soft delete)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deleteQuestion
);

module.exports = router;
