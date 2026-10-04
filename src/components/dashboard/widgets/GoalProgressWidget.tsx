import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Target, CheckCircle2, Circle, Calendar } from 'lucide-react';

export const GoalProgressWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { goals, toggleMilestone, setActiveView } = useWorkspace();
  const wsGoals = goals.filter(g => g.workspaceId === workspaceId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium">{wsGoals.length} Active Goals</span>
        <button
          onClick={() => setActiveView('goals')}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Goals Tracker →
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {wsGoals.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
            <Target className="w-6 h-6 mb-1 text-slate-300" />
            No goals defined. Set a milestone target!
          </div>
        ) : (
          wsGoals.map(goal => (
            <div key={goal.id} className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{goal.title}</h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> Target: {goal.targetDate}
                  </p>
                </div>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {goal.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2.5">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              {/* Milestones list */}
              <div className="space-y-1">
                {goal.milestones.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(goal.id, m.id)}
                    className="w-full flex items-center gap-2 text-left text-[11px] text-slate-600 hover:text-slate-900 py-0.5"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    )}
                    <span className={`truncate ${m.completed ? 'line-through text-slate-400' : ''}`}>
                      {m.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
