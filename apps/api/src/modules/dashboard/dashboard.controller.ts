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
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddWidgetDto {
  @IsString()
  @IsNotEmpty()
  widgetType: string = 'task_list';

  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  w?: number = 2;

  @IsNumber()
  @IsOptional()
  h?: number = 2;
}

export class BulkLayoutDto {
  layout: { id: string; x: number; y: number; w: number; h: number; position: number }[] = [];
}

@ApiTags('Dashboard & Widgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('api/v1/workspaces/:workspaceId/dashboard')
export class DashboardController {
  @Get()
  @ApiOperation({ summary: 'Get dashboard layout and widget instances for workspace' })
  getDashboard(@Param('workspaceId') workspaceId: string) {
    return {
      workspaceId,
      layoutMode: 'grid',
      widgets: [
        { id: 'w1', widgetType: 'task_list', title: 'Action Items & Prep', w: 2, h: 2, position: 0 },
        { id: 'w2', widgetType: 'calendar_today', title: "Today's Teaching Schedule", w: 2, h: 2, position: 1 },
        { id: 'w3', widgetType: 'notes_recent', title: 'Department Notes', w: 2, h: 2, position: 2 },
        { id: 'w4', widgetType: 'progress_summary', title: 'Teaching Progress Summary', w: 2, h: 2, position: 3 },
      ],
    };
  }

  @Post('widgets')
  @ApiOperation({ summary: 'Add a new widget from catalog to the dashboard' })
  addWidget(@Param('workspaceId') workspaceId: string, @Body() dto: AddWidgetDto) {
    return {
      id: `w-${Date.now().toString(36)}`,
      workspaceId,
      widgetType: dto.widgetType,
      title: dto.title || dto.widgetType,
      w: dto.w || 2,
      h: dto.h || 2,
      position: 99,
      createdAt: new Date().toISOString(),
    };
  }

  @Delete('widgets/:widgetId')
  @ApiOperation({ summary: 'Remove a widget from the dashboard' })
  removeWidget(
    @Param('workspaceId') workspaceId: string,
    @Param('widgetId') widgetId: string
  ) {
    return {
      success: true,
      message: `Widget ${widgetId} removed`,
    };
  }

  @Put('layout')
  @ApiOperation({ summary: 'Save updated positions and sizes of widgets' })
  saveLayout(@Param('workspaceId') workspaceId: string, @Body() dto: BulkLayoutDto) {
    return {
      success: true,
      workspaceId,
      savedCount: dto.layout?.length || 0,
      updatedAt: new Date().toISOString(),
    };
  }

  @Get('data')
  @ApiOperation({
    summary: 'Aggregated endpoint returning data for all active dashboard widgets in one call',
  })
  getAggregatedData(@Param('workspaceId') _workspaceId: string) {
    return {
      tasks: { open: 4, completed: 8, completionRate: 67 },
      calendar: { todayCount: 3, nextEvent: '08:00 Grade 7 Lecture' },
      classes: { activeCount: 3, averageGrade: 84.2, studentsAtRisk: 2 },
      grades: { pendingPapers: 89 },
      progress: { score: 85, trend: 'improving', feedback: "Outstanding momentum this week!" },
      finance: { monthlyIncome: 84500, monthlyExpenses: 46200, savingsRate: 45.3 },
      sales: { todayTotal: 2080, orderCount: 2 },
      inventory: { lowStockCount: 2 },
    };
  }
}
