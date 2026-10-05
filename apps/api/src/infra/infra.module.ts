import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SupabaseService } from './supabase.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../common/guards/workspace.guard';
import { RolesGuard } from '../common/guards/roles.guard';
@Global()
@Module({ providers: [PrismaService, SupabaseService, JwtAuthGuard, WorkspaceGuard, RolesGuard], exports: [PrismaService, SupabaseService, JwtAuthGuard, WorkspaceGuard, RolesGuard] })
export class InfraModule {}

