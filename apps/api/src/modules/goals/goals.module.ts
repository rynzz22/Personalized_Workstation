import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [GoalsController],
  providers: [PrismaService, SupabaseService],
})
export class GoalsModule {}
