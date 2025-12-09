// Standard response utility for API consistency
export const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, message = "Error", statusCode = 400, error = null) => {
  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === "development" && error) {
    response.error = error.message;
  }

  res.status(statusCode).json(response);
};
