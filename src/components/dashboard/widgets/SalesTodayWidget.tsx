import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { TrendingUp, ShoppingBag, ArrowUpRight } from 'lucide-react';

export const SalesTodayWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { sales, setActiveView } = useWorkspace();
  const wsSales = sales.filter(s => s.workspaceId === workspaceId);

  const totalSales = wsSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfit = wsSales.reduce((acc, s) => acc + s.profit, 0);

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-2xl font-black text-slate-900">₱{totalSales.toLocaleString()}</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <ShoppingBag className="w-5 h-5" />
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Profit: ₱{totalProfit.toLocaleString()} ({wsSales.length} orders)</span>
        </div>
      </div>

      <div className="space-y-1.5 my-2">
        {wsSales.map(sale => (
          <div key={sale.id} className="p-1.5 rounded bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">{sale.customerName}</span>
              <span className="font-bold text-emerald-600">+₱{sale.totalAmount}</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">{sale.items}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setActiveView('sales_inventory')}
        className="w-full py-1.5 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        <span>Manage Store & Inventory</span>
        <ArrowUpRight className="w-3 h-3" />
      </button>
    </div>
  );
};
