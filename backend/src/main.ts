import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './middleware/HttpExceptionFilter';
import * as moment from 'moment-timezone';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: process.env.NODE_ENV === 'production' ? ['log', 'error'] : ['log'],
    logger: ['log', 'warn', 'error'],
  });
  // const corsConfig = configService.get<CorsConfig>('CORS');

  const reflector = app.get(Reflector);
  // Đặt múi giờ mặc định
  moment.tz.setDefault('Asia/Ho_Chi_Minh');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  // app.enableCors(corsOptionsDelegate(corsConfig));
  app.enableCors({
    origin: '*',
    // origin: 'http://localhost:3000',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // các api bắt đầu với tiền tố api/
  app.setGlobalPrefix('api');
  // Phục vụ các file trong thư mục 'uploads' dưới đường dẫn '/files'
  app.use('/files', express.static('uploads'));
  const config = new DocumentBuilder()
    .setTitle('Phuong Giang')
    .setDescription('Phuong Giang api document')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);
  Logger.debug(` API run in `, 'NestApplication');
}
bootstrap();
