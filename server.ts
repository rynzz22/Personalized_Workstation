import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './apps/api/src/app.module';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const port = 3000;

  // Initialize NestJS application
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // Swagger Documentation Setup at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Talibon Workspace API')
    .setDescription(
      'Personalized Productivity, Planning and Progress Platform API — Modular NestJS Backend with workspace scoping and RBAC'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Mount Vite development middlewares for frontend SPA
  const httpAdapter = app.getHttpAdapter();
  const expressApp = httpAdapter.getInstance();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  
  // Forward non-API routes to Vite SPA middlewares
  expressApp.use((req: any, res: any, next: any) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/health')) {
      return next();
    }
    vite.middlewares(req, res, next);
  });

  await app.listen(port, '0.0.0.0');

  console.log(`[Talibon Workspace] Server running on http://0.0.0.0:${port}`);
  console.log(`[Talibon Workspace] Swagger API Documentation at http://0.0.0.0:${port}/api/docs`);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
