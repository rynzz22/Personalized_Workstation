import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleModuleDto {
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean = true;
}

@ApiTags('Modules Registry')
@Controller('api/v1')
export class ModulesRegistryController {
  @Get('modules')
  @ApiOperation({ summary: 'Get global module catalog' })
  getModuleCatalog() {
    return [
      { key: 'tasks', name: 'Tasks & Projects', isCore: true, category: 'productivity' },
      { key: 'notes', name: 'Notes & Documents', isCore: true, category: 'productivity' },
      { key: 'calendar', name: 'Calendar & Agenda', isCore: true, category: 'productivity' },
      { key: 'goals', name: 'Goals & Milestones', isCore: true, category: 'productivity' },
      { key: 'classes', name: 'Classes & Gradebook', isCore: false, category: 'education' },
      { key: 'lesson_plans', name: 'Lesson Plan Manager', isCore: false, category: 'education' },
      { key: 'assignments', name: 'Assignments & Deadlines', isCore: false, category: 'education' },
      { key: 'sales', name: 'Sales & Orders', isCore: false, category: 'business' },
      { key: 'inventory', name: 'Inventory & Stock', isCore: false, category: 'business' },
      { key: 'finance', name: 'Finance & Cashflow', isCore: false, category: 'business' },
      { key: 'trackers', name: 'Custom Trackers', isCore: false, category: 'productivity' },
      { key: 'focus', name: 'Focus & Pomodoro', isCore: false, category: 'productivity' },
      { key: 'analytics', name: 'Progress & Intelligence', isCore: true, category: 'analytics' },
    ];
  }

  @Get('workspaces/:workspaceId/modules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiOperation({ summary: 'List enabled modules for a workspace' })
  getWorkspaceModules(@Param('workspaceId') _workspaceId: string) {
    return [
      { moduleKey: 'tasks', enabled: true },
      { moduleKey: 'notes', enabled: true },
      { moduleKey: 'calendar', enabled: true },
      { moduleKey: 'goals', enabled: true },
      { moduleKey: 'classes', enabled: true },
      { moduleKey: 'lesson_plans', enabled: true },
      { moduleKey: 'analytics', enabled: true },
    ];
  }

  @Put('workspaces/:workspaceId/modules/:moduleKey')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiOperation({ summary: 'Enable or disable a module in a workspace' })
  toggleModule(
    @Param('workspaceId') workspaceId: string,
    @Param('moduleKey') moduleKey: string,
    @Body() dto: ToggleModuleDto
  ) {
    return {
      workspaceId,
      moduleKey,
      enabled: dto.enabled,
      updatedAt: new Date().toISOString(),
    };
  }
}
