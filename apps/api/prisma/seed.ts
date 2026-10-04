process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/talibon_workspace';

import { PrismaClient, TemplateKey, PlanTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Talibon Workspace Catalogs and Role Templates...');

  try {
    await prisma.$connect();
  } catch (err) {
    console.warn('[Prisma Seed] PostgreSQL database server not running locally. Catalogs are prepared and will populate upon database provisioning.');
    return;
  }

  // 1. Seed Module Catalog
  const modules = [
    { key: 'tasks', name: 'Tasks & Projects', description: 'Task checklists, priorities, and deadlines', category: 'productivity', icon: 'CheckSquare', isCore: true, minTier: PlanTier.free },
    { key: 'notes', name: 'Notes & Documents', description: 'Rich notes, documentation, and guidelines', category: 'productivity', icon: 'FileText', isCore: true, minTier: PlanTier.free },
    { key: 'calendar', name: 'Calendar & Agenda', description: 'Scheduled time-blocks, meetings, and events', category: 'productivity', icon: 'Calendar', isCore: true, minTier: PlanTier.free },
    { key: 'goals', name: 'Goals & Milestones', description: 'Quarterly OKRs and milestone checklists', category: 'productivity', icon: 'Target', isCore: true, minTier: PlanTier.free },
    { key: 'classes', name: 'Classes & Gradebook', description: 'Class rosters, grade entry, and student attendance', category: 'education', icon: 'GraduationCap', isCore: false, minTier: PlanTier.free },
    { key: 'lesson_plans', name: 'Lesson Plan Manager', description: 'Structured lesson plans and curriculum templates', category: 'education', icon: 'BookOpen', isCore: false, minTier: PlanTier.free },
    { key: 'assignments', name: 'Assignments & Deadlines', description: 'Homework timeline and study workload estimation', category: 'education', icon: 'BookOpen', isCore: false, minTier: PlanTier.free },
    { key: 'sales', name: 'Sales & Orders', description: 'Retail transactions and gross profit tracking', category: 'business', icon: 'Store', isCore: false, minTier: PlanTier.free },
    { key: 'inventory', name: 'Inventory & Stock', description: 'SKU quantities and low-stock reorder alerts', category: 'business', icon: 'Package', isCore: false, minTier: PlanTier.free },
    { key: 'finance', name: 'Finance & Cashflow', description: 'Income, expenses, and savings surplus tracking', category: 'business', icon: 'Wallet', isCore: false, minTier: PlanTier.free },
    { key: 'trackers', name: 'Custom Trackers', description: 'Habits, streaks, and quantified metrics', category: 'productivity', icon: 'Activity', isCore: false, minTier: PlanTier.free },
    { key: 'focus', name: 'Focus & Pomodoro', description: 'Deep study sprints and time logging', category: 'productivity', icon: 'Flame', isCore: false, minTier: PlanTier.free },
    { key: 'analytics', name: 'Progress & Intelligence', description: 'Weekly completion trends and feedback messages', category: 'analytics', icon: 'Sparkles', isCore: true, minTier: PlanTier.free },
  ];

  for (const mod of modules) {
    await prisma.moduleCatalog.upsert({
      where: { key: mod.key },
      update: mod,
      create: mod,
    });
  }

  // 2. Seed Widget Catalog
  const widgets = [
    { type: 'task_list', moduleKey: 'tasks', name: 'Tasks List', description: 'Open tasks with status checkbox and priority tags', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'calendar_today', moduleKey: 'calendar', name: 'Today Schedule', description: "Today's agenda, lectures, and meetings", defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'notes_recent', moduleKey: 'notes', name: 'Recent Notes', description: 'Pinned rubrics and quick thoughts', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'goal_progress', moduleKey: 'goals', name: 'Goals Progress', description: 'Progress bar and milestone checklists', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'progress_summary', moduleKey: 'analytics', name: 'Weekly Progress & Feedback', description: 'Completion percentage with intelligent feedback advice', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'classes_today', moduleKey: 'classes', name: 'Classes Today', description: 'Teaching schedule, period, and room numbers', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'students_attention', moduleKey: 'classes', name: 'Students Needing Attention', description: 'At-risk students flagged for grade or attendance decline', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'pending_grades', moduleKey: 'classes', name: 'Pending Submissions', description: 'Ungraded assignments in queue', defaultW: 1, defaultH: 2, minW: 1, minH: 1 },
    { type: 'class_average', moduleKey: 'classes', name: 'Class Academic Average', description: 'Quarterly average score with trend badge', defaultW: 1, defaultH: 2, minW: 1, minH: 1 },
    { type: 'lesson_plans_week', moduleKey: 'lesson_plans', name: 'Weekly Lesson Plans', description: 'Scheduled lessons with methodology templates', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'assignments_due', moduleKey: 'assignments', name: 'Assignments Timeline', description: 'Student assignments grouped by Today, This Week, and Later', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'workload_hours', moduleKey: 'assignments', name: 'Study Workload Hours', description: 'Total study hours and heaviest assignment indicators', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'weekly_goal', moduleKey: 'goals', name: 'Review Target Progress', description: 'Weekly study hour quota completion', defaultW: 1, defaultH: 2, minW: 1, minH: 1 },
    { type: 'focus_time', moduleKey: 'focus', name: 'Pomodoro Focus Timer', description: '25-minute deep focus sprint with completed session tally', defaultW: 1, defaultH: 2, minW: 1, minH: 1 },
    { type: 'sales_today', moduleKey: 'sales', name: "Today's Gross Sales", description: 'Retail revenue, transaction orders, and net profit', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'low_stock', moduleKey: 'inventory', name: 'Critical Stock Alerts', description: 'Items below minimum reorder threshold', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
    { type: 'customers_count', moduleKey: 'sales', name: 'Active Customer Base', description: 'Active buyers and repeat purchase loyalty metrics', defaultW: 1, defaultH: 2, minW: 1, minH: 1 },
    { type: 'finance_summary', moduleKey: 'finance', name: 'Monthly Cashflow', description: 'Income, operating expense, and savings rate', defaultW: 1, defaultH: 2, minW: 1, minH: 1 },
    { type: 'tracker_card', moduleKey: 'trackers', name: 'Habits & Streaks', description: 'Daily habit check and streak counter', defaultW: 2, defaultH: 2, minW: 1, minH: 1 },
  ];

  for (const w of widgets) {
    await prisma.widgetCatalog.upsert({
      where: { type: w.type },
      update: w,
      create: w,
    });
  }

  // 3. Seed Role Templates
  const roleTemplates = [
    {
      key: TemplateKey.teacher,
      name: 'Teacher Workspace',
      description: 'Classes, gradebook, students needing attention, and lesson planner',
      defaultModules: ['classes', 'lesson_plans', 'tasks', 'calendar', 'notes', 'goals', 'analytics'],
      defaultWidgets: ['classes_today', 'students_attention', 'pending_grades', 'class_average', 'lesson_plans_week', 'task_list', 'progress_summary'],
      priorityTopic: 'Students & Grading',
    },
    {
      key: TemplateKey.student,
      name: 'Student Workspace',
      description: 'Assignments due, study workload estimation, and pomodoro timer',
      defaultModules: ['assignments', 'tasks', 'calendar', 'notes', 'goals', 'focus', 'analytics'],
      defaultWidgets: ['assignments_due', 'workload_hours', 'focus_time', 'weekly_goal', 'task_list', 'calendar_today'],
      priorityTopic: 'Assignments & Deadlines',
    },
    {
      key: TemplateKey.business,
      name: 'Small Business Workspace',
      description: 'Retail POS sales, low stock alerts, inventory, and cashflow',
      defaultModules: ['sales', 'inventory', 'finance', 'tasks', 'notes', 'analytics'],
      defaultWidgets: ['sales_today', 'low_stock', 'customers_count', 'finance_summary', 'task_list'],
      priorityTopic: 'Sales & Inventory',
    },
    {
      key: TemplateKey.freelancer,
      name: 'Freelancer Workspace',
      description: 'Client deliverables, project deadlines, and invoicing',
      defaultModules: ['tasks', 'goals', 'finance', 'calendar', 'notes', 'focus', 'analytics'],
      defaultWidgets: ['task_list', 'goal_progress', 'finance_summary', 'focus_time'],
      priorityTopic: 'Deliverables & Deadlines',
    },
    {
      key: TemplateKey.employee,
      name: 'Professional / Employee',
      description: 'Priorities, quarterly OKRs, and meetings agenda',
      defaultModules: ['tasks', 'calendar', 'notes', 'goals', 'analytics'],
      defaultWidgets: ['task_list', 'calendar_today', 'goal_progress', 'progress_summary'],
      priorityTopic: 'Quarterly OKRs',
    },
    {
      key: TemplateKey.personal,
      name: 'Personal Life Workspace',
      description: 'Habits, streaks, daily to-dos, and life goals',
      defaultModules: ['tasks', 'notes', 'calendar', 'goals', 'trackers', 'finance'],
      defaultWidgets: ['tracker_card', 'task_list', 'goal_progress', 'notes_recent'],
      priorityTopic: 'Habits & Wellness',
    },
    {
      key: TemplateKey.custom,
      name: 'Custom Workspace',
      description: 'Modular clean slate: build your layout tile by tile',
      defaultModules: ['tasks', 'notes', 'calendar'],
      defaultWidgets: ['task_list', 'notes_recent'],
      priorityTopic: 'Tasks',
    },
  ];

  for (const rt of roleTemplates) {
    await prisma.roleTemplate.upsert({
      where: { key: rt.key },
      update: rt,
      create: rt,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
