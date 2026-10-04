export type UserRole =
  | 'teacher'
  | 'student'
  | 'employee'
  | 'freelancer'
  | 'business'
  | 'personal'
  | 'custom';

export type ModuleKey =
  | 'tasks'
  | 'notes'
  | 'calendar'
  | 'goals'
  | 'classes'
  | 'lesson_plans'
  | 'assignments'
  | 'sales'
  | 'inventory'
  | 'finance'
  | 'trackers'
  | 'focus'
  | 'analytics';

export type WidgetType =
  | 'task_list'
  | 'task_progress'
  | 'calendar_today'
  | 'notes_recent'
  | 'goal_progress'
  | 'progress_summary'
  | 'classes_today'
  | 'pending_grades'
  | 'lesson_plans_week'
  | 'class_average'
  | 'students_attention'
  | 'assignments_due'
  | 'workload_hours'
  | 'weekly_goal'
  | 'focus_time'
  | 'sales_today'
  | 'low_stock'
  | 'customers_count'
  | 'finance_summary'
  | 'tracker_card';

export type TrendStatus = 'improving' | 'consistent' | 'needs_attention' | 'declining';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  title: string;
  w: number; // width in grid columns: 1 (small), 2 (medium/half), 3 (large/wide), 4 (full)
  h: number; // height in grid units
  position: number;
  config?: Record<string, any>;
}

export interface Workspace {
  id: string;
  name: string;
  role: UserRole;
  icon: string;
  color: string;
  modules: ModuleKey[];
  widgets: WidgetInstance[];
  priorityTopic?: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueAt?: string;
  estimatedMinutes?: number;
  category?: string;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  color?: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  workspaceId: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  category: 'class' | 'meeting' | 'study' | 'personal' | 'deadline';
  location?: string;
}

export interface GoalItem {
  id: string;
  workspaceId: string;
  title: string;
  category: string;
  targetDate: string;
  progress: number; // 0 - 100
  milestones: { id: string; text: string; completed: boolean }[];
}

export interface TeacherClass {
  id: string;
  workspaceId: string;
  name: string;
  subject: string;
  schedule: string;
  room: string;
  averageGrade: number;
  trend: TrendStatus;
  studentsCount: number;
}

export interface StudentRecord {
  id: string;
  workspaceId: string;
  classId: string;
  name: string;
  gradeLevel: string;
  averageGrade: number;
  trend: TrendStatus;
  notes: string;
  attendanceRate: number;
  needsAttention: boolean;
}

export interface LessonPlan {
  id: string;
  workspaceId: string;
  title: string;
  classSubject: string;
  date: string;
  templateType: 'Lecture' | 'Hands-on Lab' | 'Interactive Discussion' | 'Group Project';
  status: 'draft' | 'ready' | 'completed';
  objectives: string[];
  materials: string[];
  procedure: { phase: string; description: string; durationMin: number }[];
  assessment: string;
}

export interface StudentAssignment {
  id: string;
  workspaceId: string;
  subject: string;
  title: string;
  deadline: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimatedHours: number;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  grade?: string;
  group: 'today' | 'this_week' | 'later';
}

export interface BusinessProduct {
  id: string;
  workspaceId: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  costPrice: number;
  sellingPrice: number;
}

export interface BusinessSale {
  id: string;
  workspaceId: string;
  customerName: string;
  items: string;
  totalAmount: number;
  profit: number;
  date: string;
}

export interface FinanceSummary {
  workspaceId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  recentTransactions: {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
  }[];
}

export interface CustomTracker {
  id: string;
  workspaceId: string;
  title: string;
  unit: string;
  targetDaily: number;
  streak: number;
  todayValue: number;
  logs: { date: string; value: number }[];
}
