import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [TasksController],
  providers: [PrismaService, SupabaseService],
})
export class TasksModule {}
