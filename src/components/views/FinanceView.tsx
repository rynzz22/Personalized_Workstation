import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  DollarSign,
  PieChart,
  Calendar
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { finance, addTransaction, activeWorkspace } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState(1500);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('Consulting / Sales');

  const netSavings = finance.monthlyIncome - finance.monthlyExpenses;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    addTransaction(desc.trim(), amount, type, category);
    setDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-500" />
            <span>Personal & Business Finance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cashflow management, monthly budget allocations, and savings rate.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <ArrowDownRight className="w-4 h-4" /> Monthly Inflow
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            ₱{finance.monthlyIncome.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Regular recurring & project revenue</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> Monthly Outflow
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            ₱{finance.monthlyExpenses.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Supplies, software & operating costs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
            <PieChart className="w-4 h-4" /> Net Savings Surplus
          </span>
          <p className="text-2xl font-black text-indigo-600 mt-2">
            ₱{netSavings.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">{finance.savingsRate}% target retention rate</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Recent Inflows & Outflows</h2>
        <div className="divide-y divide-slate-100">
          {finance.recentTransactions.map(tx => (
            <div key={tx.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'income'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{tx.description}</h4>
                  <p className="text-[11px] text-slate-400">{tx.category} · {tx.date}</p>
                </div>
              </div>

              <span
                className={`text-xs font-bold ${
                  tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {tx.type === 'income' ? '+' : '-'}₱{tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">Record Transaction</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="e.g. Science Lab Supplies"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount (₱)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="income">Income (+)</option>
                    <option value="expense">Expense (-)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="e.g. Supplies, Salary, Fee"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
