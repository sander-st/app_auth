export class ServerInternalError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
export class NotFoundError extends ServerInternalError {
  constructor(message, statusCode = 404) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends ServerInternalError {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictError extends ServerInternalError {
  constructor(message, statusCode = 409) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ServerInternalError {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
