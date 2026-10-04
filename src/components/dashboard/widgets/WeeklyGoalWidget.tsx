import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Target, CheckCircle2 } from 'lucide-react';

export const WeeklyGoalWidget: React.FC<{ workspaceId: string }> = () => {
  const { setActiveView } = useWorkspace();
  const currentProgress = 76;

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Study Target
          </span>
          <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
            <Target className="w-4 h-4" />
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-slate-900">{currentProgress}%</span>
          <span className="text-xs text-slate-500 font-medium">19 / 25 study hours</span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
          <div
            className="h-full bg-purple-600 rounded-full"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      <div className="p-2 bg-purple-50/60 rounded-lg border border-purple-100 text-[11px] text-purple-900 font-medium flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
        <span>6 hours left to hit your weekly review quota</span>
      </div>
    </div>
  );
};
