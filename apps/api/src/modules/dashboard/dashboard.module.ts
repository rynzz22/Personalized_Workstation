import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [DashboardController],
  providers: [PrismaService, SupabaseService],
})
export class DashboardModule {}
