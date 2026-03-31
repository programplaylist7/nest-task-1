import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // comment: enable DTO validation globally
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser()); // ✅ enable cookies

  // comment: serve uploads folder
  app.use('/uploads', express.static('uploads'));

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`app is started on port: ${port}`);
  });
}
bootstrap();
