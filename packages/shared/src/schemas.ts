import { z } from 'zod';
import {
  TemplateKey,
  PriorityLevel,
  TaskStatus,
  AssignmentStatus,
} from './enums';

export const createProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  avatarUrl: z.string().url().optional(),
  primaryRole: z.nativeEnum(TemplateKey).optional(),
  locale: z.string().default('en'),
  timezone: z.string().default('Asia/Manila'),
  preferences: z.record(z.unknown()).default({}),
});

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100),
  template: z.nativeEnum(TemplateKey).default(TemplateKey.CUSTOM),
  icon: z.string().optional(),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').optional(),
  currency: z.string().length(3).default('PHP'),
  settings: z.record(z.unknown()).default({}),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  dueAt: z.string().datetime().optional().nullable(),
  estimatedMinutes: z.number().int().min(0).optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  goalId: z.string().uuid().optional().nullable(),
});

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Note title is required').max(255),
  body: z.string().default(''),
  category: z.string().default('General'),
  pinned: z.boolean().default(false),
  color: z.string().optional(),
});

export const createCalendarEventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  category: z.string().default('general'),
});

export const createGoalSchema = z.object({
  title: z.string().min(1, 'Goal title is required'),
  targetDate: z.string().datetime().optional(),
  category: z.string().default('personal'),
  milestones: z.array(z.string().min(1)).default([]),
});

export const createLessonPlanSchema = z.object({
  title: z.string().min(1, 'Lesson plan title is required'),
  subject: z.string().min(1, 'Subject is required'),
  date: z.string(),
  templateType: z.enum(['Lecture', 'Hands-on Lab', 'Interactive Discussion', 'Group Project']),
  objectives: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  procedure: z.array(
    z.object({
      phase: z.string(),
      description: z.string(),
      durationMin: z.number(),
    })
  ).default([]),
  assessment: z.string().optional(),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Assignment title is required'),
  subject: z.string().min(1, 'Subject is required'),
  deadline: z.string(),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.MEDIUM),
  estimatedHours: z.number().min(0.1).default(1.0),
  status: z.nativeEnum(AssignmentStatus).default(AssignmentStatus.TODO),
  group: z.enum(['today', 'this_week', 'later']).default('today'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  q: z.string().optional(),
});
