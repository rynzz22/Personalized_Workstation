import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const FinanceSummaryWidget: React.FC<{ workspaceId: string }> = () => {
  const { finance, setActiveView } = useWorkspace();

  const netSavings = finance.monthlyIncome - finance.monthlyExpenses;

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Monthly Cashflow
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {finance.savingsRate}% Savings Rate
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-2">
          <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3 text-emerald-600" /> Income
            </span>
            <p className="text-sm font-black text-slate-900 mt-0.5">₱{finance.monthlyIncome.toLocaleString()}</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-50/60 border border-rose-100">
            <span className="text-[10px] font-semibold text-rose-800 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 text-rose-600" /> Expenses
            </span>
            <p className="text-sm font-black text-slate-900 mt-0.5">₱{finance.monthlyExpenses.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Net Surplus</span>
          <span className="font-bold text-emerald-600">+₱{netSavings.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={() => setActiveView('finance')}
        className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
      >
        View Transactions & Budget →
      </button>
    </div>
  );
};
