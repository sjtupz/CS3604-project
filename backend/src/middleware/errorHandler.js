const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const code = err.code || 50000;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    code: code,
    message: message,
    data: null
  });
};

module.exports = errorHandler;
