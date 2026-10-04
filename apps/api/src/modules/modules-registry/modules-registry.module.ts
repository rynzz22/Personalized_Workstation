import { Module } from '@nestjs/common';
import { ModulesRegistryController } from './modules-registry.controller';
import { SupabaseService } from '../../infra/supabase.service';
import { PrismaService } from '../../infra/prisma.service';

@Module({
  controllers: [ModulesRegistryController],
  providers: [SupabaseService, PrismaService],
})
export class ModulesRegistryModule {}
