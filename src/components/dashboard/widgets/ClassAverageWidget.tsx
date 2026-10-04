import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { TrendingUp, Award, ArrowUpRight } from 'lucide-react';

export const ClassAverageWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { classes } = useWorkspace();
  const wsClasses = classes.filter(c => c.workspaceId === workspaceId);

  const avg =
    wsClasses.length > 0
      ? (
          wsClasses.reduce((acc, c) => acc + c.averageGrade, 0) / wsClasses.length
        ).toFixed(1)
      : '84.2';

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-black text-slate-900">{avg}%</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Award className="w-5 h-5" />
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+2.4% vs Last Quarter</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Across {wsClasses.length} active classes</p>
      </div>

      <div className="space-y-1.5 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
        {wsClasses.map(c => (
          <div key={c.id} className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 truncate max-w-[110px]">{c.name}</span>
            <span className="font-semibold text-slate-800">{c.averageGrade}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
