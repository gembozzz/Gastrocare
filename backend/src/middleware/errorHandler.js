// ============================================
// Global Error Handler Middleware
// ============================================

/**
 * Global error handler. Catches all errors that propagate
 * through Express middleware and returns a consistent JSON response.
 */
function errorHandler(err, req, res, _next) {
  // Log the error
  console.error(`❌ [${new Date().toISOString()}] Error:`, err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with that unique value already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
