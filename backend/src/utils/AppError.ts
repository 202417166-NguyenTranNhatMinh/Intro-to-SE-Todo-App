export class AppError extends Error {
  constructor(public readonly status: number, message: string, public readonly data: unknown = null) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message = "Bad request") { return new AppError(400, message); }
  static unauthorized(message = "Authentication required") { return new AppError(401, message); }
  static forbidden(message = "Forbidden") { return new AppError(403, message); }
  static notFound(message = "Resource not found") { return new AppError(404, message); }
  static conflict(message = "Conflict") { return new AppError(409, message); }
  static serviceUnavailable(message = "Service unavailable") { return new AppError(503, message); }
}
