import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { WinstonLogger } from 'nest-winston';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private context?: string;

  constructor(private readonly winstonLogger: WinstonLogger) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    const ctx = context || this.context;
    this.winstonLogger.log(message, ctx);
  }

  error(message: any, trace?: string, context?: string) {
    const ctx = context || this.context;
    this.winstonLogger.error(message, trace, ctx);
  }

  warn(message: any, context?: string) {
    const ctx = context || this.context;
    this.winstonLogger.warn(message, ctx);
  }

  debug(message: any, context?: string) {
    const ctx = context || this.context;
    this.winstonLogger.debug?.(message, ctx);
  }

  verbose(message: any, context?: string) {
    const ctx = context || this.context;
    this.winstonLogger.verbose?.(message, ctx);
  }
}
