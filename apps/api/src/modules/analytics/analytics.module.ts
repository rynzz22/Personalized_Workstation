import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [AnalyticsController],
  providers: [PrismaService, SupabaseService],
})
export class AnalyticsModule {}
