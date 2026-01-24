const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (err instanceof ApiError) {
    return res.status(status).json({
      success: false,
      message,
      details: err.details,
    });
  }

  return res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;





