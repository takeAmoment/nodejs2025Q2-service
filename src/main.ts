import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import * as path from 'path';
import { LoggingService } from './shared/logger/logging.service';
import { AppExceptionFilter } from './shared/filters/app-exceptions.filter';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.useLogger(app.get(LoggingService));
  const logger = app.get(LoggingService);
  app.useGlobalFilters(new AppExceptionFilter(logger));
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new AuthGuard(jwtService));
  //for tests
  // setTimeout(() => {
  //   throw new Error('This is an uncaught exception');
  // }, 1000);
  // setTimeout(() => {
  //   Promise.reject(new Error('This is an unhandled rejection'));
  // }, 1000);

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, err.stack);
  });

  process.on('unhandledRejection', (reason: any) => {
    logger.error(
      `Unhandled Rejection: ${reason?.message || reason}`,
      reason?.stack,
    );
  });

  //add validation pipe globaly
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
