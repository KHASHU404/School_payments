import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import 'reflect-metadata';
// src/main.ts (temporary debug)
import { config } from 'dotenv';
import { GlobalExceptionFilter } from './common/global-exception.filter';


config(); // loads .env if present
console.log('DEBUG: process.env.MONGODB_URI =', process.env.MONGODB_URI);


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();

