import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';

@ApiTags('Custom Trackers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('api/v1/workspaces/:workspaceId/trackers')
export class TrackersController {
  @Get()
  @ApiOperation({ summary: 'List custom habit and metric trackers' })
  listTrackers(@Param('workspaceId') workspaceId: string) {
    return [
      {
        id: 'tr-1',
        workspaceId,
        title: 'Daily Water Intake',
        unit: 'glasses',
        targetDaily: 8,
        streak: 12,
        todayValue: 6,
      },
    ];
  }

  @Put(':trackerId/log')
  @ApiOperation({ summary: 'Log daily increment or decrement for a tracker' })
  logValue(
    @Param('workspaceId') workspaceId: string,
    @Param('trackerId') trackerId: string,
    @Body() body: { delta: number }
  ) {
    return {
      trackerId,
      delta: body.delta,
      updatedAt: new Date().toISOString(),
    };
  }
}
