import {
  Workspace,
  UserRole,
  ModuleKey,
  WidgetType,
  WidgetInstance,
  TaskItem,
  NoteItem,
  CalendarEvent,
  GoalItem,
  TeacherClass,
  StudentRecord,
  LessonPlan,
  StudentAssignment,
  BusinessProduct,
  BusinessSale,
  FinanceSummary,
  CustomTracker
} from '../types/workspace';

export interface RoleTemplateInfo {
  role: UserRole;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: string;
  color: string;
  defaultModules: ModuleKey[];
  defaultWidgets: { type: WidgetType; title: string; w: number; h: number }[];
}

export const ROLE_TEMPLATES: RoleTemplateInfo[] = [
  {
    role: 'teacher',
    title: 'Teacher',
    tagline: 'Manage classes, grades, lesson plans & student needs',
    description: 'Preconfigured with classes today, pending grading queues, lesson planner, and student attention indicators.',
    badge: 'Education',
    iconName: 'GraduationCap',
    color: '#3b82f6',
    defaultModules: ['classes', 'lesson_plans', 'tasks', 'calendar', 'notes', 'goals', 'analytics'],
    defaultWidgets: [
      { type: 'classes_today', title: "Today's Teaching Schedule", w: 2, h: 2 },
      { type: 'students_attention', title: 'Students Needing Attention', w: 2, h: 2 },
      { type: 'pending_grades', title: 'Pending Submissions', w: 1, h: 2 },
      { type: 'class_average', title: 'Academic Trend & Average', w: 1, h: 2 },
      { type: 'lesson_plans_week', title: 'Weekly Lesson Plans', w: 2, h: 2 },
      { type: 'task_list', title: 'Action Items & Prep', w: 2, h: 2 },
      { type: 'progress_summary', title: 'Weekly Teaching Momentum', w: 2, h: 2 }
    ]
  },
  {
    role: 'student',
    title: 'Student',
    tagline: 'Track assignments, deadlines, workload & study focus',
    description: 'Organized around homework queues, upcoming exams, study hours estimation, and daily focus timers.',
    badge: 'Academics',
    iconName: 'BookOpen',
    color: '#8b5cf6',
    defaultModules: ['assignments', 'tasks', 'calendar', 'notes', 'goals', 'focus', 'analytics'],
    defaultWidgets: [
      { type: 'assignments_due', title: 'Assignments by Deadline', w: 2, h: 2 },
      { type: 'workload_hours', title: 'Weekly Study Workload', w: 2, h: 2 },
      { type: 'focus_time', title: 'Focus & Study Session', w: 1, h: 2 },
      { type: 'weekly_goal', title: 'Study Target Progress', w: 1, h: 2 },
      { type: 'calendar_today', title: "Today's Classes & Clubs", w: 2, h: 2 },
      { type: 'task_list', title: 'Quick Study Checklist', w: 2, h: 2 }
    ]
  },
  {
    role: 'business',
    title: 'Small Business',
    tagline: 'Sales, inventory, low-stock alerts & cashflow',
    description: 'Designed for store owners, micro-retailers, and services to track daily sales, restocking, and customer orders.',
    badge: 'Commerce',
    iconName: 'Store',
    color: '#10b981',
    defaultModules: ['sales', 'inventory', 'finance', 'tasks', 'notes', 'analytics'],
    defaultWidgets: [
      { type: 'sales_today', title: "Today's Sales & Margin", w: 2, h: 2 },
      { type: 'low_stock', title: 'Low Stock & Restock Queue', w: 2, h: 2 },
      { type: 'customers_count', title: 'Active Customer Base', w: 1, h: 2 },
      { type: 'finance_summary', title: 'Cash Flow Snapshot', w: 1, h: 2 },
      { type: 'task_list', title: 'Operational Tasks', w: 2, h: 2 }
    ]
  },
  {
    role: 'freelancer',
    title: 'Freelancer',
    tagline: 'Client deliverables, milestones, billable hours & finances',
    description: 'Keeps project tasks, invoices, client deadlines, and personal income in harmony.',
    badge: 'Independent',
    iconName: 'Laptop',
    color: '#f59e0b',
    defaultModules: ['tasks', 'goals', 'finance', 'calendar', 'notes', 'focus', 'analytics'],
    defaultWidgets: [
      { type: 'task_list', title: 'Active Deliverables', w: 2, h: 2 },
      { type: 'goal_progress', title: 'Client Milestones', w: 2, h: 2 },
      { type: 'finance_summary', title: 'Invoicing & Revenue', w: 2, h: 2 },
      { type: 'focus_time', title: 'Deep Work Hours', w: 2, h: 2 }
    ]
  },
  {
    role: 'employee',
    title: 'Employee / Professional',
    tagline: 'Priorities, weekly reports, meetings & project milestones',
    description: 'Structured to highlight key priorities, agenda items, team syncs, and weekly productivity outputs.',
    badge: 'Workplace',
    iconName: 'Briefcase',
    color: '#06b6d4',
    defaultModules: ['tasks', 'calendar', 'notes', 'goals', 'analytics'],
    defaultWidgets: [
      { type: 'task_list', title: 'Priority Work Items', w: 2, h: 2 },
      { type: 'calendar_today', title: "Today's Meetings", w: 2, h: 2 },
      { type: 'goal_progress', title: 'Quarterly OKRs', w: 2, h: 2 },
      { type: 'progress_summary', title: 'Weekly Performance', w: 2, h: 2 }
    ]
  },
  {
    role: 'personal',
    title: 'Personal',
    tagline: 'Habits, daily agenda, personal finance & life goals',
    description: 'Clean personal workspace for daily routines, habit streaks, wellness, and self-improvement.',
    badge: 'Lifestyle',
    iconName: 'Sparkles',
    color: '#ec4899',
    defaultModules: ['tasks', 'notes', 'calendar', 'goals', 'trackers', 'finance'],
    defaultWidgets: [
      { type: 'tracker_card', title: 'Daily Habits & Streaks', w: 2, h: 2 },
      { type: 'task_list', title: 'Daily To-Dos', w: 2, h: 2 },
      { type: 'goal_progress', title: 'Personal Goals', w: 2, h: 2 },
      { type: 'notes_recent', title: 'Quick Thoughts & Journal', w: 2, h: 2 }
    ]
  },
  {
    role: 'custom',
    title: 'Custom Workspace',
    tagline: 'Blank canvas: build your setup brick by brick',
    description: 'Start with an empty dashboard and enable only the exact modules and widgets you desire.',
    badge: 'Modular',
    iconName: 'Layers',
    color: '#64748b',
    defaultModules: ['tasks', 'notes', 'calendar'],
    defaultWidgets: [
      { type: 'task_list', title: 'Tasks', w: 2, h: 2 },
      { type: 'notes_recent', title: 'Notes', w: 2, h: 2 }
    ]
  }
];

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-teacher-01',
    name: 'Ms. Santos — Science Dept',
    role: 'teacher',
    icon: 'GraduationCap',
    color: '#3b82f6',
    modules: ['classes', 'lesson_plans', 'tasks', 'calendar', 'notes', 'goals', 'analytics'],
    priorityTopic: 'Students & Grading',
    createdAt: '2026-10-01T08:00:00Z',
    widgets: [
      { id: 'w1', type: 'classes_today', title: "Today's Classes", w: 2, h: 2, position: 0 },
      { id: 'w2', type: 'students_attention', title: 'Students Needing Attention', w: 2, h: 2, position: 1 },
      { id: 'w3', type: 'pending_grades', title: 'Pending Submissions', w: 1, h: 2, position: 2 },
      { id: 'w4', type: 'class_average', title: 'Class Academic Average', w: 1, h: 2, position: 3 },
      { id: 'w5', type: 'lesson_plans_week', title: 'Weekly Lesson Plans', w: 2, h: 2, position: 4 },
      { id: 'w6', type: 'task_list', title: 'Faculty & Lab To-Dos', w: 2, h: 2, position: 5 },
      { id: 'w7', type: 'progress_summary', title: 'Teaching Progress Summary', w: 2, h: 2, position: 6 },
      { id: 'w8', type: 'notes_recent', title: 'Department Notes', w: 2, h: 2, position: 7 }
    ]
  },
  {
    id: 'ws-student-02',
    name: 'Marcus Rivera — STEM Track',
    role: 'student',
    icon: 'BookOpen',
    color: '#8b5cf6',
    modules: ['assignments', 'tasks', 'calendar', 'notes', 'goals', 'focus', 'analytics'],
    priorityTopic: 'Assignments & Deadlines',
    createdAt: '2026-10-02T09:00:00Z',
    widgets: [
      { id: 'sw1', type: 'assignments_due', title: 'Assignments Timeline', w: 2, h: 2, position: 0 },
      { id: 'sw2', type: 'workload_hours', title: 'Workload & Hours Estimate', w: 2, h: 2, position: 1 },
      { id: 'sw3', type: 'focus_time', title: 'Study Session Timer', w: 1, h: 2, position: 2 },
      { id: 'sw4', type: 'weekly_goal', title: 'Review Hours Goal', w: 1, h: 2, position: 3 },
      { id: 'sw5', type: 'task_list', title: 'Daily Study Checklist', w: 2, h: 2, position: 4 },
      { id: 'sw6', type: 'calendar_today', title: "Class & Lab Schedule", w: 2, h: 2, position: 5 }
    ]
  },
  {
    id: 'ws-business-03',
    name: 'Talibon Artisan Supplies',
    role: 'business',
    icon: 'Store',
    color: '#10b981',
    modules: ['sales', 'inventory', 'finance', 'tasks', 'notes', 'analytics'],
    priorityTopic: 'Sales & Inventory',
    createdAt: '2026-10-03T10:00:00Z',
    widgets: [
      { id: 'bw1', type: 'sales_today', title: "Today's Gross Sales & Profit", w: 2, h: 2, position: 0 },
      { id: 'bw2', type: 'low_stock', title: 'Critical Stock Alerts', w: 2, h: 2, position: 1 },
      { id: 'bw3', type: 'customers_count', title: 'Customer Orders', w: 1, h: 2, position: 2 },
      { id: 'bw4', type: 'finance_summary', title: 'Weekly Cashflow', w: 1, h: 2, position: 3 },
      { id: 'bw5', type: 'task_list', title: 'Store Operations', w: 2, h: 2, position: 4 }
    ]
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    workspaceId: 'ws-teacher-01',
    title: 'Grade Grade 7 Quiz on Photosynthesis',
    description: '32 submissions from Section Newton to check before Friday',
    status: 'in_progress',
    priority: 'high',
    dueAt: 'Today, 4:00 PM',
    estimatedMinutes: 45,
    category: 'Grading',
    createdAt: '2026-10-04T08:00:00Z'
  },
  {
    id: 't-2',
    workspaceId: 'ws-teacher-01',
    title: 'Submit quarterly lesson plan for Physics Unit',
    description: 'Include lab safety protocols and materials list',
    status: 'todo',
    priority: 'urgent',
    dueAt: 'Tomorrow, 10:00 AM',
    estimatedMinutes: 60,
    category: 'Planning',
    createdAt: '2026-10-04T08:30:00Z'
  },
  {
    id: 't-3',
    workspaceId: 'ws-teacher-01',
    title: 'Prepare Microscope Slides for Biology Lab',
    description: 'Clean lens and set up specimen jars for 8-Galileo',
    status: 'done',
    priority: 'medium',
    dueAt: 'Completed',
    estimatedMinutes: 30,
    category: 'Lab Prep',
    createdAt: '2026-10-03T14:00:00Z'
  },
  {
    id: 't-4',
    workspaceId: 'ws-teacher-01',
    title: 'Parent Consultation with Mrs. Reyes',
    description: 'Discuss Rafael’s attendance and science project assistance',
    status: 'todo',
    priority: 'medium',
    dueAt: 'Oct 6, 2:30 PM',
    estimatedMinutes: 20,
    category: 'Consultation',
    createdAt: '2026-10-04T09:00:00Z'
  },
  {
    id: 't-5',
    workspaceId: 'ws-student-02',
    title: 'Finish Calculus Problem Set #4',
    description: 'Integrals by parts - exercises 1 to 15',
    status: 'in_progress',
    priority: 'urgent',
    dueAt: 'Today, 11:59 PM',
    estimatedMinutes: 90,
    category: 'Math',
    createdAt: '2026-10-04T07:00:00Z'
  },
  {
    id: 't-6',
    workspaceId: 'ws-student-02',
    title: 'Write Chemistry Lab Report Draft',
    description: 'Titration results and error margin calculation',
    status: 'todo',
    priority: 'high',
    dueAt: 'Thursday',
    estimatedMinutes: 120,
    category: 'Science',
    createdAt: '2026-10-04T08:15:00Z'
  },
  {
    id: 't-7',
    workspaceId: 'ws-business-03',
    title: 'Order Eco-Kraft Packaging Boxes',
    description: 'Contact Talibon Paperworks for 500 units batch',
    status: 'todo',
    priority: 'urgent',
    dueAt: 'Today, 2:00 PM',
    estimatedMinutes: 15,
    category: 'Procurement',
    createdAt: '2026-10-04T09:00:00Z'
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n-1',
    workspaceId: 'ws-teacher-01',
    title: 'Lab Safety Protocol Refresher',
    content: 'Ensure all students wear goggles before lighting the Bunsen burners. First aid kit is replenished under Cabinet 3.',
    category: 'Lab Safety',
    pinned: true,
    color: '#fef3c7',
    updatedAt: '2026-10-03'
  },
  {
    id: 'n-2',
    workspaceId: 'ws-teacher-01',
    title: 'Science Fair Project Rubric Draft',
    content: 'Criteria: 30% Scientific Method, 25% Innovation, 25% Execution & Clarity, 20% Oral Defense.',
    category: 'Curriculum',
    pinned: false,
    color: '#e0f2fe',
    updatedAt: '2026-10-02'
  },
  {
    id: 'n-3',
    workspaceId: 'ws-student-02',
    title: 'Formulas for Physics Midterms',
    content: 'Kinematics: v = u + at, s = ut + 0.5at^2, v^2 = u^2 + 2as. Remember to convert km/h to m/s!',
    category: 'Study Notes',
    pinned: true,
    color: '#f3e8ff',
    updatedAt: '2026-10-04'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'e-1',
    workspaceId: 'ws-teacher-01',
    title: 'Grade 7-Newton: Earth Science Lecture',
    startTime: '08:00',
    endTime: '09:30',
    date: '2026-10-04',
    category: 'class',
    location: 'Room 204'
  },
  {
    id: 'e-2',
    workspaceId: 'ws-teacher-01',
    title: 'Grade 8-Galileo: Biology Wet Lab',
    startTime: '10:00',
    endTime: '11:45',
    date: '2026-10-04',
    category: 'class',
    location: 'Science Lab B'
  },
  {
    id: 'e-3',
    workspaceId: 'ws-teacher-01',
    title: 'Science Faculty Coordination Sync',
    startTime: '13:30',
    endTime: '14:30',
    date: '2026-10-04',
    category: 'meeting',
    location: 'Faculty Lounge'
  },
  {
    id: 'e-4',
    workspaceId: 'ws-student-02',
    title: 'Differential Equations Lecture',
    startTime: '09:00',
    endTime: '10:30',
    date: '2026-10-04',
    category: 'class',
    location: 'Math Hall 1'
  },
  {
    id: 'e-5',
    workspaceId: 'ws-student-02',
    title: 'Robotics Club Project Sprint',
    startTime: '16:00',
    endTime: '18:00',
    date: '2026-10-04',
    category: 'study',
    location: 'Maker Space'
  }
];

export const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'g-1',
    workspaceId: 'ws-teacher-01',
    title: '100% On-Time Quarterly Grade Submissions',
    category: 'Academic Administration',
    targetDate: 'Oct 31, 2026',
    progress: 75,
    milestones: [
      { id: 'm-1', text: 'Quizzes 1-3 graded & encoded', completed: true },
      { id: 'm-2', text: 'Midterm exam rubrics verified', completed: true },
      { id: 'm-3', text: 'Parent notifications sent for students under 75%', completed: true },
      { id: 'm-4', text: 'Final quarter encoding in Talibon Intra-Office', completed: false }
    ]
  },
  {
    id: 'g-2',
    workspaceId: 'ws-student-02',
    title: 'Maintain 90+ GPA in STEM Subjects',
    category: 'Academic Honors',
    targetDate: 'Dec 15, 2026',
    progress: 82,
    milestones: [
      { id: 'sm-1', text: 'Complete all calculus problem sets on time', completed: true },
      { id: 'sm-2', text: 'Score 90+ on Chemistry midterm', completed: true },
      { id: 'sm-3', text: 'Submit Physics term paper 3 days early', completed: false }
    ]
  }
];

export const INITIAL_CLASSES: TeacherClass[] = [
  {
    id: 'c-1',
    workspaceId: 'ws-teacher-01',
    name: 'Grade 7 — Newton',
    subject: 'Earth Science',
    schedule: 'Mon / Wed / Fri · 08:00 - 09:30 AM',
    room: 'Room 204',
    averageGrade: 88.4,
    trend: 'improving',
    studentsCount: 34
  },
  {
    id: 'c-2',
    workspaceId: 'ws-teacher-01',
    name: 'Grade 8 — Galileo',
    subject: 'Cell Biology & Genetics',
    schedule: 'Tue / Thu · 10:00 - 11:45 AM',
    room: 'Lab B',
    averageGrade: 82.1,
    trend: 'consistent',
    studentsCount: 31
  },
  {
    id: 'c-3',
    workspaceId: 'ws-teacher-01',
    name: 'Grade 9 — Einstein',
    subject: 'Introductory Physics',
    schedule: 'Mon / Wed · 01:00 - 02:30 PM',
    room: 'Lecture Hall 1',
    averageGrade: 79.6,
    trend: 'needs_attention',
    studentsCount: 29
  }
];

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'st-1',
    workspaceId: 'ws-teacher-01',
    classId: 'c-3',
    name: 'Rafael Mercado',
    gradeLevel: 'Grade 9 - Einstein',
    averageGrade: 71.5,
    trend: 'declining',
    notes: 'Missed 2 homework assignments and scored 68 on Kinematics quiz. Needs peer tutoring.',
    attendanceRate: 84,
    needsAttention: true
  },
  {
    id: 'st-2',
    workspaceId: 'ws-teacher-01',
    classId: 'c-3',
    name: 'Chloe Alcantara',
    gradeLevel: 'Grade 9 - Einstein',
    averageGrade: 74.0,
    trend: 'needs_attention',
    notes: 'Shows good conceptual grasp in discussions, struggles with numeric word problems.',
    attendanceRate: 91,
    needsAttention: true
  },
  {
    id: 'st-3',
    workspaceId: 'ws-teacher-01',
    classId: 'c-1',
    name: 'Hannah Cruz',
    gradeLevel: 'Grade 7 - Newton',
    averageGrade: 96.2,
    trend: 'improving',
    notes: 'Exemplary project on Plate Tectonics. Recommended for Regional Science Olympiad.',
    attendanceRate: 100,
    needsAttention: false
  },
  {
    id: 'st-4',
    workspaceId: 'ws-teacher-01',
    classId: 'c-2',
    name: 'Joshua Tan',
    gradeLevel: 'Grade 8 - Galileo',
    averageGrade: 85.0,
    trend: 'improving',
    notes: 'Significant improvement in lab notebook entries this week.',
    attendanceRate: 96,
    needsAttention: false
  }
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-1',
    workspaceId: 'ws-teacher-01',
    title: 'Plate Tectonics & Seismic Waves',
    classSubject: 'Grade 7 — Earth Science',
    date: '2026-10-06',
    templateType: 'Hands-on Lab',
    status: 'ready',
    objectives: [
      'Differentiate between P-waves, S-waves and surface waves',
      'Simulate wave propagation using Slinky springs',
      'Calculate epicenter distance using time-travel graphs'
    ],
    materials: ['Slinky springs (6 pairs)', 'Stopwatches', 'Printed seismograms'],
    procedure: [
      { phase: 'Motivation & Hook', description: 'Show 2-minute footage of recent Philippine earthquake drill', durationMin: 10 },
      { phase: 'Hands-on Activity', description: 'Students model transverse vs longitudinal waves in groups of 5', durationMin: 25 },
      { phase: 'Generalization & Synthesis', description: 'Interactive whiteboard recap connecting wavelength to speed', durationMin: 15 },
      { phase: 'Formative Assessment', description: '5-item quick quiz on wave properties', durationMin: 10 }
    ],
    assessment: '5-item exit ticket + lab worksheet completion rubric'
  },
  {
    id: 'lp-2',
    workspaceId: 'ws-teacher-01',
    title: 'Mitosis vs Meiosis Cell Division',
    classSubject: 'Grade 8 — Cell Biology',
    date: '2026-10-08',
    templateType: 'Interactive Discussion',
    status: 'draft',
    objectives: [
      'Identify stages of mitosis under a microscope',
      'Explain chromosomal alignment differences in meiosis'
    ],
    materials: ['Prepared onion root tip slides', 'Microscopes (12 units)'],
    procedure: [
      { phase: 'Prior Knowledge Check', description: 'Recall cell organelles and DNA structure', durationMin: 10 },
      { phase: 'Guided Observation', description: 'Focus high-power objective on anaphase chromosomes', durationMin: 30 }
    ],
    assessment: 'Drawn and labeled cell cycle diagram rubric'
  }
];

export const INITIAL_ASSIGNMENTS: StudentAssignment[] = [
  {
    id: 'as-1',
    workspaceId: 'ws-student-02',
    subject: 'Advanced Calculus',
    title: 'Problem Set #4: Integration by Parts',
    deadline: 'Tonight, 11:59 PM',
    priority: 'urgent',
    estimatedHours: 2.5,
    status: 'in_progress',
    group: 'today'
  },
  {
    id: 'as-2',
    workspaceId: 'ws-student-02',
    subject: 'Analytical Chemistry',
    title: 'Acid-Base Titration Lab Synthesis',
    deadline: 'Tomorrow, 5:00 PM',
    priority: 'high',
    estimatedHours: 3.0,
    status: 'not_started',
    group: 'this_week'
  },
  {
    id: 'as-3',
    workspaceId: 'ws-student-02',
    subject: 'World Literature',
    title: 'Comparative Essay on Post-Colonial Narratives',
    deadline: 'Friday, 11:59 PM',
    priority: 'medium',
    estimatedHours: 4.0,
    status: 'not_started',
    group: 'this_week'
  },
  {
    id: 'as-4',
    workspaceId: 'ws-student-02',
    subject: 'Physics for Engineers',
    title: 'Rotational Dynamics Problem Set',
    deadline: 'Next Tuesday',
    priority: 'low',
    estimatedHours: 3.5,
    status: 'not_started',
    group: 'later'
  }
];

export const INITIAL_PRODUCTS: BusinessProduct[] = [
  {
    id: 'bp-1',
    workspaceId: 'ws-business-03',
    name: 'Bohol Handwoven Rattan Basket (Medium)',
    sku: 'RATT-M-01',
    stock: 4,
    minStock: 10,
    costPrice: 280,
    sellingPrice: 550
  },
  {
    id: 'bp-2',
    workspaceId: 'ws-business-03',
    name: 'Artisan Coconut Shell Candle (Vanilla)',
    sku: 'CNDL-COC-02',
    stock: 2,
    minStock: 8,
    costPrice: 95,
    sellingPrice: 220
  },
  {
    id: 'bp-3',
    workspaceId: 'ws-business-03',
    name: 'Handcrafted Abaca Tote Bag',
    sku: 'BAG-ABA-03',
    stock: 24,
    minStock: 12,
    costPrice: 320,
    sellingPrice: 680
  },
  {
    id: 'bp-4',
    workspaceId: 'ws-business-03',
    name: 'Organic Honey from Talibon Highlands (350ml)',
    sku: 'HNY-ORG-04',
    stock: 18,
    minStock: 15,
    costPrice: 160,
    sellingPrice: 320
  }
];

export const INITIAL_SALES: BusinessSale[] = [
  {
    id: 'bs-1',
    workspaceId: 'ws-business-03',
    customerName: 'Elena Gomez',
    items: '2x Artisan Coconut Candles, 1x Abaca Tote',
    totalAmount: 1120,
    profit: 610,
    date: 'Today, 10:15 AM'
  },
  {
    id: 'bs-2',
    workspaceId: 'ws-business-03',
    customerName: 'Dr. Raymond Lim',
    items: '3x Organic Honey 350ml',
    totalAmount: 960,
    profit: 480,
    date: 'Today, 11:40 AM'
  }
];

export const INITIAL_FINANCE: FinanceSummary = {
  workspaceId: 'ws-business-03',
  monthlyIncome: 84500,
  monthlyExpenses: 46200,
  savingsRate: 45.3,
  recentTransactions: [
    { id: 'ft-1', description: 'Store POS Sales Batch 10-04', amount: 4850, type: 'income', category: 'Retail', date: '2026-10-04' },
    { id: 'ft-2', description: 'Raw Material Delivery: Abaca Fiber', amount: 7200, type: 'expense', category: 'Supplies', date: '2026-10-03' },
    { id: 'ft-3', description: 'Online Store Shopee Payout', amount: 14200, type: 'income', category: 'E-commerce', date: '2026-10-02' },
    { id: 'ft-4', description: 'Workshop Utilities & Electricity', amount: 3800, type: 'expense', category: 'Utilities', date: '2026-10-01' }
  ]
};

export const INITIAL_TRACKERS: CustomTracker[] = [
  {
    id: 'tr-1',
    workspaceId: 'ws-teacher-01',
    title: 'Daily Water Intake',
    unit: 'glasses',
    targetDaily: 8,
    streak: 12,
    todayValue: 6,
    logs: [
      { date: '2026-10-01', value: 8 },
      { date: '2026-10-02', value: 9 },
      { date: '2026-10-03', value: 8 },
      { date: '2026-10-04', value: 6 }
    ]
  },
  {
    id: 'tr-2',
    workspaceId: 'ws-student-02',
    title: 'Deep Study Focus',
    unit: 'hours',
    targetDaily: 4,
    streak: 5,
    todayValue: 3,
    logs: [
      { date: '2026-10-01', value: 4.5 },
      { date: '2026-10-02', value: 4.0 },
      { date: '2026-10-03', value: 5.0 },
      { date: '2026-10-04', value: 3.0 }
    ]
  }
];
