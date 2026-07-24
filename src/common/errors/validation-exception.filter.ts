import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const exceptionResponse = exception.getResponse();
    
    if (this.isValidationError(exceptionResponse)) {
      const validationErrors = this.extractValidationErrors(exceptionResponse);
      
      this.logger.warn(
        `Validation failed for ${request.method} ${request.url}`,
      );

      response.status(400).json({
        statusCode: 400,
        errorCode: 'VALIDATION_ERROR',
        message: 'Validation failed',
        path: request.url,
        timestamp: new Date().toISOString(),
        details: validationErrors,
      });
    } else {
      // Let the HttpExceptionFilter handle other BadRequestExceptions
      throw exception;
    }
  }

  private isValidationError(response: any): boolean {
    return (
      typeof response === 'object' &&
      Array.isArray(response.message) &&
      response.message.some((msg: any) => typeof msg === 'object')
    );
  }

  private extractValidationErrors(response: any): any[] {
    const messages = response.message;
    const errors: any[] = [];

    messages.forEach((msg: any) => {
      if (typeof msg === 'string') {
        errors.push({ message: msg });
      } else if (msg.constraints) {
        Object.keys(msg.constraints).forEach((key) => {
          errors.push({
            field: msg.property,
            constraint: key,
            message: msg.constraints[key],
          });
        });
      }
    });

    return errors;
  }
}
