import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Activity, Plus, Flame, PlusCircle, MinusCircle } from 'lucide-react';

export const TrackersView: React.FC = () => {
  const { trackers, logTracker, activeWorkspace } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState('minutes');
  const [targetDaily, setTargetDaily] = useState(30);

  const wsTrackers = trackers.filter(t => t.workspaceId === activeWorkspace.id);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-pink-600" />
            <span>Custom Trackers & Habits</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quantify daily disciplines, reading goals, wellness, and streak consistency.
          </p>
        </div>
      </div>

      {/* Grid of Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wsTrackers.map(tr => {
          const percent = Math.min(100, Math.round((tr.todayValue / tr.targetDaily) * 100));
          return (
            <div
              key={tr.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{tr.title}</h3>
                    <p className="text-xs text-slate-400">
                      Goal: {tr.targetDaily} {tr.unit} / day
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    {tr.streak} Days Streak
                  </span>
                </div>

                <div className="my-4 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Today's Progress</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => logTracker(tr.id, -1)}
                      className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                    <span className="text-base font-black text-slate-900 min-w-[50px] text-center">
                      {tr.todayValue} {tr.unit}
                    </span>
                    <button
                      onClick={() => logTracker(tr.id, 1)}
                      className="p-1 rounded-lg bg-pink-50 border border-pink-200 hover:bg-pink-100 text-pink-600"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Recent 4-day logs mini bar chart */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Recent Activity History
                  </span>
                  <div className="flex items-end gap-2 h-16 pt-2 border-b border-slate-100">
                    {tr.logs.map(log => {
                      const hPercent = Math.min(100, Math.round((log.value / tr.targetDaily) * 100));
                      return (
                        <div key={log.date} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-slate-100 h-full rounded-t flex items-end">
                            <div
                              className="w-full bg-pink-400 rounded-t"
                              style={{ height: `${hPercent}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400">{log.date.slice(5)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
