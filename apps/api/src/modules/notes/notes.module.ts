import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { PrismaService } from '../../infra/prisma.service';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [NotesController],
  providers: [PrismaService, SupabaseService],
})
export class NotesModule {}
