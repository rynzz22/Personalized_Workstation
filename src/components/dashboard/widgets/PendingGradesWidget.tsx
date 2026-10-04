import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { ClipboardCheck, ArrowUpRight } from 'lucide-react';

export const PendingGradesWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { setActiveView } = useWorkspace();

  const items = [
    { title: 'Photosynthesis Quiz', count: 32, due: 'Today' },
    { title: 'Mitosis Lab Notebooks', count: 28, due: 'Tomorrow' },
    { title: 'Kinematics Problem Set', count: 29, due: 'Friday' }
  ];

  const totalCount = items.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-black text-slate-900">{totalCount}</span>
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <ClipboardCheck className="w-5 h-5" />
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">Ungraded student papers in queue</p>
      </div>

      <div className="space-y-1.5 my-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
            <span className="text-slate-700 truncate max-w-[120px] font-medium">{item.title}</span>
            <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
              {item.count} papers
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setActiveView('classes')}
        className="w-full mt-1 py-1.5 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        <span>Open Gradebook</span>
        <ArrowUpRight className="w-3 h-3" />
      </button>
    </div>
  );
};
