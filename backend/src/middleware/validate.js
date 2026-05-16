// ============================================
// Request Validation Middleware
// ============================================

const { validationResult } = require('express-validator');

/**
 * Middleware that runs after express-validator checks.
 * Collects any validation errors and returns them as a 400 response.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
}

module.exports = { validate };
