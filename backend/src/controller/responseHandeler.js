// responseHandler.js

class ResponseHandler {
  static success(res, data = {}, message = "Operation successful", statusCode = 200) {
    return res.status(statusCode).json({
      success: 1,
      message,
      data,
    });
  }

  static failure(res, message = "Operation failed", statusCode = 400) {
    return res.status(statusCode).json({
      success: 0,
      message,
    });
  }

  static error(res, error, message = "Internal Server Error", statusCode = 500) {
    console.error("Error occurred:", error);
    return res.status(statusCode).json({
      success: 0,
      message,
    });
  }

  static unauthorized(res, message = "Authentication Failed") {
    return res.status(401).json({
      success: 0,
      message,
    });
  }
}

module.exports = ResponseHandler;
