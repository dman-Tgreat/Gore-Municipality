import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://gore-municipality.vercel.app',
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          const field = err.property;
          const constraints = err.constraints ? Object.values(err.constraints) : [];
          return constraints.length > 0 ? constraints[0] : `${field} is invalid`;
        });
        return new BadRequestException({
          statusCode: 400,
          message: messages,
          error: 'Validation Error',
        });
      },
    }),
  );

  // Swagger / OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Gore Municipality API')
    .setDescription(
      'REST API for the Gore Woreda Municipal Administration Portal.\n\n' +
      '## Authentication\n' +
      'Protected endpoints require a JWT Bearer token. Obtain one via `POST /auth/login`.\n\n' +
      '## Public Endpoints\n' +
      'News, announcements, projects, departments, investments, hero slides, and settings ' +
      'can be read without authentication.\n\n' +
      '## File Upload\n' +
      'Files are uploaded to Cloudinary. Use `POST /upload` with `multipart/form-data`. ' +
      'Allowed types: jpg, jpeg, png, gif, webp, pdf, doc, docx, xls, xlsx. Max size: 10MB.',
    )
    .setVersion('1.0')
    .setContact('Gore Woreda IT Department', 'https://gore-municipality.vercel.app', 'it@gore.gov.et')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
      'default',
    )
    .addTag('Auth', 'Admin authentication (login)')
    .addTag('Admin Users', 'Manage admin user accounts')
    .addTag('News', 'News articles (trilingual: EN/AM/OM)')
    .addTag('Announcements', 'Public announcements (trilingual)')
    .addTag('Projects', 'Municipal projects (trilingual)')
    .addTag('Departments', 'Government departments (trilingual)')
    .addTag('Investments', 'Investment opportunities (trilingual)')
    .addTag('Contact', 'Contact form submissions')
    .addTag('Hero Slides', 'Homepage carousel images')
    .addTag('Settings', 'Key-value site settings')
    .addTag('Upload', 'File upload/delete via Cloudinary')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Gore Municipality API Docs',
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();