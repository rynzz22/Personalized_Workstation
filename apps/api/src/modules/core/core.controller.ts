import { Controller, Get, Post, Patch, Put, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CoreService } from './core.service';
import * as D from './core.dto';
@ApiTags('Identity') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('api/v1/me')
export class IdentityController {
 constructor(private readonly service:CoreService) {}
 @Get() async me(@Req() req:any) {return {profile:await this.service.profile(req.user),workspaces:await this.service.workspaces(req.user.id)};}
 @Post('onboarding') onboard(@Req() req:any,@Body() dto:D.OnboardingDto) {return this.service.createWorkspace(req.user,{...dto,template:dto.primaryRole},dto.primaryRole);}
}
@ApiTags('Catalogs') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('api/v1')
export class CatalogController {
 constructor(private readonly service:CoreService) {}
 @Get('templates') templates() {return this.service.catalog('templates');}
 @Get('templates/:key') template(@Param('key') key:string) {return this.service.catalog('templates',key);}
 @Get('modules/catalog') modules() {return this.service.catalog('modules');}
 @Get('widgets/catalog') widgets(@Query('module') module?:string) {return this.service.catalog('widgets',module);}
}
@ApiTags('Workspaces') @ApiBearerAuth() @UseGuards(JwtAuthGuard,WorkspaceGuard,RolesGuard) @Controller('api/v1/workspaces')
export class WorkspaceController {
 constructor(private readonly service:CoreService) {}
 @Get() list(@Req() req:any) {return this.service.workspaces(req.user.id);}
 @Post() create(@Req() req:any,@Body() dto:D.WorkspaceDto) {return this.service.createWorkspace(req.user,dto);}
 @Get(':workspaceId') get(@Param('workspaceId') id:string) {return this.service.workspace(id);}
 @Patch(':workspaceId') @Roles('admin') update(@Param('workspaceId') id:string,@Body() dto:D.WorkspaceUpdateDto) {return this.service.updateWorkspace(id,dto);}
 @Delete(':workspaceId') @Roles('owner') remove(@Param('workspaceId') id:string) {return this.service.deleteWorkspace(id);}
 @Post(':workspaceId/template') @Roles('admin') template(@Param('workspaceId') id:string,@Body() dto:D.TemplateDto) {return this.service.resetTemplate(id,dto.template);}
 @Get(':workspaceId/members') members(@Param('workspaceId') id:string) {return this.service.members(id);}
 @Post(':workspaceId/members') @Roles('admin') addMember(@Param('workspaceId') id:string,@Req() req:any,@Body() dto:D.MemberDto) {return this.service.setMember(id,dto.userId,dto.role,req.member.role);}
 @Patch(':workspaceId/members/:userId') @Roles('admin') updateMember(@Param('workspaceId') id:string,@Param('userId') userId:string,@Req() req:any,@Body() dto:D.MemberUpdateDto) {return this.service.setMember(id,userId,dto.role,req.member.role);}
 @Delete(':workspaceId/members/:userId') @Roles('admin') removeMember(@Param('workspaceId') id:string,@Param('userId') userId:string,@Req() req:any) {return this.service.setMember(id,userId,'member',req.member.role,true);}
}
@ApiTags('Core productivity') @ApiBearerAuth() @UseGuards(JwtAuthGuard,WorkspaceGuard,RolesGuard) @Controller('api/v1/workspaces/:workspaceId')
export class ProductivityController {
 constructor(private readonly s:CoreService) {}
 @Get('modules') modules(@Param('workspaceId') w:string) {return this.s.modules(w);}
 @Put('modules/:key') @Roles('admin') setModule(@Param('workspaceId') w:string,@Param('key') k:string,@Body() d:D.ModuleDto) {return this.s.setModule(w,k,d.enabled);}
 @Get('dashboard') dashboard(@Param('workspaceId') w:string) {return this.s.dashboard(w);}
 @Get('dashboard/data') data(@Param('workspaceId') w:string) {return this.s.data(w);}
 @Patch('dashboard/settings') settings(@Param('workspaceId') w:string,@Body() d:D.DashboardDto) {return this.s.settings(w,d);}
 @Post('dashboard/widgets') addWidget(@Param('workspaceId') w:string,@Body() d:D.WidgetDto) {return this.s.widget(w,d);}
 @Patch('dashboard/widgets/:id') updateWidget(@Param('workspaceId') w:string,@Param('id') id:string,@Body() d:D.WidgetUpdateDto) {return this.s.widget(w,d,id);}
 @Delete('dashboard/widgets/:id') removeWidget(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.remove('dashboardWidget',w,id);}
 @Put('dashboard/layout') layout(@Param('workspaceId') w:string,@Body() d:D.LayoutDto) {return this.s.layout(w,d.items);}
 @Get('tasks') tasks(@Param('workspaceId') w:string,@Query() q:D.TaskQuery) {return this.s.tasks(w,q);}
 @Get('tasks/summary') summary(@Param('workspaceId') w:string) {return this.s.summary(w);}
 @Post('tasks/reorder') reorder(@Param('workspaceId') w:string,@Body() d:D.ReorderDto) {return this.s.reorder(w,d.ids);}
 @Post('tasks') addTask(@Param('workspaceId') w:string,@Body() d:D.TaskDto) {return this.s.task(w,d);}
 @Get('tasks/:id') task(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.owned('task',w,id);}
 @Patch('tasks/:id') updateTask(@Param('workspaceId') w:string,@Param('id') id:string,@Body() d:D.TaskUpdateDto) {return this.s.task(w,d,id);}
 @Post('tasks/:id/complete') complete(@Param('workspaceId') w:string,@Param('id') id:string,@Body() d:D.CompleteDto) {return this.s.task(w,{status:d.completed?'done':'todo'},id);}
 @Delete('tasks/:id') deleteTask(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.remove('task',w,id);}
 @Get('notes') notes(@Param('workspaceId') w:string,@Query('q') q?:string,@Query('categoryId') c?:string) {return this.s.notes(w,q,c);}
 @Get('notes/search') search(@Param('workspaceId') w:string,@Query('q') q?:string) {return this.s.notes(w,q);}
 @Post('notes') addNote(@Param('workspaceId') w:string,@Body() d:D.NoteDto) {return this.s.note(w,d);}
 @Get('notes/:id') note(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.owned('note',w,id);}
 @Patch('notes/:id') updateNote(@Param('workspaceId') w:string,@Param('id') id:string,@Body() d:D.NoteUpdateDto) {return this.s.note(w,d,id);}
 @Delete('notes/:id') deleteNote(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.remove('note',w,id);}
 @Get('note-categories') categories(@Param('workspaceId') w:string) {return this.s.categories(w);}
 @Post('note-categories') addCategory(@Param('workspaceId') w:string,@Body() d:D.CategoryDto) {return this.s.category(w,d);}
 @Patch('note-categories/:id') updateCategory(@Param('workspaceId') w:string,@Param('id') id:string,@Body() d:D.CategoryDto) {return this.s.category(w,d,id);}
 @Delete('note-categories/:id') deleteCategory(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.remove('noteCategory',w,id);}
 @Get('events') events(@Param('workspaceId') w:string,@Query() q:D.RangeDto) {return this.s.events(w,q.from,q.to);}
 @Get('events/today') today(@Param('workspaceId') w:string) {return this.s.today(w);}
 @Post('events') addEvent(@Param('workspaceId') w:string,@Body() d:D.EventDto) {return this.s.event(w,d);}
 @Patch('events/:id') updateEvent(@Param('workspaceId') w:string,@Param('id') id:string,@Body() d:D.EventUpdateDto) {return this.s.event(w,d,id);}
 @Delete('events/:id') deleteEvent(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.remove('calendarEvent',w,id);}
 @Get('goals') goals(@Param('workspaceId') w:string) {return this.s.goals(w);}
 @Post('goals') addGoal(@Param('workspaceId') w:string,@Body() d:D.GoalDto) {return this.s.goal(w,d);}
 @Get('goals/:id') goal(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.goals(w,id);}
 @Get('goals/:id/progress') progress(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.goals(w,id);}
 @Patch('goals/:id') updateGoal(@Param('workspaceId') w:string,@Param('id') id:string,@Body() d:D.GoalUpdateDto) {return this.s.goal(w,d,id);}
 @Delete('goals/:id') deleteGoal(@Param('workspaceId') w:string,@Param('id') id:string) {return this.s.remove('goal',w,id);}
 @Post('goals/:id/milestones') addMilestone(@Param('workspaceId') w:string,@Param('id') id:string,@Body() d:D.MilestoneDto) {return this.s.milestone(w,id,d);}
 @Patch('goals/:id/milestones/:mid') updateMilestone(@Param('workspaceId') w:string,@Param('id') id:string,@Param('mid') mid:string,@Body() d:D.MilestoneUpdateDto) {return this.s.milestone(w,id,d,mid);}
 @Delete('goals/:id/milestones/:mid') deleteMilestone(@Param('workspaceId') w:string,@Param('id') id:string,@Param('mid') mid:string) {return this.s.milestone(w,id,{},mid,true);}
 @Get('analytics/summary') analytics(@Param('workspaceId') w:string) {return this.s.summary(w);}
 @Get('analytics/weekly') weekly(@Param('workspaceId') w:string) {return this.s.weekly(w);}
}