import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonPlanDto {
  @IsString()
  @IsNotEmpty()
  title: string = '';

  @IsString()
  subject: string = '';

  @IsString()
  date: string = '';

  @IsString()
  templateType: string = 'Lecture';
}

@ApiTags('Education (Teacher & Student)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('api/v1/workspaces/:workspaceId/education')
export class EducationController {
  @Get('classes')
  @ApiOperation({ summary: 'List teacher classes and sections' })
  listClasses(@Param('workspaceId') workspaceId: string) {
    return [
      {
        id: 'c-1',
        workspaceId,
        name: 'Grade 7 — Newton',
        subject: 'Earth Science',
        schedule: 'Mon / Wed / Fri · 08:00 - 09:30 AM',
        room: 'Room 204',
        averageGrade: 88.4,
        studentsCount: 34,
      },
      {
        id: 'c-2',
        workspaceId,
        name: 'Grade 8 — Galileo',
        subject: 'Cell Biology & Genetics',
        schedule: 'Tue / Thu · 10:00 - 11:45 AM',
        room: 'Lab B',
        averageGrade: 82.1,
        studentsCount: 31,
      },
    ];
  }

  @Get('students')
  @ApiOperation({ summary: 'List student cards, grades, and intervention status' })
  listStudents(@Param('workspaceId') workspaceId: string) {
    return [
      {
        id: 'st-1',
        workspaceId,
        name: 'Rafael Mercado',
        gradeLevel: 'Grade 9 - Einstein',
        averageGrade: 71.5,
        trend: 'declining',
        notes: 'Needs peer tutoring on kinematics word problems.',
        needsAttention: true,
      },
      {
        id: 'st-3',
        workspaceId,
        name: 'Hannah Cruz',
        gradeLevel: 'Grade 7 - Newton',
        averageGrade: 96.2,
        trend: 'improving',
        notes: 'Exemplary plate tectonics model.',
        needsAttention: false,
      },
    ];
  }

  @Get('lesson-plans')
  @ApiOperation({ summary: 'List structured lesson plans' })
  listLessonPlans(@Param('workspaceId') workspaceId: string) {
    return [
      {
        id: 'lp-1',
        workspaceId,
        title: 'Plate Tectonics & Seismic Waves',
        subject: 'Grade 7 — Earth Science',
        templateType: 'Hands-on Lab',
        status: 'ready',
        date: '2026-10-06',
      },
    ];
  }

  @Post('lesson-plans')
  @ApiOperation({ summary: 'Create structured lesson plan' })
  createLessonPlan(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateLessonPlanDto
  ) {
    return {
      id: `lp-${Date.now()}`,
      workspaceId,
      ...dto,
      status: 'ready',
      createdAt: new Date().toISOString(),
    };
  }

  @Post('lesson-plans/:planId/duplicate')
  @ApiOperation({ summary: 'Duplicate an existing lesson plan for reuse' })
  duplicateLessonPlan(
    @Param('workspaceId') workspaceId: string,
    @Param('planId') planId: string
  ) {
    return {
      id: `lp-${Date.now()}`,
      workspaceId,
      originalId: planId,
      title: 'Duplicated Lesson Plan',
      status: 'draft',
      duplicatedAt: new Date().toISOString(),
    };
  }

  @Get('assignments')
  @ApiOperation({ summary: 'List student assignments and deadlines' })
  listAssignments(@Param('workspaceId') workspaceId: string) {
    return [
      {
        id: 'as-1',
        workspaceId,
        subject: 'Advanced Calculus',
        title: 'Problem Set #4: Integration by Parts',
        deadline: 'Tonight, 11:59 PM',
        priority: 'urgent',
        estimatedHours: 2.5,
        status: 'in_progress',
        group: 'today',
      },
      {
        id: 'as-2',
        workspaceId,
        subject: 'Analytical Chemistry',
        title: 'Acid-Base Titration Lab Synthesis',
        deadline: 'Tomorrow, 5:00 PM',
        priority: 'high',
        estimatedHours: 3.0,
        status: 'todo',
        group: 'this_week',
      },
    ];
  }
}
