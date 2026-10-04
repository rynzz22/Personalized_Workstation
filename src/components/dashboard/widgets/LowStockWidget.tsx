import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { AlertTriangle, Package, Plus } from 'lucide-react';

export const LowStockWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { products, adjustStock, setActiveView } = useWorkspace();
  const wsProducts = products.filter(p => p.workspaceId === workspaceId);
  const lowStockItems = wsProducts.filter(p => p.stock <= p.minStock);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          {lowStockItems.length} Items Need Restocking
        </span>
        <button
          onClick={() => setActiveView('sales_inventory')}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Inventory →
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {lowStockItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-xs text-slate-400">
            <Package className="w-6 h-6 mb-1 text-slate-300" />
            All inventory levels are healthy.
          </div>
        ) : (
          lowStockItems.map(p => (
            <div
              key={p.id}
              className="p-2.5 rounded-lg border border-amber-200/80 bg-amber-50/40 flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                <p className="text-[10px] text-slate-500">
                  SKU: {p.sku} · Min threshold: {p.minStock} units
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                  {p.stock} left
                </span>
                <button
                  onClick={() => adjustStock(p.id, 10)}
                  title="Quick Restock +10"
                  className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
