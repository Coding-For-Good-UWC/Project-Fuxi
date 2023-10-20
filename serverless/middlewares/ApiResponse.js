class ApiResponse {
  constructor(status, message, data = null) {
    this.code = status;
    this.status = this.getStatusFromCode(status);
    this.message = message;
    this.time = new Date().toISOString();
    this.data = data;
  }

  static success(status, message, data) {
    return new ApiResponse(status, message, data);
  }

  static error(status, message) {
    return new ApiResponse(status, message);
  }

  getStatusFromCode(code) {
    const reversedHttpStatus = {};
    for (const key in HttpStatus) {
      reversedHttpStatus[HttpStatus[key]] = key;
    }
    return reversedHttpStatus[code] || code;
  }

  static success(status, message, data) {
    return new ApiResponse(status, message, data);
  }

  static error(status, message) {
    return new ApiResponse(status, message);
  }
}

const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

module.exports = { ApiResponse, HttpStatus };
