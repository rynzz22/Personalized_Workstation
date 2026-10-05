import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.config';
export async function bootstrapNest() {
  const env = validateEnv();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.enableCors({ origin: env.CORS_ORIGINS.split(',').map(value => value.trim()), credentials: true });
  app.enableShutdownHooks();
  const config = new DocumentBuilder().setTitle('Talibon Workspace API').setVersion('1.0.0').addBearerAuth().build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
  return app;
}
if (require.main === module) {
  bootstrapNest().then(app => app.listen(Number(process.env.PORT || 3000), process.env.HOST || '0.0.0.0')).catch(() => {
    console.error('API startup failed. Check configuration and database connectivity.');
    process.exitCode = 1;
  });
}
