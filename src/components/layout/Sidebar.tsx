import React, { useRef } from 'react';
import { useWorkspace, AppView } from '../../context/WorkspaceContext';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  Target,
  GraduationCap,
  BookOpen,
  Store,
  Wallet,
  Activity,
  BarChart3,
  Settings,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const drawerRef = useRef<HTMLDialogElement>(null);
  const {
    activeView,
    setActiveView,
    activeWorkspace,
    tasks,
    assignments,
    resetToDefaults
  } = useWorkspace();

  const openTasksCount = tasks.filter(
    t => t.workspaceId === activeWorkspace.id && t.status !== 'done'
  ).length;

  const openAssignmentsCount = assignments.filter(
    a => a.workspaceId === activeWorkspace.id && a.status !== 'submitted'
  ).length;

  const hasModule = (mod: string) => activeWorkspace.modules.includes(mod as any);

  interface NavItem {
    id: AppView;
    label: string;
    icon: React.ReactNode;
    show: boolean;
    badge?: number;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      show: true
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      show: hasModule('tasks'),
      badge: openTasksCount > 0 ? openTasksCount : undefined
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <FileText className="w-4 h-4" />,
      show: hasModule('notes')
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-4 h-4" />,
      show: hasModule('calendar')
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: <Target className="w-4 h-4" />,
      show: hasModule('goals')
    },
    // Teacher specific
    {
      id: 'classes',
      label: 'Classes & Gradebook',
      icon: <GraduationCap className="w-4 h-4 text-blue-500" />,
      show: hasModule('classes')
    },
    {
      id: 'lesson_plans',
      label: 'Lesson Plans',
      icon: <BookOpen className="w-4 h-4 text-indigo-500" />,
      show: hasModule('lesson_plans')
    },
    // Student specific
    {
      id: 'assignments',
      label: 'Assignments & Workload',
      icon: <BookOpen className="w-4 h-4 text-purple-500" />,
      show: hasModule('assignments'),
      badge: openAssignmentsCount > 0 ? openAssignmentsCount : undefined
    },
    // Business specific
    {
      id: 'sales_inventory',
      label: 'Sales & Inventory',
      icon: <Store className="w-4 h-4 text-emerald-500" />,
      show: hasModule('sales') || hasModule('inventory')
    },
    // Finance
    {
      id: 'finance',
      label: 'Finance',
      icon: <Wallet className="w-4 h-4 text-amber-500" />,
      show: hasModule('finance')
    },
    // Custom Trackers
    {
      id: 'trackers',
      label: 'Custom Trackers',
      icon: <Activity className="w-4 h-4 text-pink-500" />,
      show: hasModule('trackers')
    },
    // Analytics
    {
      id: 'analytics',
      label: 'Progress & Trends',
      icon: <BarChart3 className="w-4 h-4" />,
      show: hasModule('analytics')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      show: true
    }
  ];

  const panel = (
    <aside className="floating-sidebar flex flex-col flex-shrink-0" aria-label="Workspace navigation">
      {/* Workspace Role Header */}
      <div className="sidebar-identity">
        <div className="flex items-center gap-3">
          <div
            className="workspace-avatar w-10 h-10 rounded-xl flex items-center justify-center font-bold"
          >
            {activeWorkspace.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-slate-800 truncate" title={activeWorkspace.name}>
              {activeWorkspace.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-slate-400 font-medium capitalize">
                {activeWorkspace.role} Mode
              </span>
            </div>
          </div>
        </div>

        {activeWorkspace.priorityTopic && (
          <div className="sidebar-focus mt-5 px-3 py-2.5 rounded-xl flex items-center justify-between text-xs gap-2">
            <span className="text-slate-400">Focus:</span>
            <span className="text-indigo-600 font-medium truncate" title={activeWorkspace.priorityTopic}>
              {activeWorkspace.priorityTopic}
            </span>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav flex-1 overflow-y-auto space-y-1" aria-label="Workspace modules">
        <div className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace Modules
        </div>
        {navItems
          .filter(item => item.show)
          .map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); drawerRef.current?.close(); }}
                aria-current={isActive ? 'page' : undefined}
                className={`sidebar-link w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'is-active'
                    : 'text-slate-600 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/80 text-indigo-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      {/* Footer Info */}
      <div className="sidebar-footer text-xs">
        <div className="rounded-xl p-3 bg-white/50">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Modules active</span>
            <span className="text-slate-600 font-medium">
              {activeWorkspace.modules.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Active widgets</span>
            <span className="text-slate-600 font-medium">
              {activeWorkspace.widgets.length}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset workspace data to factory defaults?')) {
              resetToDefaults();
            }
          }}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-white/70 rounded-xl transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </aside>
  );

  return <>
    <div className="desktop-sidebar">{panel}</div>
    <button className="mobile-menu" onClick={() => drawerRef.current?.showModal()} aria-label="Open navigation"><Menu size={20} /></button>
    <dialog ref={drawerRef} className="sidebar-drawer" aria-label="Workspace navigation" onClick={event => { if (event.target === event.currentTarget) drawerRef.current?.close(); }}>
      <button className="drawer-close" onClick={() => drawerRef.current?.close()} aria-label="Close navigation"><X size={18} /></button>
      {panel}
    </dialog>
  </>;
};
