import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  title: string = '';

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  targetDate?: string;
}

@ApiTags('Goals & Milestones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('api/v1/workspaces/:workspaceId/goals')
export class GoalsController {
  @Get()
  @ApiOperation({ summary: 'List goals and milestone checkpoints' })
  listGoals(@Param('workspaceId') workspaceId: string) {
    return [
      {
        id: 'g-1',
        workspaceId,
        title: '100% On-Time Quarterly Grade Submissions',
        category: 'Academic Administration',
        targetDate: 'Oct 31, 2026',
        progress: 75,
        milestones: [
          { id: 'm-1', text: 'Quizzes 1-3 graded & encoded', completed: true },
          { id: 'm-2', text: 'Midterm exam rubrics verified', completed: true },
          { id: 'm-3', text: 'Parent notifications sent for students under 75%', completed: true },
          { id: 'm-4', text: 'Final quarter encoding in Talibon Intra-Office', completed: false },
        ],
      },
    ];
  }

  @Post()
  @ApiOperation({ summary: 'Create goal' })
  createGoal(@Param('workspaceId') workspaceId: string, @Body() dto: CreateGoalDto) {
    return {
      id: `g-${Date.now()}`,
      workspaceId,
      ...dto,
      progress: 0,
      milestones: [],
      createdAt: new Date().toISOString(),
    };
  }

  @Put(':goalId/milestones/:milestoneId/toggle')
  @ApiOperation({ summary: 'Toggle milestone completion and recalculate progress' })
  toggleMilestone(
    @Param('workspaceId') workspaceId: string,
    @Param('goalId') goalId: string,
    @Param('milestoneId') milestoneId: string
  ) {
    return {
      goalId,
      milestoneId,
      completed: true,
      newProgress: 100,
    };
  }
}
