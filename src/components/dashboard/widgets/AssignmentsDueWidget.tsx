import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export const AssignmentsDueWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { assignments, updateAssignmentStatus, setActiveView } = useWorkspace();
  const wsAssignments = assignments.filter(a => a.workspaceId === workspaceId);

  const todayList = wsAssignments.filter(a => a.group === 'today');
  const thisWeekList = wsAssignments.filter(a => a.group === 'this_week');
  const laterList = wsAssignments.filter(a => a.group === 'later');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium">
          {wsAssignments.filter(a => a.status !== 'submitted').length} Pending Deadlines
        </span>
        <button
          onClick={() => setActiveView('assignments')}
          className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
        >
          All Deadlines →
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Due Today */}
        {todayList.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1.5">
              <AlertCircle className="w-3 h-3" />
              <span>Due Today</span>
            </div>
            <div className="space-y-1.5">
              {todayList.map(item => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-rose-50/50 border border-rose-200/80 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-500">{item.subject} · {item.estimatedHours}h est.</p>
                  </div>
                  <button
                    onClick={() =>
                      updateAssignmentStatus(
                        item.id,
                        item.status === 'submitted' ? 'in_progress' : 'submitted'
                      )
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      item.status === 'submitted'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                  >
                    {item.status === 'submitted' ? 'Submitted' : 'Submit'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Due This Week */}
        {thisWeekList.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">
              <Calendar className="w-3 h-3" />
              <span>This Week</span>
            </div>
            <div className="space-y-1.5">
              {thisWeekList.map(item => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-500">{item.subject} · {item.deadline}</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {item.estimatedHours}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Later */}
        {laterList.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Later Deadlines
            </div>
            <div className="space-y-1.5">
              {laterList.map(item => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <span className="truncate max-w-[140px] text-slate-700">{item.title}</span>
                  <span className="text-[10px] text-slate-400">{item.deadline}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
