import React, { createContext, useContext, useState, useEffect } from 'react';
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
import {
  INITIAL_WORKSPACES,
  INITIAL_TASKS,
  INITIAL_NOTES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_GOALS,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_LESSON_PLANS,
  INITIAL_ASSIGNMENTS,
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_FINANCE,
  INITIAL_TRACKERS,
  ROLE_TEMPLATES
} from '../data/initialData';

export type AppView =
  | 'dashboard'
  | 'tasks'
  | 'notes'
  | 'calendar'
  | 'goals'
  | 'classes'
  | 'lesson_plans'
  | 'assignments'
  | 'sales_inventory'
  | 'finance'
  | 'trackers'
  | 'analytics'
  | 'settings';

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeWorkspace: Workspace;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  editMode: boolean;
  setEditMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isCustomizeOpen: boolean;
  setIsCustomizeOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (val: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (val: boolean) => void;

  // Workspace actions
  switchWorkspace: (id: string) => void;
  createWorkspaceFromRole: (name: string, role: UserRole, icon: string, color: string) => string;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  toggleModule: (module: ModuleKey) => void;
  setPriorityTopic: (topic: string) => void;

  // Widget actions
  addWidget: (type: WidgetType, title?: string, w?: number, h?: number) => void;
  removeWidget: (id: string) => void;
  moveWidget: (id: string, direction: 'up' | 'down') => void;
  resizeWidget: (id: string, w: number, h?: number) => void;

  // Domain collections & actions
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'workspaceId'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  notes: NoteItem[];
  addNote: (note: Omit<NoteItem, 'id' | 'updatedAt' | 'workspaceId'>) => void;
  togglePinNote: (id: string) => void;
  deleteNote: (id: string) => void;

  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'workspaceId'>) => void;
  deleteEvent: (id: string) => void;

  goals: GoalItem[];
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addGoal: (goal: Omit<GoalItem, 'id' | 'workspaceId'>) => void;

  classes: TeacherClass[];
  students: StudentRecord[];
  updateStudentNotes: (studentId: string, notes: string) => void;
  updateStudentTrend: (studentId: string, trend: StudentRecord['trend'], needsAttention: boolean) => void;

  lessonPlans: LessonPlan[];
  addLessonPlan: (plan: Omit<LessonPlan, 'id' | 'workspaceId'>) => void;
  duplicateLessonPlan: (id: string) => void;
  updateLessonPlanStatus: (id: string, status: LessonPlan['status']) => void;

  assignments: StudentAssignment[];
  addAssignment: (asgn: Omit<StudentAssignment, 'id' | 'workspaceId'>) => void;
  updateAssignmentStatus: (id: string, status: StudentAssignment['status']) => void;

  products: BusinessProduct[];
  adjustStock: (id: string, amount: number) => void;

  sales: BusinessSale[];
  addSale: (sale: Omit<BusinessSale, 'id' | 'workspaceId'>) => void;

  finance: FinanceSummary;
  addTransaction: (desc: string, amount: number, type: 'income' | 'expense', category: string) => void;

  trackers: CustomTracker[];
  logTracker: (id: string, delta: number) => void;

  resetToDefaults: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('talibon_workspaces');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    const saved = localStorage.getItem('talibon_active_ws');
    return saved && INITIAL_WORKSPACES.some(w => w.id === saved)
      ? saved
      : INITIAL_WORKSPACES[0]?.id || 'ws-teacher-01';
  });

  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('talibon_onboarding_done');
  });

  // Domain states
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('talibon_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('talibon_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('talibon_events');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [goals, setGoals] = useState<GoalItem[]>(() => {
    const saved = localStorage.getItem('talibon_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [classes, setClasses] = useState<TeacherClass[]>(() => {
    const saved = localStorage.getItem('talibon_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('talibon_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => {
    const saved = localStorage.getItem('talibon_lesson_plans');
    return saved ? JSON.parse(saved) : INITIAL_LESSON_PLANS;
  });

  const [assignments, setAssignments] = useState<StudentAssignment[]>(() => {
    const saved = localStorage.getItem('talibon_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [products, setProducts] = useState<BusinessProduct[]>(() => {
    const saved = localStorage.getItem('talibon_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<BusinessSale[]>(() => {
    const saved = localStorage.getItem('talibon_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [finance, setFinance] = useState<FinanceSummary>(() => {
    const saved = localStorage.getItem('talibon_finance');
    return saved ? JSON.parse(saved) : INITIAL_FINANCE;
  });

  const [trackers, setTrackers] = useState<CustomTracker[]>(() => {
    const saved = localStorage.getItem('talibon_trackers');
    return saved ? JSON.parse(saved) : INITIAL_TRACKERS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('talibon_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('talibon_active_ws', activeWorkspaceId);
  }, [activeWorkspaceId]);

  useEffect(() => {
    localStorage.setItem('talibon_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('talibon_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('talibon_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('talibon_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('talibon_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('talibon_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('talibon_lesson_plans', JSON.stringify(lessonPlans));
  }, [lessonPlans]);

  useEffect(() => {
    localStorage.setItem('talibon_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('talibon_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('talibon_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('talibon_finance', JSON.stringify(finance));
  }, [finance]);

  useEffect(() => {
    localStorage.setItem('talibon_trackers', JSON.stringify(trackers));
  }, [trackers]);

  const activeWorkspace =
    workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0] || INITIAL_WORKSPACES[0];

  const switchWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    setActiveView('dashboard');
  };

  const createWorkspaceFromRole = (
    name: string,
    role: UserRole,
    icon: string,
    color: string
  ): string => {
    const template = ROLE_TEMPLATES.find(t => t.role === role) || ROLE_TEMPLATES[0];
    const newId = `ws-${Date.now().toString(36)}`;
    const newWidgets: WidgetInstance[] = template.defaultWidgets.map((w, idx) => ({
      id: `w-${newId}-${idx}`,
      type: w.type,
      title: w.title,
      w: w.w,
      h: w.h,
      position: idx
    }));

    const newWs: Workspace = {
      id: newId,
      name,
      role,
      icon,
      color,
      modules: [...template.defaultModules],
      widgets: newWidgets,
      createdAt: new Date().toISOString()
    };

    setWorkspaces(prev => [...prev, newWs]);
    setActiveWorkspaceId(newId);
    setActiveView('dashboard');
    return newId;
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => prev.map(w => (w.id === id ? { ...w, ...updates } : w)));
  };

  const deleteWorkspace = (id: string) => {
    if (workspaces.length <= 1) return;
    setWorkspaces(prev => {
      const next = prev.filter(w => w.id !== id);
      if (activeWorkspaceId === id) {
        setActiveWorkspaceId(next[0].id);
      }
      return next;
    });
  };

  const toggleModule = (module: ModuleKey) => {
    setWorkspaces(prev =>
      prev.map(w => {
        if (w.id !== activeWorkspaceId) return w;
        const exists = w.modules.includes(module);
        return {
          ...w,
          modules: exists ? w.modules.filter(m => m !== module) : [...w.modules, module]
        };
      })
    );
  };

  const setPriorityTopic = (topic: string) => {
    updateWorkspace(activeWorkspaceId, { priorityTopic: topic });
  };

  const addWidget = (type: WidgetType, title?: string, w: number = 2, h: number = 2) => {
    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.id !== activeWorkspaceId) return ws;
        const newWidget: WidgetInstance = {
          id: `w-${Date.now().toString(36)}`,
          type,
          title: title || type.replace('_', ' ').toUpperCase(),
          w,
          h,
          position: ws.widgets.length
        };
        return {
          ...ws,
          widgets: [...ws.widgets, newWidget]
        };
      })
    );
  };

  const removeWidget = (id: string) => {
    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.id !== activeWorkspaceId) return ws;
        return {
          ...ws,
          widgets: ws.widgets.filter(w => w.id !== id)
        };
      })
    );
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.id !== activeWorkspaceId) return ws;
        const index = ws.widgets.findIndex(w => w.id === id);
        if (index === -1) return ws;
        if (direction === 'up' && index === 0) return ws;
        if (direction === 'down' && index === ws.widgets.length - 1) return ws;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...ws.widgets];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        return {
          ...ws,
          widgets: updated.map((w, i) => ({ ...w, position: i }))
        };
      })
    );
  };

  const resizeWidget = (id: string, w: number, h: number = 2) => {
    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.id !== activeWorkspaceId) return ws;
        return {
          ...ws,
          widgets: ws.widgets.map(widget => (widget.id === id ? { ...widget, w, h } : widget))
        };
      })
    );
  };

  // Domain Actions
  const addTask = (task: Omit<TaskItem, 'id' | 'createdAt' | 'workspaceId'>) => {
    const newTask: TaskItem = {
      ...task,
      id: `t-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addNote = (note: Omit<NoteItem, 'id' | 'updatedAt' | 'workspaceId'>) => {
    const newNote: NoteItem = {
      ...note,
      id: `n-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addEvent = (event: Omit<CalendarEvent, 'id' | 'workspaceId'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `e-${Date.now()}`,
      workspaceId: activeWorkspaceId
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);
        return {
          ...g,
          milestones: updatedMilestones,
          progress
        };
      })
    );
  };

  const addGoal = (goal: Omit<GoalItem, 'id' | 'workspaceId'>) => {
    const newGoal: GoalItem = {
      ...goal,
      id: `g-${Date.now()}`,
      workspaceId: activeWorkspaceId
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateStudentNotes = (studentId: string, notes: string) => {
    setStudents(prev => prev.map(s => (s.id === studentId ? { ...s, notes } : s)));
  };

  const updateStudentTrend = (
    studentId: string,
    trend: StudentRecord['trend'],
    needsAttention: boolean
  ) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, trend, needsAttention } : s))
    );
  };

  const addLessonPlan = (plan: Omit<LessonPlan, 'id' | 'workspaceId'>) => {
    const newPlan: LessonPlan = {
      ...plan,
      id: `lp-${Date.now()}`,
      workspaceId: activeWorkspaceId
    };
    setLessonPlans(prev => [newPlan, ...prev]);
  };

  const duplicateLessonPlan = (id: string) => {
    const target = lessonPlans.find(lp => lp.id === id);
    if (!target) return;
    const duplicated: LessonPlan = {
      ...target,
      id: `lp-${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: 'draft'
    };
    setLessonPlans(prev => [duplicated, ...prev]);
  };

  const updateLessonPlanStatus = (id: string, status: LessonPlan['status']) => {
    setLessonPlans(prev => prev.map(lp => (lp.id === id ? { ...lp, status } : lp)));
  };

  const addAssignment = (asgn: Omit<StudentAssignment, 'id' | 'workspaceId'>) => {
    const newAsgn: StudentAssignment = {
      ...asgn,
      id: `as-${Date.now()}`,
      workspaceId: activeWorkspaceId
    };
    setAssignments(prev => [newAsgn, ...prev]);
  };

  const updateAssignmentStatus = (id: string, status: StudentAssignment['status']) => {
    setAssignments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
  };

  const adjustStock = (id: string, amount: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p))
    );
  };

  const addSale = (sale: Omit<BusinessSale, 'id' | 'workspaceId'>) => {
    const newSale: BusinessSale = {
      ...sale,
      id: `bs-${Date.now()}`,
      workspaceId: activeWorkspaceId
    };
    setSales(prev => [newSale, ...prev]);
  };

  const addTransaction = (
    desc: string,
    amount: number,
    type: 'income' | 'expense',
    category: string
  ) => {
    setFinance(prev => ({
      ...prev,
      recentTransactions: [
        {
          id: `ft-${Date.now()}`,
          description: desc,
          amount,
          type,
          category,
          date: new Date().toISOString().split('T')[0]
        },
        ...prev.recentTransactions
      ]
    }));
  };

  const logTracker = (id: string, delta: number) => {
    setTrackers(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const newToday = Math.max(0, t.todayValue + delta);
        return {
          ...t,
          todayValue: newToday
        };
      })
    );
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setWorkspaces(INITIAL_WORKSPACES);
    setActiveWorkspaceId(INITIAL_WORKSPACES[0].id);
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    setEvents(INITIAL_CALENDAR_EVENTS);
    setGoals(INITIAL_GOALS);
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setLessonPlans(INITIAL_LESSON_PLANS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setProducts(INITIAL_PRODUCTS);
    setSales(INITIAL_SALES);
    setFinance(INITIAL_FINANCE);
    setTrackers(INITIAL_TRACKERS);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        activeView,
        setActiveView,
        editMode,
        setEditMode,
        isCustomizeOpen,
        setIsCustomizeOpen,
        searchQuery,
        setSearchQuery,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        switchWorkspace,
        createWorkspaceFromRole,
        updateWorkspace,
        deleteWorkspace,
        toggleModule,
        setPriorityTopic,
        addWidget,
        removeWidget,
        moveWidget,
        resizeWidget,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        notes,
        addNote,
        togglePinNote,
        deleteNote,
        events,
        addEvent,
        deleteEvent,
        goals,
        toggleMilestone,
        addGoal,
        classes,
        students,
        updateStudentNotes,
        updateStudentTrend,
        lessonPlans,
        addLessonPlan,
        duplicateLessonPlan,
        updateLessonPlanStatus,
        assignments,
        addAssignment,
        updateAssignmentStatus,
        products,
        adjustStock,
        sales,
        addSale,
        finance,
        addTransaction,
        trackers,
        logTracker,
        resetToDefaults
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
