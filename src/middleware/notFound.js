/**
 * 404 Not Found middleware
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      status: 404
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = { notFound };
