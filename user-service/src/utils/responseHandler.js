const sendSuccessResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendErrorResponse = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  errors = []
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};
