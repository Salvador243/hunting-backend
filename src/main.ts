import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir archivos estáticos desde /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Prefijo global v1
  app.setGlobalPrefix('v1');

  // Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Hunting Platform API')
    .setDescription('API para la plataforma de prácticas profesionales')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Autenticación y registro')
    .addTag('Students', 'Gestión de perfiles de estudiantes')
    .addTag('Companies', 'Gestión de perfiles de empresas')
    .addTag('Vacancies', 'Gestión de vacantes')
    .addTag('Applications', 'Postulaciones a vacantes')
    .addTag('Uploads', 'Subida de archivos')
    .addTag('Notifications', 'Sistema de notificaciones (Admin)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://hunting-backend.duckdns.org',
    'https://hunting-backend.duckdns.org',
    'https://innova-talentum.netlify.app', //front
    'https://innovahunting.org',
  ];
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : defaultOrigins;

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/api`);
}
bootstrap();
