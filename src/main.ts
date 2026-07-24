import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
        'HTTP',
      );
    });
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('NestJS TypeORM Service API')
    .setDescription('API documentation for NestJS TypeORM service')
    .setVersion('1.0')
    .addTag('users')
    .addTag('app')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`, 'Bootstrap');
}
bootstrap();
