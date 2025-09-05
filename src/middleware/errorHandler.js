/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.status = 400;
    error.details = err.details || err.message;
  }

  // Judge0 service errors
  if (err.message && err.message.includes('Judge0')) {
    error.status = 503;
    error.message = 'Code execution service temporarily unavailable';
    error.details = process.env.NODE_ENV === 'development' ? err.message : undefined;
  }

  // Axios errors
  if (err.isAxiosError) {
    error.status = 503;
    error.message = 'External service unavailable';
    error.details = process.env.NODE_ENV === 'development' ? err.message : undefined;
  }

  // Rate limiting errors
  if (err.status === 429) {
    error.message = 'Too many requests, please try again later';
    error.status = 429;
  }

  // Send error response
  res.status(error.status).json({
    success: false,
    error: {
      message: error.message,
      status: error.status,
      ...(error.details && { details: error.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = { errorHandler };
