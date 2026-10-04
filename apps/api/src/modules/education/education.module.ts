import { Module } from '@nestjs/common';
import { EducationController } from './education.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [EducationController],
  providers: [PrismaService, SupabaseService],
})
export class EducationModule {}
