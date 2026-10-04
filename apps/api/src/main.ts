import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

export async function bootstrapNest(port: number = 3000) {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Swagger Documentation Setup at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Talibon Workspace API')
    .setDescription(
      'Personalized Productivity, Planning and Progress Platform API — Modular backend with workspace scoping and RBAC'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  console.log(`[NestJS] Talibon API initialized with Swagger docs at /api/docs`);
  return app;
}

// Standalone execution if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrapNest(3000).then((app) => app.listen(3000, '0.0.0.0'));
}
