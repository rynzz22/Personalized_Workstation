import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Store,
  Package,
  Plus,
  Minus,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  DollarSign,
  Tag
} from 'lucide-react';

export const BusinessView: React.FC = () => {
  const { products, sales, activeWorkspace, adjustStock, addSale } = useWorkspace();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // New sale form
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState('');
  const [totalAmount, setTotalAmount] = useState(500);
  const [profit, setProfit] = useState(250);

  const wsProducts = products.filter(p => p.workspaceId === activeWorkspace.id);
  const wsSales = sales.filter(s => s.workspaceId === activeWorkspace.id);

  const totalSales = wsSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfit = wsSales.reduce((acc, s) => acc + s.profit, 0);

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    addSale({
      customerName: customerName.trim(),
      items: items.trim() || 'Custom Order',
      totalAmount,
      profit,
      date: 'Today, Just now'
    });

    setCustomerName('');
    setItems('');
    setIsSaleModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-600" />
            <span>Store Operations & Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time retail POS sales tally, stock levels, and supplier replenishment.
          </p>
        </div>

        <button
          onClick={() => setIsSaleModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Sale</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase">Today's Revenue</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₱{totalSales.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Across {wsSales.length} customer sales</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase">Estimated Gross Margin</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">₱{totalProfit.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">
            {totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(0) : 0}% net return
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase">Catalog Items</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{wsProducts.length}</p>
          <span className="text-[11px] text-amber-600 font-medium">
            {wsProducts.filter(p => p.stock <= p.minStock).length} items below safety threshold
          </span>
        </div>
      </div>

      {/* Product Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Product Inventory & Stock Adjustments</span>
          </h2>
          <span className="text-xs text-slate-400">{wsProducts.length} Active SKUs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Product Name</th>
                <th className="pb-3 font-semibold">SKU</th>
                <th className="pb-3 font-semibold">Stock Available</th>
                <th className="pb-3 font-semibold">Min Threshold</th>
                <th className="pb-3 font-semibold">Cost Price</th>
                <th className="pb-3 font-semibold">Selling Price</th>
                <th className="pb-3 font-semibold text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wsProducts.map(p => {
                const isLow = p.stock <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 font-mono text-slate-500 text-[11px]">{p.sku}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isLow
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{p.minStock}</td>
                    <td className="py-3 text-slate-500">₱{p.costPrice}</td>
                    <td className="py-3 font-bold text-slate-900">₱{p.sellingPrice}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => adjustStock(p.id, -1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => adjustStock(p.id, 5)}
                          className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px]"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sale Modal */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">Record Retail Sale</h3>
            <form onSubmit={handleRecordSale} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Items Purchased
                </label>
                <input
                  type="text"
                  value={items}
                  onChange={e => setItems(e.target.value)}
                  placeholder="e.g. 2x Coconut Candles, 1x Rattan Basket"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Amount (₱)
                  </label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={e => setTotalAmount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Net Profit (₱)
                  </label>
                  <input
                    type="number"
                    value={profit}
                    onChange={e => setProfit(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSaleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
