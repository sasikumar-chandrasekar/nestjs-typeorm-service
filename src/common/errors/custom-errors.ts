import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseError extends HttpException {
  constructor(
    message: string,
    public statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public errorCode: string = 'INTERNAL_ERROR',
    public details?: any,
  ) {
    super(message, statusCode);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string = 'Bad Request', details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND', details);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string = 'Conflict', details?: any) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT', details);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', details);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR', details);
  }
}
