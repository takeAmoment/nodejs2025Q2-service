import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import * as path from 'path';
import { LoggingService } from './shared/logger/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.useLogger(app.get(LoggingService));

  //add validation pipe globaly
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
