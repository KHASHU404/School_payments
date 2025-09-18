// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ValidationPipe, Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Express middlewares
  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin like mobile apps or curl
      callback(null, true);
    },
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    credentials: true,
  });

  app.use(
    rateLimit.default({
      windowMs: 60 * 1000, // 1 minute
      max: 120, // limit each IP to 120 requests per windowMs (adjust as needed)
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true }));

  // Global validation pipe — whitelist & transform
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
