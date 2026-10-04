import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Activity, Flame, Plus, Minus } from 'lucide-react';

export const TrackerCardWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { trackers, logTracker, setActiveView } = useWorkspace();
  const wsTrackers = trackers.filter(t => t.workspaceId === workspaceId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium">Daily Habits & Streaks</span>
        <button
          onClick={() => setActiveView('trackers')}
          className="text-xs text-pink-600 hover:text-pink-700 font-semibold"
        >
          Trackers →
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {wsTrackers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-xs text-slate-400">
            <Activity className="w-6 h-6 mb-1 text-slate-300" />
            No habits active. Add a habit tracker!
          </div>
        ) : (
          wsTrackers.map(tr => {
            const percent = Math.min(100, Math.round((tr.todayValue / tr.targetDaily) * 100));
            return (
              <div key={tr.id} className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{tr.title}</h4>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {tr.streak}d streak
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => logTracker(tr.id, -1)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 min-w-[36px] text-center">
                      {tr.todayValue}/{tr.targetDaily}
                    </span>
                    <button
                      onClick={() => logTracker(tr.id, 1)}
                      className="p-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
