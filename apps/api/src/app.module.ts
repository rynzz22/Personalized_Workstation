import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { InfraModule } from './infra/infra.module';
import { CoreModule } from './modules/core/core.module';
import { HealthModule } from './modules/health/health.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
@Module({
 imports: [
  InfraModule, CoreModule, HealthModule,
  ThrottlerModule.forRoot([{ ttl: 60000, limit: Number(process.env.THROTTLE_LIMIT || 100) }]),
  LoggerModule.forRoot({ pinoHttp: { level: process.env.LOG_LEVEL || 'info', redact: ['req.headers.authorization','req.headers.cookie','res.headers.set-cookie'], genReqId: () => crypto.randomUUID() } }),
 ],
 providers: [
  { provide: APP_GUARD, useClass: ThrottlerGuard },
  { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }) },
  { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  { provide: APP_FILTER, useClass: AllExceptionsFilter },
 ],
})
export class AppModule {}
