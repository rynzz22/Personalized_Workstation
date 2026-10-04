import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [WorkspacesController],
  providers: [PrismaService, SupabaseService],
  exports: [PrismaService],
})
export class WorkspacesModule {}
