import { Module } from '@nestjs/common';
import { TrackersController } from './trackers.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [TrackersController],
  providers: [PrismaService, SupabaseService],
})
export class TrackersModule {}
