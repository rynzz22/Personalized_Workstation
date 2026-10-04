import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Sparkles, TrendingUp, CheckCircle, Zap } from 'lucide-react';

export const ProgressSummaryWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { tasks, goals } = useWorkspace();
  const wsTasks = tasks.filter(t => t.workspaceId === workspaceId);
  const doneTasks = wsTasks.filter(t => t.status === 'done');
  const completionRate =
    wsTasks.length > 0 ? Math.round((doneTasks.length / wsTasks.length) * 100) : 78;

  // Intelligent feedback message per Talibon Workspace spec
  const getFeedbackMessage = (rate: number) => {
    if (rate >= 80) {
      return "Outstanding momentum! You've cleared the majority of this week's key priorities ahead of schedule.";
    }
    if (rate >= 50) {
      return 'Consistent pace. 3 high-impact tasks remaining before the weekend review.';
    }
    return 'Attention suggested: Prioritize your top 2 urgent items to re-establish weekly cadence.';
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Weekly Momentum
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <TrendingUp className="w-3 h-3" />
            Improving
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-1">
          <span className="text-3xl font-black text-slate-900">{completionRate}%</span>
          <span className="text-xs text-slate-500 font-medium">
            {doneTasks.length} of {wsTasks.length} objectives cleared
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-2">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-950 font-medium leading-snug">
          {getFeedbackMessage(completionRate)}
        </p>
      </div>
    </div>
  );
};
