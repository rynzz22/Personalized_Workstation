import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Award,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { tasks, goals, activeWorkspace } = useWorkspace();
  const wsTasks = tasks.filter(t => t.workspaceId === activeWorkspace.id);
  const doneTasks = wsTasks.filter(t => t.status === 'done');
  const completionRate =
    wsTasks.length > 0 ? Math.round((doneTasks.length / wsTasks.length) * 100) : 80;

  const wsGoals = goals.filter(g => g.workspaceId === activeWorkspace.id);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Progress & Trend Intelligence</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Weekly completion trends, milestone velocity, and contextual recommendations.
        </p>
      </div>

      {/* Main Feedback Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 rounded-2xl shadow-md shadow-indigo-900/10 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/30 text-indigo-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
              Talibon Feedback Engine
            </span>
          </div>
          <h2 className="text-xl font-bold">
            {completionRate >= 80
              ? 'Peak Performance Rhythm Achieved'
              : 'Consistent Velocity with Room for Optimization'}
          </h2>
          <p className="text-xs text-indigo-200 mt-1.5 leading-relaxed">
            You have executed {doneTasks.length} out of {wsTasks.length} planned initiatives this week in{' '}
            {activeWorkspace.name}. Your task velocity is trending upward by +14% compared to previous baseline.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/15 text-center min-w-[140px] self-stretch md:self-auto flex flex-col justify-center">
          <span className="text-3xl font-black">{completionRate}%</span>
          <span className="text-[11px] text-indigo-200 font-medium mt-1">Weekly Completion</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Trend Status
          </span>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span className="text-lg font-bold text-slate-900">Improving (+2.8 pts)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Consistent positive trajectory over 3 weeks</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Goals
          </span>
          <div className="flex items-center gap-2 mt-2">
            <Target className="w-5 h-5 text-indigo-500" />
            <span className="text-lg font-bold text-slate-900">{wsGoals.length} Tracked</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {wsGoals.filter(g => g.progress === 100).length} goals 100% completed
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Modules Configured
          </span>
          <div className="flex items-center gap-2 mt-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-lg font-bold text-slate-900">
              {activeWorkspace.modules.length} Functional Blocks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tailored for {activeWorkspace.role} workflow</p>
        </div>
      </div>
    </div>
  );
};
