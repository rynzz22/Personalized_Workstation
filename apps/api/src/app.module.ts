import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { ModulesRegistryModule } from './modules/modules-registry/modules-registry.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { NotesModule } from './modules/notes/notes.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { GoalsModule } from './modules/goals/goals.module';
import { EducationModule } from './modules/education/education.module';
import { BusinessModule } from './modules/business/business.module';
import { TrackersModule } from './modules/trackers/trackers.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaService } from './infra/prisma.service';
import { SupabaseService } from './infra/supabase.service';
import { AppLogger } from './infra/logger.service';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    WorkspacesModule,
    TemplatesModule,
    ModulesRegistryModule,
    DashboardModule,
    TasksModule,
    NotesModule,
    CalendarModule,
    GoalsModule,
    EducationModule,
    BusinessModule,
    TrackersModule,
    AnalyticsModule,
  ],
  providers: [
    PrismaService,
    SupabaseService,
    AppLogger,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
