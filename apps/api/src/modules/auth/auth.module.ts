import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseService } from '../../infra/supabase.service';
import { PrismaService } from '../../infra/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [SupabaseService, PrismaService],
  exports: [SupabaseService],
})
export class AuthModule {}
