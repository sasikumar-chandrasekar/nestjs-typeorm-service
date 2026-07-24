import { Module, Global } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationExceptionFilter } from './validation-exception.filter';

@Global()
@Module({
  providers: [
    HttpExceptionFilter,
    ValidationExceptionFilter,
  ],
  exports: [
    HttpExceptionFilter,
    ValidationExceptionFilter,
  ],
})
export class ErrorsModule {}
