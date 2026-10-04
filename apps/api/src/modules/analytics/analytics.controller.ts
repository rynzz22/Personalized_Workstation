import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';

@ApiTags('Analytics & Feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('api/v1/workspaces/:workspaceId/analytics')
export class AnalyticsController {
  @Get('summary')
  @ApiOperation({ summary: 'Get weekly progress velocity, trend status, and feedback message' })
  getProgressSummary(@Param('workspaceId') workspaceId: string) {
    return {
      workspaceId,
      completionRate: 85,
      tasksDone: 6,
      tasksTotal: 8,
      trend: 'improving',
      feedbackMessage: "Outstanding momentum! You've cleared 85% of this week's priorities.",
      streakDays: 5,
    };
  }
}
