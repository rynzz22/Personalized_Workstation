import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Settings, Trash2, RotateCcw, Palette, Layers, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    activeWorkspace,
    updateWorkspace,
    deleteWorkspace,
    workspaces,
    resetToDefaults
  } = useWorkspace();

  const [name, setName] = useState(activeWorkspace.name);
  const [color, setColor] = useState(activeWorkspace.color);
  const [isSaved, setIsSaved] = useState(false);

  const colors = [
    '#3b82f6', // Blue (Teacher)
    '#8b5cf6', // Purple (Student)
    '#10b981', // Emerald (Business)
    '#f59e0b', // Amber (Freelancer)
    '#06b6d4', // Cyan (Employee)
    '#ec4899', // Pink (Personal)
    '#64748b'  // Slate (Custom)
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace(activeWorkspace.id, { name, color });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>Workspace Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure name, theme accent, and active parameters for {activeWorkspace.name}.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Workspace Role
            </label>
            <input
              type="text"
              disabled
              value={`${activeWorkspace.role.toUpperCase()} (Defined at creation)`}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 capitalize cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Color Accent
            </label>
            <div className="flex items-center gap-2.5">
              {colors.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : ''
                  }`}
                >
                  {color === c && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {isSaved && (
              <span className="text-xs font-semibold text-emerald-600">
                Changes saved successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Danger zone */}
        <div className="mt-8 bg-rose-50/50 p-6 rounded-2xl border border-rose-200/80">
          <h3 className="text-sm font-bold text-rose-900 mb-1">Danger Zone</h3>
          <p className="text-xs text-rose-700 mb-4">
            Deleting this workspace removes its custom tile configuration.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={workspaces.length <= 1}
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${activeWorkspace.name}"?`)) {
                  deleteWorkspace(activeWorkspace.id);
                }
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all workspaces to factory default seed data?')) {
                  resetToDefaults();
                }
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
