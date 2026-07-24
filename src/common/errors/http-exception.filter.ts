import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseError } from './custom-errors';
import { ErrorResponseDto } from './error-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string = 'INTERNAL_SERVER_ERROR';
    let message: string = 'An unexpected error occurred';
    let details: any;

    if (exception instanceof BaseError) {
      // Handle custom errors
      status = exception.statusCode;
      errorCode = exception.errorCode;
      message = exception.message;
      details = exception.details;
      this.logger.warn(
        `${request.method} ${request.url} - ${errorCode}: ${message}`,
      );
    } else if (exception instanceof HttpException) {
      // Handle NestJS HTTP exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorCode = this.getErrorCodeFromStatus(status);
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        errorCode = this.getErrorCodeFromStatus(status);
        details = responseObj.error || responseObj.details;
      }
      
      this.logger.warn(
        `${request.method} ${request.url} - ${status}: ${message}`,
      );
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_SERVER_ERROR';
      message = 'An unexpected error occurred';
      details = process.env.NODE_ENV === 'development' ? String(exception) : undefined;
      
      this.logger.error(
        `${request.method} ${request.url} - Unexpected error: ${exception}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      errorCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      details,
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCodeFromStatus(status: number): string {
    const statusMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      500: 'INTERNAL_SERVER_ERROR',
    };
    return statusMap[status] || 'HTTP_ERROR';
  }
}
