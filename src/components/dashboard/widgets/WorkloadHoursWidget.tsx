import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Clock, PieChart, AlertCircle } from 'lucide-react';

export const WorkloadHoursWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { assignments } = useWorkspace();
  const wsAssignments = assignments.filter(a => a.workspaceId === workspaceId);

  const totalHours = wsAssignments.reduce((acc, a) => acc + a.estimatedHours, 0);
  const heaviest = [...wsAssignments].sort((a, b) => b.estimatedHours - a.estimatedHours)[0];

  const subjectsMap: Record<string, number> = {};
  wsAssignments.forEach(a => {
    subjectsMap[a.subject] = (subjectsMap[a.subject] || 0) + a.estimatedHours;
  });

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-2xl font-black text-slate-900">{totalHours.toFixed(1)} hrs</span>
          <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
            <Clock className="w-5 h-5" />
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">Estimated weekly study workload</p>
      </div>

      {heaviest && (
        <div className="my-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase">
            <AlertCircle className="w-3 h-3" />
            <span>Heaviest Assignment</span>
          </div>
          <p className="font-semibold text-slate-800 truncate mt-0.5">{heaviest.title}</p>
          <p className="text-[10px] text-slate-500">{heaviest.estimatedHours} hrs · {heaviest.subject}</p>
        </div>
      )}

      <div className="space-y-1.5">
        {Object.entries(subjectsMap).map(([subj, hrs]) => (
          <div key={subj} className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 truncate max-w-[130px]">{subj}</span>
            <span className="font-bold text-slate-800">{hrs.toFixed(1)}h</span>
          </div>
        ))}
      </div>
    </div>
  );
};
