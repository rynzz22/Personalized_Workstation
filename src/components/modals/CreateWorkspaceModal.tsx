import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ROLE_TEMPLATES } from '../../data/initialData';
import { UserRole } from '../../types/workspace';
import {
  X,
  Check,
  Sparkles,
  GraduationCap,
  BookOpen,
  Store,
  Laptop,
  Briefcase,
  Layers
} from 'lucide-react';

export const CreateWorkspaceModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createWorkspaceFromRole } = useWorkspace();
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [name, setName] = useState('New Classroom Workspace');
  const [color, setColor] = useState('#3b82f6');

  if (!isCreateModalOpen) return null;

  const currentTemplate = ROLE_TEMPLATES.find(t => t.role === selectedRole) || ROLE_TEMPLATES[0];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const tmpl = ROLE_TEMPLATES.find(t => t.role === role);
    if (tmpl) {
      setColor(tmpl.color);
      switch (role) {
        case 'teacher':
          setName('Grade 10 — Physics & Chemistry');
          break;
        case 'student':
          setName('College Semester Prep');
          break;
        case 'business':
          setName('Talibon Boutique & Crafts');
          break;
        case 'freelancer':
          setName('Design & Web Freelance');
          break;
        case 'employee':
          setName('Operations & Strategy Sync');
          break;
        case 'personal':
          setName('Personal Wellness & Routines');
          break;
        case 'custom':
          setName('My Custom Canvas');
          break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createWorkspaceFromRole(name.trim(), selectedRole, 'Layers', color);
    setIsCreateModalOpen(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'teacher':
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'student':
        return <BookOpen className="w-5 h-5 text-purple-500" />;
      case 'business':
        return <Store className="w-5 h-5 text-emerald-500" />;
      case 'freelancer':
        return <Laptop className="w-5 h-5 text-amber-500" />;
      case 'employee':
        return <Briefcase className="w-5 h-5 text-cyan-500" />;
      case 'personal':
        return <Sparkles className="w-5 h-5 text-pink-500" />;
      default:
        return <Layers className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create New Workspace</h3>
            <p className="text-xs text-slate-500">
              Pick a role-aware starting template with pre-configured dashboard tiles.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Role Cards Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Starting Role Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLE_TEMPLATES.map(t => {
                const isSelected = selectedRole === t.role;
                return (
                  <div
                    key={t.role}
                    onClick={() => handleRoleSelect(t.role)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(t.role)}
                        <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                      {t.tagline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Template Details Preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <span className="font-bold text-slate-700 block mb-1">
              Included in this template:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentTemplate.defaultWidgets.map((w, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-600 font-medium"
                >
                  {w.title}
                </span>
              ))}
            </div>
          </div>

          {/* Workspace Name & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workspace Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Science Dept or Store Name"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Theme Accent Color
              </label>
              <div className="flex items-center gap-1.5 h-9">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-10 h-9 p-0.5 rounded border border-slate-300 cursor-pointer bg-white"
                />
                <span className="text-xs font-mono text-slate-500 uppercase">{color}</span>
              </div>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
