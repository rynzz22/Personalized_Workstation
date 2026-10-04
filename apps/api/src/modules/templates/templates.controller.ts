import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Templates')
@Controller('api/v1/templates')
export class TemplatesController {
  @Get()
  @ApiOperation({ summary: 'List all role-aware templates with default widgets and modules' })
  listTemplates() {
    return [
      {
        key: 'teacher',
        name: 'Teacher',
        tagline: 'Manage classes, grades, lesson plans & student needs',
        defaultModules: ['classes', 'lesson_plans', 'tasks', 'calendar', 'notes', 'goals', 'analytics'],
        defaultWidgets: ['classes_today', 'students_attention', 'pending_grades', 'class_average', 'lesson_plans_week', 'task_list', 'progress_summary'],
        priorityTopic: 'Students & Grading',
      },
      {
        key: 'student',
        name: 'Student',
        tagline: 'Track assignments, deadlines, workload & study focus',
        defaultModules: ['assignments', 'tasks', 'calendar', 'notes', 'goals', 'focus', 'analytics'],
        defaultWidgets: ['assignments_due', 'workload_hours', 'focus_time', 'weekly_goal', 'task_list', 'calendar_today'],
        priorityTopic: 'Assignments & Deadlines',
      },
      {
        key: 'business',
        name: 'Small Business',
        tagline: 'Sales, inventory, low-stock alerts & cashflow',
        defaultModules: ['sales', 'inventory', 'finance', 'tasks', 'notes', 'analytics'],
        defaultWidgets: ['sales_today', 'low_stock', 'customers_count', 'finance_summary', 'task_list'],
        priorityTopic: 'Sales & Inventory',
      },
      {
        key: 'freelancer',
        name: 'Freelancer',
        tagline: 'Client deliverables, milestones, billable hours & finances',
        defaultModules: ['tasks', 'goals', 'finance', 'calendar', 'notes', 'focus', 'analytics'],
        defaultWidgets: ['task_list', 'goal_progress', 'finance_summary', 'focus_time'],
        priorityTopic: 'Deliverables & Deadlines',
      },
      {
        key: 'employee',
        name: 'Professional / Employee',
        tagline: 'Priorities, weekly reports, meetings & project milestones',
        defaultModules: ['tasks', 'calendar', 'notes', 'goals', 'analytics'],
        defaultWidgets: ['task_list', 'calendar_today', 'goal_progress', 'progress_summary'],
        priorityTopic: 'Quarterly OKRs',
      },
      {
        key: 'personal',
        name: 'Personal',
        tagline: 'Habits, daily agenda, personal finance & life goals',
        defaultModules: ['tasks', 'notes', 'calendar', 'goals', 'trackers', 'finance'],
        defaultWidgets: ['tracker_card', 'task_list', 'goal_progress', 'notes_recent'],
        priorityTopic: 'Habits & Wellness',
      },
      {
        key: 'custom',
        name: 'Custom',
        tagline: 'Blank canvas: build your setup brick by brick',
        defaultModules: ['tasks', 'notes', 'calendar'],
        defaultWidgets: ['task_list', 'notes_recent'],
        priorityTopic: 'Tasks',
      },
    ];
  }

  @Post(':templateKey/apply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Apply role template configuration to a workspace' })
  applyTemplate(@Param('templateKey') templateKey: string) {
    return {
      success: true,
      template: templateKey,
      appliedAt: new Date().toISOString(),
    };
  }
}
