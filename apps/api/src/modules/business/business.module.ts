import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [BusinessController],
  providers: [PrismaService, SupabaseService],
})
export class BusinessModule {}
