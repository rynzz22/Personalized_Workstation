import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { SupabaseService } from '../../infra/supabase.service';

@Module({
  controllers: [TemplatesController],
  providers: [SupabaseService],
})
export class TemplatesModule {}
