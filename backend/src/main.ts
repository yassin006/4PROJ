import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Serve statique des images (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // ✅ Validation globale (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // ✅ Filtre global pour les exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Trafine API')
    .setDescription('API de navigation en temps réel')
    .setVersion('1.0')
    .addBearerAuth() // 🔐 pour support JWT dans Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 📍 http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
