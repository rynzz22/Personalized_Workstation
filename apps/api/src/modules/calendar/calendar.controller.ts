import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string = '';

  @IsString()
  startAt: string = '';

  @IsString()
  endAt: string = '';

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  category?: string;
}

@ApiTags('Calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('api/v1/workspaces/:workspaceId/calendar/events')
export class CalendarController {
  @Get()
  @ApiOperation({ summary: 'List calendar events for workspace' })
  listEvents(@Param('workspaceId') workspaceId: string) {
    return [
      {
        id: 'e-1',
        workspaceId,
        title: 'Grade 7-Newton: Earth Science Lecture',
        startAt: '2026-10-04T08:00:00Z',
        endAt: '2026-10-04T09:30:00Z',
        location: 'Room 204',
        category: 'class',
      },
    ];
  }

  @Post()
  @ApiOperation({ summary: 'Create calendar event' })
  createEvent(@Param('workspaceId') workspaceId: string, @Body() dto: CreateEventDto) {
    return {
      id: `e-${Date.now()}`,
      workspaceId,
      ...dto,
      createdAt: new Date().toISOString(),
    };
  }

  @Delete(':eventId')
  @ApiOperation({ summary: 'Delete calendar event' })
  deleteEvent(@Param('workspaceId') workspaceId: string, @Param('eventId') eventId: string) {
    return { success: true, message: `Event ${eventId} deleted` };
  }
}
