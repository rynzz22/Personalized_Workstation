import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Users, UserPlus } from 'lucide-react';

export const CustomersCountWidget: React.FC<{ workspaceId: string }> = () => {
  const { setActiveView } = useWorkspace();

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Customer Base
          </span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Users className="w-4 h-4" />
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-slate-900">148</span>
          <span className="text-xs text-emerald-600 font-semibold">+12 this month</span>
        </div>
        <p className="text-[10px] text-slate-400">82% repeat buyers in Talibon area</p>
      </div>

      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-600">VIP Clients</span>
        <span className="font-bold text-slate-900">24 active</span>
      </div>
    </div>
  );
};
