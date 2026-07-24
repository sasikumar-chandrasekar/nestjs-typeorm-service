import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.config';
import { AppLogger } from './logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
  ],
  providers: [AppLogger],
  exports: [AppLogger, WinstonModule],
})
export class LoggerModule {}
