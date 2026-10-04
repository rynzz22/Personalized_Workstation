import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ModuleKey, WidgetType } from '../../types/workspace';
import {
  X,
  Sliders,
  Layers,
  Plus,
  Check,
  Star,
  CheckSquare,
  GraduationCap,
  BookOpen,
  Store,
  Wallet,
  Activity,
  Calendar,
  FileText,
  Target,
  Sparkles,
  Flame,
  PieChart,
  ShoppingBag,
  Users
} from 'lucide-react';

interface CatalogItem {
  type: WidgetType;
  title: string;
  description: string;
  module: ModuleKey;
  recommendedRole: string;
  defaultW: number;
}

const WIDGET_CATALOG: CatalogItem[] = [
  {
    type: 'task_list',
    title: 'Tasks & Action Items',
    description: 'Quick task checkbox checklist with priority labels and due times',
    module: 'tasks',
    recommendedRole: 'All Roles',
    defaultW: 2
  },
  {
    type: 'calendar_today',
    title: "Today's Schedule & Agenda",
    description: 'Upcoming meetings, lectures, and time blocks for the current day',
    module: 'calendar',
    recommendedRole: 'All Roles',
    defaultW: 2
  },
  {
    type: 'notes_recent',
    title: 'Pinned & Quick Notes',
    description: 'Pin key guidelines, rubrics, meeting minutes, and journal entries',
    module: 'notes',
    recommendedRole: 'All Roles',
    defaultW: 2
  },
  {
    type: 'goal_progress',
    title: 'Goal Milestones Tracker',
    description: 'Progress bar and checklist for quarterly and personal milestones',
    module: 'goals',
    recommendedRole: 'All Roles',
    defaultW: 2
  },
  {
    type: 'progress_summary',
    title: 'Weekly Progress & Feedback',
    description: 'Intelligent momentum score with actionable feedback messages',
    module: 'analytics',
    recommendedRole: 'All Roles',
    defaultW: 2
  },
  // Teacher
  {
    type: 'classes_today',
    title: 'Teaching Schedule & Classes',
    description: 'Class roster overview with average grade, room, and period',
    module: 'classes',
    recommendedRole: 'Teacher',
    defaultW: 2
  },
  {
    type: 'students_attention',
    title: 'Students Needing Attention',
    description: 'Highlights students with declining grades or attendance alerts',
    module: 'classes',
    recommendedRole: 'Teacher',
    defaultW: 2
  },
  {
    type: 'pending_grades',
    title: 'Pending Submissions Queue',
    description: 'Count of ungraded student papers, lab reports, and assignments',
    module: 'classes',
    recommendedRole: 'Teacher',
    defaultW: 1
  },
  {
    type: 'class_average',
    title: 'Class Average & Academic Trend',
    description: 'Quarterly average score comparison with previous quarters',
    module: 'classes',
    recommendedRole: 'Teacher',
    defaultW: 1
  },
  {
    type: 'lesson_plans_week',
    title: 'Weekly Lesson Plans',
    description: 'Status cards for upcoming lectures, labs, and interactive activities',
    module: 'lesson_plans',
    recommendedRole: 'Teacher',
    defaultW: 2
  },
  // Student
  {
    type: 'assignments_due',
    title: 'Assignments Timeline',
    description: 'Categorized study tasks due today, this week, and later',
    module: 'assignments',
    recommendedRole: 'Student',
    defaultW: 2
  },
  {
    type: 'workload_hours',
    title: 'Workload & Study Hours',
    description: 'Estimated weekly study hours and identification of heaviest items',
    module: 'assignments',
    recommendedRole: 'Student',
    defaultW: 2
  },
  {
    type: 'weekly_goal',
    title: 'Review Hours Progress',
    description: 'Track weekly study hours against your target quota',
    module: 'goals',
    recommendedRole: 'Student / Employee',
    defaultW: 1
  },
  {
    type: 'focus_time',
    title: 'Pomodoro Focus Timer',
    description: '25-minute deep focus sprints with logged session counter',
    module: 'focus',
    recommendedRole: 'Student / Freelancer',
    defaultW: 1
  },
  // Business
  {
    type: 'sales_today',
    title: "Today's Gross Sales & Margin",
    description: 'Live order revenue tally and estimated net profit',
    module: 'sales',
    recommendedRole: 'Small Business',
    defaultW: 2
  },
  {
    type: 'low_stock',
    title: 'Critical Stock & Restock Alert',
    description: 'Notifies when inventory drops below safety thresholds',
    module: 'inventory',
    recommendedRole: 'Small Business',
    defaultW: 2
  },
  {
    type: 'customers_count',
    title: 'Active Customer Base',
    description: 'Active buyers and repeat purchase loyalty metrics',
    module: 'sales',
    recommendedRole: 'Small Business',
    defaultW: 1
  },
  {
    type: 'finance_summary',
    title: 'Monthly Cashflow Snapshot',
    description: 'Income, operating expenses, and monthly savings surplus rate',
    module: 'finance',
    recommendedRole: 'Business / Freelancer',
    defaultW: 1
  },
  {
    type: 'tracker_card',
    title: 'Custom Habits & Daily Streaks',
    description: 'Interactive counter for water, exercise, reading, or meditation',
    module: 'trackers',
    recommendedRole: 'Personal / All',
    defaultW: 2
  }
];

const MODULE_OPTIONS: { key: ModuleKey; label: string; description: string; icon: any }[] = [
  { key: 'tasks', label: 'Tasks & Projects', description: 'To-do management, priorities, and deadlines', icon: CheckSquare },
  { key: 'notes', label: 'Notes & Documents', description: 'Rich text notes, pinned docs, and quick thoughts', icon: FileText },
  { key: 'calendar', label: 'Calendar & Agenda', description: 'Day/week time blocks and scheduling', icon: Calendar },
  { key: 'goals', label: 'Goals & Milestones', description: 'Target setting and milestone checklists', icon: Target },
  { key: 'classes', label: 'Classes & Gradebook', description: 'Teacher class roster, grades, and attendance', icon: GraduationCap },
  { key: 'lesson_plans', label: 'Lesson Plan Manager', description: 'Structured lesson plans with reusable templates', icon: BookOpen },
  { key: 'assignments', label: 'Assignments & Deadlines', description: 'Student homework timeline and workload tracking', icon: BookOpen },
  { key: 'sales', label: 'Sales & Orders', description: 'Store transactions, revenue, and order tracking', icon: Store },
  { key: 'inventory', label: 'Inventory & Stock', description: 'Product catalog, stock levels, and low-stock alerts', icon: ShoppingBag },
  { key: 'finance', label: 'Finance & Cashflow', description: 'Income, expenses, and savings rate overview', icon: Wallet },
  { key: 'trackers', label: 'Custom Trackers', description: 'Daily habits, streaks, and quantified metrics', icon: Activity },
  { key: 'focus', label: 'Focus & Pomodoro', description: 'Deep work sprint timer and session logs', icon: Flame },
  { key: 'analytics', label: 'Progress & Momentum', description: 'Trend analytics and performance feedback', icon: Sparkles }
];

export const CustomizeDrawer: React.FC = () => {
  const {
    isCustomizeOpen,
    setIsCustomizeOpen,
    activeWorkspace,
    toggleModule,
    addWidget,
    setPriorityTopic,
    setEditMode
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'widgets' | 'modules' | 'priority'>('widgets');

  if (!isCustomizeOpen) return null;

  const existingTypes = new Set(activeWorkspace.widgets.map(w => w.type));

  const priorityOptions = [
    'Tasks & Action Items',
    'Students & Grading',
    'Lesson Planning',
    'Assignments & Deadlines',
    'Sales & Inventory',
    'Cashflow & Budget',
    'Habits & Personal Goals'
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={() => setIsCustomizeOpen(false)}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Customize Workspace</h3>
              <p className="text-xs text-slate-500">
                Tailor modules, widgets & priority for {activeWorkspace.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomizeOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('widgets')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'widgets'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Add Widgets ({WIDGET_CATALOG.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'modules'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Modules ({activeWorkspace.modules.length}/{MODULE_OPTIONS.length})
          </button>
          <button
            onClick={() => setActiveTab('priority')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'priority'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Priority Focus
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'widgets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Click to add tiles onto your dashboard</span>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setIsCustomizeOpen(false);
                  }}
                  className="text-amber-600 font-semibold hover:underline"
                >
                  Enter Arrange Mode →
                </button>
              </div>

              {WIDGET_CATALOG.map(item => {
                const isAlreadyAdded = existingTypes.has(item.type);
                const isModuleEnabled = activeWorkspace.modules.includes(item.module);

                return (
                  <div
                    key={item.type}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {item.recommendedRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">
                        Module: <span className="font-semibold text-slate-600 capitalize">{item.module}</span>
                      </span>

                      <button
                        onClick={() => {
                          if (!isModuleEnabled) {
                            toggleModule(item.module);
                          }
                          addWidget(item.type, item.title, item.defaultW, 2);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isAlreadyAdded
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAlreadyAdded ? 'Add Another Copy' : 'Add to Dashboard'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500 mb-2">
                Enable or disable functional blocks. Enabling a module unlocks its sidebar tools and widgets.
              </p>
              {MODULE_OPTIONS.map(mod => {
                const isEnabled = activeWorkspace.modules.includes(mod.key);
                const IconComponent = mod.icon;
                return (
                  <div
                    key={mod.key}
                    onClick={() => toggleModule(mod.key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isEnabled
                        ? 'bg-indigo-50/50 border-indigo-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isEnabled
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900">{mod.label}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{mod.description}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all flex-shrink-0 ${
                        isEnabled
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isEnabled && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'priority' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">What matters most right now?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecting a priority gives your workspace clarity and highlights relevant widgets.
                </p>
              </div>

              <div className="space-y-2">
                {priorityOptions.map(p => {
                  const isSelected = activeWorkspace.priorityTopic === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPriorityTopic(p)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Star
                          className={`w-4 h-4 ${
                            isSelected ? 'text-indigo-600 fill-indigo-600' : 'text-slate-300'
                          }`}
                        />
                        {p}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Changes autosave</span>
          <button
            onClick={() => setIsCustomizeOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
};
