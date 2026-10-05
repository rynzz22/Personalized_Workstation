import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma, TemplateKey } from '@prisma/client';
import { RRule } from 'rrule';
import { PrismaService } from '../../infra/prisma.service';
import * as D from './core.dto';

@Injectable()
export class CoreService {
 constructor(private readonly db: PrismaService) {}
 profile(user: {id:string;email?:string}) {
  return this.db.profile.upsert({where:{id:user.id}, update:{}, create:{id:user.id,fullName:user.email?.split('@')[0] || 'New member'}});
 }
 workspaces(userId:string) { return this.db.workspace.findMany({where:{deletedAt:null,members:{some:{userId}}},include:{members:{where:{userId}}},orderBy:{createdAt:'asc'}}); }
 async createWorkspace(user:{id:string;email?:string}, dto:D.WorkspaceDto, primaryRole?:TemplateKey) {
  return this.db.$transaction(async tx => {
   await tx.profile.upsert({where:{id:user.id},update:primaryRole?{primaryRole}:{},create:{id:user.id,fullName:user.email?.split('@')[0] || 'New member',primaryRole}});
   const ws=await tx.workspace.create({data:{name:dto.name,template:dto.template,color:dto.color,ownerId:user.id,members:{create:{userId:user.id,role:'owner'}},dashboard:{create:{}}}});
   await this.applyTemplate(tx,ws.id,dto.template);
   return ws;
  });
 }
 async applyTemplate(tx:Prisma.TransactionClient,workspaceId:string,template:TemplateKey) {
  const preset=await tx.roleTemplate.findUnique({where:{key:template}});
  if(!preset) throw new BadRequestException('Template is unavailable. Seed the catalogs first.');
  const modules=preset.defaultModules as string[];
  const widgets=preset.defaultWidgets as string[];
  await tx.workspaceModule.deleteMany({where:{workspaceId}});
  await tx.dashboardWidget.deleteMany({where:{workspaceId}});
  await tx.workspaceModule.createMany({data:modules.map(moduleKey=>({workspaceId,moduleKey}))});
  const catalog=await tx.widgetCatalog.findMany({where:{type:{in:widgets}}});
  await tx.dashboardWidget.createMany({data:widgets.map((widgetType,i)=>{
   const w=catalog.find(item=>item.type===widgetType);
   if(!w) throw new BadRequestException('Template references an unavailable widget');
   return {workspaceId,widgetType,w:4,h:Math.max(2,w.defaultH),x:(i%3)*4,y:Math.floor(i/3)*3,position:i};
  })});
  await tx.dashboardSettings.upsert({where:{workspaceId},create:{workspaceId,priorityTopic:preset.priorityTopic},update:{priorityTopic:preset.priorityTopic}});
  await tx.workspace.update({where:{id:workspaceId},data:{template}});
 }
 resetTemplate(workspaceId:string,template:TemplateKey) { return this.db.$transaction(async tx=>{await this.applyTemplate(tx,workspaceId,template);return {success:true};}); }
 workspace(id:string) { return this.db.workspace.findFirstOrThrow({where:{id,deletedAt:null}}); }
 async updateWorkspace(id:string,dto:D.WorkspaceUpdateDto) {
  const {priorityTopic,template,...data}=dto;
  return this.db.$transaction(async tx=>{
   if(template) await this.applyTemplate(tx,id,template);
   if(priorityTopic!==undefined) await tx.dashboardSettings.update({where:{workspaceId:id},data:{priorityTopic}});
   return tx.workspace.update({where:{id},data});
  });
 }
 deleteWorkspace(id:string) { return this.db.workspace.update({where:{id},data:{deletedAt:new Date()}}); }
 members(workspaceId:string) {return this.db.workspaceMember.findMany({where:{workspaceId},include:{user:true}});}
 async setMember(workspaceId:string,userId:string,role:string,actorRole:string,remove=false) {
  const ws=await this.workspace(workspaceId);
  const existing=await this.db.workspaceMember.findUnique({where:{workspaceId_userId:{workspaceId,userId}}});
  if(userId===ws.ownerId || role==='owner') throw new ForbiddenException('Ownership cannot be changed here');
  if(actorRole!=='owner' && (role==='admin'||existing?.role==='admin')) throw new ForbiddenException('Only owners manage administrators');
  if(remove) { if(!existing) throw new NotFoundException(); return this.db.workspaceMember.delete({where:{workspaceId_userId:{workspaceId,userId}}}); }
  if(!await this.db.profile.findUnique({where:{id:userId}})) throw new BadRequestException('Member must have an existing profile');
  return this.db.workspaceMember.upsert({where:{workspaceId_userId:{workspaceId,userId}},create:{workspaceId,userId,role:role as any},update:{role:role as any}});
 }
 catalog(kind:string,key?:string) {
  if(kind==='modules') return this.db.moduleCatalog.findMany();
  if(kind==='widgets') return this.db.widgetCatalog.findMany({where:key?{moduleKey:key}:{}});
  return key?this.db.roleTemplate.findUnique({where:{key:key as TemplateKey}}):this.db.roleTemplate.findMany();
 }
 modules(workspaceId:string) {return this.db.workspaceModule.findMany({where:{workspaceId},include:{catalog:true}});}
 async setModule(workspaceId:string,moduleKey:string,enabled:boolean) {
  if(!await this.db.moduleCatalog.findUnique({where:{key:moduleKey}})) throw new NotFoundException('Module not found');
  return this.db.workspaceModule.upsert({where:{workspaceId_moduleKey:{workspaceId,moduleKey}},create:{workspaceId,moduleKey,enabled},update:{enabled}});
 }
 async dashboard(workspaceId:string) {
  const [settings,widgets]=await Promise.all([this.db.dashboardSettings.findUnique({where:{workspaceId}}),this.db.dashboardWidget.findMany({where:{workspaceId},include:{catalog:true},orderBy:{position:'asc'}})]);
  return {settings,widgets};
 }
 settings(workspaceId:string,dto:D.DashboardDto) {return this.db.dashboardSettings.upsert({where:{workspaceId},create:{workspaceId,...dto},update:dto});}
 async widget(workspaceId:string,dto:D.WidgetDto|D.WidgetUpdateDto,id?:string) {
  if(id) await this.owned('dashboardWidget',workspaceId,id);
  if(dto.widgetType) {
   const catalog=await this.db.widgetCatalog.findUnique({where:{type:dto.widgetType}});
   if(!catalog) throw new BadRequestException('Unknown widget');
   const mod=await this.db.workspaceModule.findUnique({where:{workspaceId_moduleKey:{workspaceId,moduleKey:catalog.moduleKey}}});
   if(!mod?.enabled) throw new BadRequestException('Enable this module first');
  }
  if((dto.x??0)+(dto.w??1)>12) throw new BadRequestException('Widget exceeds grid width');
  return id?this.db.dashboardWidget.update({where:{id,workspaceId},data:dto as any}):this.db.dashboardWidget.create({data:{workspaceId,...dto} as any});
 }
 async layout(workspaceId:string,items:D.LayoutItem[]) {
  if(new Set(items.map(i=>i.id)).size!==items.length || items.some(i=>i.x+i.w>12)) throw new BadRequestException('Invalid layout');
  return this.db.$transaction(async tx=>{
   const count=await tx.dashboardWidget.count({where:{workspaceId,id:{in:items.map(i=>i.id)}}});
   if(count!==items.length) throw new NotFoundException('Widget not found');
   for(const [position,item] of items.entries()) {const {id,...data}=item;await tx.dashboardWidget.update({where:{id,workspaceId},data:{...data,position}});}
   return {saved:items.length};
  });
 }
 async owned(kind:'task'|'note'|'goal'|'calendarEvent'|'noteCategory'|'dashboardWidget',workspaceId:string,id:string) {
  const row=await (this.db[kind] as any).findFirst({where:{id,workspaceId,...(['task','note'].includes(kind)?{deletedAt:null}:{})}});
  if(!row) throw new NotFoundException('Record not found');
  return row;
 }
 async remove(kind:'task'|'note'|'goal'|'calendarEvent'|'noteCategory'|'dashboardWidget',workspaceId:string,id:string) {
  await this.owned(kind,workspaceId,id);
  if(kind==='task'||kind==='note') return (this.db[kind] as any).updateMany({where:{id,workspaceId},data:{deletedAt:new Date()}});
  return (this.db[kind] as any).delete({where:{id,workspaceId}});
 }
 async tasks(workspaceId:string,q:D.TaskQuery) {
  const {page=1,limit=30,due_from,due_to,q:search,...filters}=q;
  const where:Prisma.TaskWhereInput={workspaceId,deletedAt:null,...filters,...(search?{title:{contains:search,mode:'insensitive' as const}}:{}),...((due_from||due_to)?{dueAt:{gte:due_from,lte:due_to}}:{})};
  const [items,total]=await this.db.$transaction([this.db.task.findMany({where,orderBy:[{position:'asc'},{createdAt:'desc'}],skip:(page-1)*limit,take:limit}),this.db.task.count({where})]);
  return {items,meta:{page,limit,total,totalPages:Math.ceil(total/limit)}};
 }
 async task(workspaceId:string,dto:D.TaskDto|D.TaskUpdateDto,id?:string) {
  if(id) await this.owned('task',workspaceId,id);
  if(dto.goalId) await this.owned('goal',workspaceId,dto.goalId);
  if(dto.milestoneId) {
   const milestone=await this.db.milestone.findFirst({where:{id:dto.milestoneId,goal:{workspaceId}}});
   if(!milestone || (dto.goalId && dto.goalId!==milestone.goalId)) throw new BadRequestException('Milestone is outside this goal or workspace');
   dto.goalId=milestone.goalId;
  }
  if(dto.assigneeId && !await this.db.workspaceMember.findUnique({where:{workspaceId_userId:{workspaceId,userId:dto.assigneeId}}})) throw new BadRequestException('Assignee is not a member');
  const data={...dto,...(dto.status?{completedAt:dto.status==='done'?new Date():null}:{})};
  return id?this.db.task.update({where:{id,workspaceId},data}):this.db.task.create({data:{workspaceId,...data} as any});
 }
 async reorder(workspaceId:string,ids:string[]) {
  if(new Set(ids).size!==ids.length) throw new BadRequestException('Duplicate task');
  return this.db.$transaction(async tx=>{
   if(await tx.task.count({where:{workspaceId,deletedAt:null,id:{in:ids}}})!==ids.length) throw new NotFoundException('Task not found');
   for(const [position,id] of ids.entries()) await tx.task.update({where:{id,workspaceId},data:{position}});
   return {saved:ids.length};
  });
 }
 async summary(workspaceId:string) {
  const now=new Date(),start=new Date(now);start.setUTCHours(0,0,0,0);const end=new Date(+start+86400000);
  const base={workspaceId,deletedAt:null};
  const [total,done,overdue,dueToday]=await this.db.$transaction([
   this.db.task.count({where:{...base,status:{not:'archived'}}}),this.db.task.count({where:{...base,status:'done'}}),
   this.db.task.count({where:{...base,status:{in:['todo','in_progress']},dueAt:{lt:now}}}),
   this.db.task.count({where:{...base,status:{in:['todo','in_progress']},dueAt:{gte:start,lt:end}}}),
  ]);
  return {total,done,remaining:total-done,overdue,dueToday,completionRate:total?Math.round(done/total*100):0};
 }
 notes(workspaceId:string,q?:string,categoryId?:string) {
  return this.db.note.findMany({where:{workspaceId,deletedAt:null,categoryId,...(q?{OR:[{title:{contains:q,mode:'insensitive' as const}},{body:{contains:q,mode:'insensitive' as const}}]}:{})},orderBy:[{pinned:'desc'},{updatedAt:'desc'}],take:100});
 }
 async note(workspaceId:string,dto:D.NoteDto|D.NoteUpdateDto,id?:string) {
  if(id) await this.owned('note',workspaceId,id);
  if(dto.categoryId) await this.owned('noteCategory',workspaceId,dto.categoryId);
  return id?this.db.note.update({where:{id,workspaceId},data:dto}):this.db.note.create({data:{workspaceId,...dto} as any});
 }
 categories(workspaceId:string) {return this.db.noteCategory.findMany({where:{workspaceId},orderBy:{name:'asc'}});}
 async category(workspaceId:string,dto:D.CategoryDto,id?:string) {
  if(id) await this.owned('noteCategory',workspaceId,id);
  let parentId=dto.parentId;const visited=new Set(id?[id]:[]);
  while(parentId) {if(visited.has(parentId)) throw new BadRequestException('Category cycle');visited.add(parentId);parentId=(await this.owned('noteCategory',workspaceId,parentId)).parentId;}
  return id?this.db.noteCategory.update({where:{id,workspaceId},data:dto}):this.db.noteCategory.create({data:{workspaceId,...dto}});
 }
 async event(workspaceId:string,dto:D.EventDto|D.EventUpdateDto,id?:string) {
  const previous=id?await this.owned('calendarEvent',workspaceId,id):{};
  const merged={...previous,...dto};
  if(new Date(merged.endAt)<=new Date(merged.startAt)) throw new BadRequestException('End must be after start');
  if(dto.recurrence) {try {const rule=RRule.fromString(dto.recurrence);if(![RRule.DAILY,RRule.WEEKLY,RRule.MONTHLY].includes(rule.options.freq)) throw new Error();}catch{throw new BadRequestException('Use a daily, weekly, or monthly RRULE');}}
  return id?this.db.calendarEvent.update({where:{id,workspaceId},data:dto}):this.db.calendarEvent.create({data:{workspaceId,...dto} as any});
 }
 async events(workspaceId:string,from:string,to:string) {
  const start=new Date(from),end=new Date(to);
  if(end<=start || +end-+start>366*86400000) throw new BadRequestException('Select a range of at most one year');
  const rows=await this.db.calendarEvent.findMany({where:{workspaceId,startAt:{lte:end},OR:[{endAt:{gte:start}},{recurrence:{not:null}}]},take:1000});
  return rows.flatMap(row=>{
   if(!row.recurrence) return [row];
   const rule=new RRule({...RRule.parseString(row.recurrence),dtstart:row.startAt});
   const duration=+row.endAt-+row.startAt;
   return rule.between(new Date(+start-duration),end,true,(_,i)=>i<400).map(date=>({...row,occurrenceId:row.id+':'+date.toISOString(),startAt:date,endAt:new Date(+date+duration)}));
  }).sort((a,b)=>+a.startAt-+b.startAt);
 }
 async today(workspaceId:string) {
  const start=new Date();start.setUTCHours(0,0,0,0);const end=new Date(+start+86400000);
  const [events,tasks]=await Promise.all([this.events(workspaceId,start.toISOString(),end.toISOString()),this.db.task.findMany({where:{workspaceId,deletedAt:null,dueAt:{gte:start,lt:end},status:{in:['todo','in_progress']}}})]);
  return {events,tasks};
 }
 async goals(workspaceId:string,id?:string) {
  const rows=await this.db.goal.findMany({where:{workspaceId,...(id?{id}:{})},include:{milestones:true,tasks:{where:{deletedAt:null}}}});
  if(id&&!rows.length) throw new NotFoundException();
  const result=rows.map(goal=>{
   const milestones=goal.milestones.map(m=>{const tasks=goal.tasks.filter(t=>t.milestoneId===m.id);return {...m,progress:tasks.length?tasks.filter(t=>t.status==='done').length/tasks.length*100:m.completed?100:0};});
   const progress=milestones.length?milestones.reduce((sum,m)=>sum+m.progress,0)/milestones.length:goal.tasks.length?goal.tasks.filter(t=>t.status==='done').length/goal.tasks.length*100:0;
   return {...goal,milestones,progress:Math.round(progress)};
  });
  return id?result[0]:result;
 }
 async goal(workspaceId:string,dto:D.GoalDto|D.GoalUpdateDto,id?:string) {
  if(id) await this.owned('goal',workspaceId,id);
  return id?this.db.goal.update({where:{id,workspaceId},data:dto}):this.db.goal.create({data:{workspaceId,...dto} as any});
 }
 async milestone(workspaceId:string,goalId:string,dto:D.MilestoneDto|D.MilestoneUpdateDto,id?:string,remove=false) {
  await this.owned('goal',workspaceId,goalId);
  if(id&&!await this.db.milestone.findFirst({where:{id,goalId,goal:{workspaceId}}})) throw new NotFoundException();
  if(remove) return this.db.milestone.delete({where:{id}});
  return id?this.db.milestone.update({where:{id,goalId},data:dto}):this.db.milestone.create({data:{goalId,...dto} as any});
 }
 async weekly(workspaceId:string) {
  const end=new Date();end.setUTCHours(0,0,0,0);end.setUTCDate(end.getUTCDate()+1);const start=new Date(+end-7*86400000);
  const tasks=await this.db.task.findMany({where:{workspaceId,deletedAt:null,status:'done',completedAt:{gte:start,lt:end}},select:{completedAt:true}});
  return Array.from({length:7},(_,i)=>{const date=new Date(+start+i*86400000).toISOString().slice(0,10);return {date,completed:tasks.filter(t=>t.completedAt?.toISOString().startsWith(date)).length};});
 }
 async data(workspaceId:string) {
  const [tasks,notes,agenda,goals,progress]=await Promise.all([this.tasks(workspaceId,{page:1,limit:20}),this.notes(workspaceId),this.today(workspaceId),this.goals(workspaceId),this.summary(workspaceId)]);
  return {tasks:tasks.items,notes,agenda,goals,progress};
 }
}
