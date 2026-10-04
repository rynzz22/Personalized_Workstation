import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { WidgetContainer } from './WidgetContainer';
import {
  Sliders,
  Move,
  Plus,
  Sparkles,
  Info,
  CheckCircle,
  LayoutGrid
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeWorkspace,
    editMode,
    setEditMode,
    setIsCustomizeOpen,
    searchQuery
  } = useWorkspace();

  const sortedWidgets = [...activeWorkspace.widgets].sort((a, b) => a.position - b.position);

  const filteredWidgets = searchQuery.trim()
    ? sortedWidgets.filter(w =>
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedWidgets;

  return (
    <div className="dashboard-scroll flex-1 overflow-y-auto">
      <div className="dashboard-content">
      {/* Top Banner / Welcome */}
      <div className="welcome-panel">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {activeWorkspace.role} Workspace
            </span>
          </div>
          <h1 className="welcome-title">
            Welcome back, {activeWorkspace.name.split(/ [—–] /)[0]}.
          </h1>
          <p className="welcome-description">
            {activeWorkspace.role === 'teacher' &&
              'A little clarity for your teaching day. Here’s what needs your attention.'}
            {activeWorkspace.role === 'student' &&
              'Monitor assignments by deadline, review study workload, and stay on top of daily tasks.'}
            {activeWorkspace.role === 'business' &&
              'Keep an eye on daily retail sales, critical inventory shortages, and operating cashflow.'}
            {activeWorkspace.role === 'freelancer' &&
              'Deliver client projects, log focused hours, and track invoice earnings.'}
            {activeWorkspace.role === 'employee' &&
              'Stay aligned on key priorities, quarterly goals, and daily scheduled commitments.'}
            {activeWorkspace.role === 'personal' &&
              'Build healthy daily habits, track savings progress, and stay organized.'}
            {activeWorkspace.role === 'custom' &&
              'Your bespoke modular dashboard. Arrange widgets to match your exact routine.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="welcome-actions flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setEditMode(prev => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
              editMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>{editMode ? 'Finish Arranging' : 'Arrange Dashboard'}</span>
          </button>

          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="primary-action flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Dashboard</span>
          </button>
        </div>
      </div>

      {/* Edit Mode Notice Banner */}
      {editMode && (
        <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Arrange Mode Active:</strong> Use the controls in each card's header to reorder, resize, or remove widgets.
            </span>
          </div>
          <button
            onClick={() => setEditMode(false)}
            className="font-bold underline text-amber-800 hover:text-amber-950"
          >
            Save Layout
          </button>
        </div>
      )}

      {/* Widgets Grid */}
      {filteredWidgets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <LayoutGrid className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No widgets on this dashboard</h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
            Personalize this workspace by picking widgets from the catalog matching your workflow.
          </p>
          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="mt-5 flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Widgets from Catalog</span>
          </button>
        </div>
      ) : (
        <div className="dashboard-widgets">
          {filteredWidgets.map(widget => (
            <WidgetContainer
              key={widget.id}
              widget={widget}
              workspaceId={activeWorkspace.id}
            />
          ))}
        </div>
      )}
      <footer className="dashboard-footer"><Sparkles size={14} /> A little space to do your best work.</footer>
      </div>
    </div>
  );
};
