import React from 'react';
import { WidgetInstance } from '../../types/workspace';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  CheckSquare,
  GraduationCap,
  AlertCircle,
  ClipboardCheck,
  Award,
  BookOpen,
  Clock,
  PieChart,
  Calendar,
  FileText,
  Target,
  Sparkles,
  ShoppingBag,
  AlertTriangle,
  Wallet,
  Activity,
  Users,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  Trash2,
  Flame
} from 'lucide-react';

// Widget components
import { TaskListWidget } from './widgets/TaskListWidget';
import { ClassesTodayWidget } from './widgets/ClassesTodayWidget';
import { StudentsAttentionWidget } from './widgets/StudentsAttentionWidget';
import { PendingGradesWidget } from './widgets/PendingGradesWidget';
import { ClassAverageWidget } from './widgets/ClassAverageWidget';
import { LessonPlansWeekWidget } from './widgets/LessonPlansWeekWidget';
import { AssignmentsDueWidget } from './widgets/AssignmentsDueWidget';
import { WorkloadHoursWidget } from './widgets/WorkloadHoursWidget';
import { FocusTimeWidget } from './widgets/FocusTimeWidget';
import { CalendarTodayWidget } from './widgets/CalendarTodayWidget';
import { NotesRecentWidget } from './widgets/NotesRecentWidget';
import { GoalProgressWidget } from './widgets/GoalProgressWidget';
import { ProgressSummaryWidget } from './widgets/ProgressSummaryWidget';
import { SalesTodayWidget } from './widgets/SalesTodayWidget';
import { LowStockWidget } from './widgets/LowStockWidget';
import { FinanceSummaryWidget } from './widgets/FinanceSummaryWidget';
import { TrackerCardWidget } from './widgets/TrackerCardWidget';
import { WeeklyGoalWidget } from './widgets/WeeklyGoalWidget';
import { CustomersCountWidget } from './widgets/CustomersCountWidget';

interface WidgetContainerProps {
  widget: WidgetInstance;
  workspaceId: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ widget, workspaceId }) => {
  const { editMode, removeWidget, moveWidget, resizeWidget } = useWorkspace();

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'task_list':
      case 'task_progress':
        return <CheckSquare className="w-4 h-4 text-indigo-500" />;
      case 'classes_today':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'students_attention':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'pending_grades':
        return <ClipboardCheck className="w-4 h-4 text-indigo-500" />;
      case 'class_average':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'lesson_plans_week':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'assignments_due':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'workload_hours':
        return <PieChart className="w-4 h-4 text-purple-500" />;
      case 'focus_time':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'calendar_today':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'notes_recent':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'goal_progress':
      case 'weekly_goal':
        return <Target className="w-4 h-4 text-indigo-500" />;
      case 'progress_summary':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      case 'sales_today':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'customers_count':
        return <Users className="w-4 h-4 text-emerald-500" />;
      case 'finance_summary':
        return <Wallet className="w-4 h-4 text-amber-500" />;
      case 'tracker_card':
        return <Activity className="w-4 h-4 text-pink-500" />;
      default:
        return <CheckSquare className="w-4 h-4 text-slate-500" />;
    }
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'task_list':
      case 'task_progress':
        return <TaskListWidget workspaceId={workspaceId} />;
      case 'classes_today':
        return <ClassesTodayWidget workspaceId={workspaceId} />;
      case 'students_attention':
        return <StudentsAttentionWidget workspaceId={workspaceId} />;
      case 'pending_grades':
        return <PendingGradesWidget workspaceId={workspaceId} />;
      case 'class_average':
        return <ClassAverageWidget workspaceId={workspaceId} />;
      case 'lesson_plans_week':
        return <LessonPlansWeekWidget workspaceId={workspaceId} />;
      case 'assignments_due':
        return <AssignmentsDueWidget workspaceId={workspaceId} />;
      case 'workload_hours':
        return <WorkloadHoursWidget workspaceId={workspaceId} />;
      case 'focus_time':
        return <FocusTimeWidget workspaceId={workspaceId} />;
      case 'calendar_today':
        return <CalendarTodayWidget workspaceId={workspaceId} />;
      case 'notes_recent':
        return <NotesRecentWidget workspaceId={workspaceId} />;
      case 'goal_progress':
        return <GoalProgressWidget workspaceId={workspaceId} />;
      case 'weekly_goal':
        return <WeeklyGoalWidget workspaceId={workspaceId} />;
      case 'progress_summary':
        return <ProgressSummaryWidget workspaceId={workspaceId} />;
      case 'sales_today':
        return <SalesTodayWidget workspaceId={workspaceId} />;
      case 'low_stock':
        return <LowStockWidget workspaceId={workspaceId} />;
      case 'customers_count':
        return <CustomersCountWidget workspaceId={workspaceId} />;
      case 'finance_summary':
        return <FinanceSummaryWidget workspaceId={workspaceId} />;
      case 'tracker_card':
        return <TrackerCardWidget workspaceId={workspaceId} />;
      default:
        return (
          <div className="p-4 text-xs text-slate-400 text-center">
            Custom widget: {widget.title}
          </div>
        );
    }
  };

  // Preserve the saved size preference within a spacious, single-column layout.
  const getColSpan = () => {
    switch (widget.w) {
      case 1:
        return 'widget-width-small';
      case 2:
        return 'widget-width-medium';
      case 3:
        return 'widget-width-wide';
      case 4:
      default:
        return 'widget-width-full';
    }
  };

  return (
    <div
      className={`widget-slot ${getColSpan()} transition-all duration-200 flex flex-col`}
      data-widget-type={widget.type}
    >
      <div
        className={`frost-card border flex flex-col relative transition-all ${
          editMode
            ? 'border-dashed border-amber-400 ring-2 ring-amber-100 bg-amber-50/20'
            : 'border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        {/* Widget Header */}
        <div className="widget-header flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="widget-icon">
              {getWidgetIcon(widget.type)}
            </span>
            <h3 className="widget-title">
              {widget.title}
            </h3>
          </div>

          {/* Edit Mode Toolbar */}
          {editMode ? (
            <div className="flex items-center gap-1 bg-amber-100/80 px-1.5 py-1 rounded-lg border border-amber-200">
              <button
                onClick={() => moveWidget(widget.id, 'up')}
                title="Move Earlier"
                className="p-1 hover:bg-amber-200 rounded text-amber-800 transition-colors"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveWidget(widget.id, 'down')}
                title="Move Later"
                className="p-1 hover:bg-amber-200 rounded text-amber-800 transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  const nextW = widget.w === 1 ? 2 : widget.w === 2 ? 4 : 1;
                  resizeWidget(widget.id, nextW);
                }}
                title={`Width: ${widget.w === 1 ? 'Small' : widget.w === 2 ? 'Medium' : 'Full'}`}
                className="p-1 hover:bg-amber-200 rounded text-amber-800 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => removeWidget(widget.id)}
                title="Remove widget"
                className="p-1 hover:bg-rose-200 rounded text-rose-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 capitalize">
                {widget.type.split('_')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Widget Body */}
        <div className="widget-body flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};
