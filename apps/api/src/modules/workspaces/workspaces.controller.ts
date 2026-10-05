import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TemplateKey, MemberRole } from '@prisma/client';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @IsEnum(TemplateKey)
  @IsOptional()
  template: TemplateKey = TemplateKey.custom;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateWorkspaceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  priorityTopic?: string;
}

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/workspaces')
export class WorkspacesController {
  @Get()
  @ApiOperation({ summary: 'List all workspaces accessible to current user' })
  async listWorkspaces(@CurrentUser() _user: any) {
    return [
      {
        id: 'ws-teacher-01',
        name: 'Ms. Santos — Science Dept',
        template: 'teacher',
        role: 'owner',
        color: '#3b82f6',
        priorityTopic: 'Students & Grading',
      },
      {
        id: 'ws-student-02',
        name: 'Marcus Rivera — STEM Track',
        template: 'student',
        role: 'owner',
        color: '#8b5cf6',
        priorityTopic: 'Assignments & Deadlines',
      },
      {
        id: 'ws-business-03',
        name: 'Talibon Artisan Supplies',
        template: 'business',
        role: 'owner',
        color: '#10b981',
        priorityTopic: 'Sales & Inventory',
      },
    ];
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workspace from role template' })
  async createWorkspace(@CurrentUser() user: any, @Body() dto: CreateWorkspaceDto) {
    const id = `ws-${Date.now().toString(36)}`;
    return {
      id,
      name: dto.name,
      template: dto.template,
      color: dto.color || '#3b82f6',
      icon: dto.icon || 'Layers',
      ownerId: user.id,
      createdAt: new Date().toISOString(),
    };
  }

  @Get(':workspaceId')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get workspace details by ID' })
  async getWorkspace(@Param('workspaceId') workspaceId: string) {
    return {
      id: workspaceId,
      name: 'Ms. Santos — Science Dept',
      template: 'teacher',
      color: '#3b82f6',
      currency: 'PHP',
      createdAt: '2026-10-01T08:00:00Z',
    };
  }

  @Put(':workspaceId')
  @UseGuards(WorkspaceGuard, RolesGuard)
  @Roles(MemberRole.admin, MemberRole.owner)
  @ApiOperation({ summary: 'Update workspace metadata and priority settings' })
  async updateWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: UpdateWorkspaceDto
  ) {
    return {
      id: workspaceId,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
  }

  @Delete(':workspaceId')
  @UseGuards(WorkspaceGuard, RolesGuard)
  @Roles(MemberRole.owner)
  @ApiOperation({ summary: 'Soft-delete a workspace' })
  async deleteWorkspace(@Param('workspaceId') workspaceId: string) {
    return {
      success: true,
      message: `Workspace ${workspaceId} deleted`,
    };
  }
}
