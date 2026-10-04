import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [CalendarController],
  providers: [PrismaService, SupabaseService],
})
export class CalendarModule {}
