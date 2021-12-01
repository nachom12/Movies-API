function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(400).json({
    'error':  err.message || err.errors
  });
}

module.exports = errorHandler;