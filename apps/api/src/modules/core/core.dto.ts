import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsBoolean, IsISO8601, IsArray, ArrayMaxSize, ValidateNested, IsUUID, MaxLength, MinLength, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { TemplateKey, MemberRole, TaskStatus, PriorityLevel } from '@prisma/client';
export class WorkspaceDto {
 @IsString() @MinLength(1) @MaxLength(120) name!: string;
 @IsOptional() @IsEnum(TemplateKey) template: TemplateKey = TemplateKey.custom;
 @IsOptional() @IsString() @MaxLength(30) color?: string;
}
export class WorkspaceUpdateDto extends PartialType(WorkspaceDto) {
 @IsOptional() @IsString() @MaxLength(100) priorityTopic?: string;
}
export class OnboardingDto extends WorkspaceDto { @IsEnum(TemplateKey) primaryRole!: TemplateKey; }
export class TemplateDto { @IsEnum(TemplateKey) template!: TemplateKey; }
export class MemberDto { @IsUUID() userId!: string; @IsEnum(MemberRole) role!: MemberRole; }
export class MemberUpdateDto { @IsEnum(MemberRole) role!: MemberRole; }
export class TaskDto {
 @IsString() @MinLength(1) @MaxLength(300) title!: string;
 @IsOptional() @IsString() description?: string;
 @IsOptional() @IsEnum(TaskStatus) status?: TaskStatus;
 @IsOptional() @IsEnum(PriorityLevel) priority?: PriorityLevel;
 @IsOptional() @IsISO8601() dueAt?: string;
 @IsOptional() @IsInt() @Min(0) estimatedMinutes?: number;
 @IsOptional() @IsUUID() goalId?: string;
 @IsOptional() @IsUUID() milestoneId?: string;
 @IsOptional() @IsUUID() projectId?: string;
 @IsOptional() @IsUUID() assigneeId?: string;
}
export class TaskUpdateDto extends PartialType(TaskDto) {}
export class TaskQuery {
 @IsOptional() @IsEnum(TaskStatus) status?: TaskStatus;
 @IsOptional() @IsEnum(PriorityLevel) priority?: PriorityLevel;
 @IsOptional() @IsUUID() goalId?: string;
 @IsOptional() @IsUUID() projectId?: string;
 @IsOptional() @IsUUID() assigneeId?: string;
 @IsOptional() @IsISO8601() due_from?: string;
 @IsOptional() @IsISO8601() due_to?: string;
 @IsOptional() @IsString() @MaxLength(300) q?: string;
 @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
 @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 30;
}
export class ReorderDto { @IsArray() @ArrayMaxSize(200) @IsUUID('4', {each:true}) ids!: string[]; }
export class CompleteDto { @IsBoolean() completed!: boolean; }
export class NoteDto {
 @IsString() @MinLength(1) @MaxLength(300) title!: string;
 @IsOptional() @IsString() @MaxLength(200000) body?: string;
 @IsOptional() @IsUUID() categoryId?: string;
 @IsOptional() @IsBoolean() pinned?: boolean;
}
export class NoteUpdateDto extends PartialType(NoteDto) {}
export class CategoryDto { @IsString() @MinLength(1) @MaxLength(100) name!: string; @IsOptional() @IsUUID() parentId?: string; }
export class EventDto {
 @IsString() @MinLength(1) @MaxLength(300) title!: string;
 @IsOptional() @IsString() description?: string;
 @IsISO8601() startAt!: string;
 @IsISO8601() endAt!: string;
 @IsOptional() @IsBoolean() allDay?: boolean;
 @IsOptional() @IsString() location?: string;
 @IsOptional() @IsString() @MaxLength(500) recurrence?: string;
}
export class EventUpdateDto extends PartialType(EventDto) {}
export class RangeDto { @IsISO8601() from!: string; @IsISO8601() to!: string; }
export class GoalDto {
 @IsString() @MinLength(1) @MaxLength(300) title!: string;
 @IsOptional() @IsString() category?: string;
 @IsOptional() @IsISO8601() targetDate?: string;
}
export class GoalUpdateDto extends PartialType(GoalDto) {}
export class MilestoneDto { @IsString() @MinLength(1) @MaxLength(300) title!: string; @IsOptional() @IsBoolean() completed?: boolean; }
export class MilestoneUpdateDto extends PartialType(MilestoneDto) {}
export class ModuleDto { @IsBoolean() enabled!: boolean; }
export class WidgetDto {
 @IsString() widgetType!: string;
 @IsOptional() @IsString() @MaxLength(120) title?: string;
 @IsOptional() @IsInt() @Min(0) @Max(11) x?: number;
 @IsOptional() @IsInt() @Min(0) @Max(10000) y?: number;
 @IsOptional() @IsInt() @Min(1) @Max(12) w?: number;
 @IsOptional() @IsInt() @Min(1) @Max(20) h?: number;
 @IsOptional() @IsInt() @Min(0) position?: number;
 @IsOptional() @IsObject() config?: Record<string, unknown>;
}
export class WidgetUpdateDto extends PartialType(WidgetDto) {}
export class LayoutItem {
 @IsUUID() id!: string;
 @IsInt() @Min(0) @Max(11) x!: number;
 @IsInt() @Min(0) @Max(10000) y!: number;
 @IsInt() @Min(1) @Max(12) w!: number;
 @IsInt() @Min(1) @Max(20) h!: number;
}
export class LayoutDto { @IsArray() @ArrayMaxSize(100) @ValidateNested({each:true}) @Type(() => LayoutItem) items!: LayoutItem[]; }
export class DashboardDto { @IsOptional() @IsString() @MaxLength(100) priorityTopic?: string; @IsOptional() @IsString() @MaxLength(30) layoutMode?: string; }

