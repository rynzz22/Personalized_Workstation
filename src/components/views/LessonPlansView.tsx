import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { LessonPlan } from '../../types/workspace';
import {
  BookOpen,
  Plus,
  Copy,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const LessonPlansView: React.FC = () => {
  const { lessonPlans, activeWorkspace, addLessonPlan, duplicateLessonPlan, updateLessonPlanStatus } =
    useWorkspace();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [classSubject, setClassSubject] = useState('Grade 7 — Earth Science');
  const [date, setDate] = useState('2026-10-10');
  const [templateType, setTemplateType] = useState<LessonPlan['templateType']>('Hands-on Lab');
  const [objectives, setObjectives] = useState('1. Define core concepts\n2. Perform guided laboratory experiment\n3. Record empirical observations');
  const [materials, setMaterials] = useState('Lab manuals, Beakers, Digital thermometer, Safety goggles');
  const [assessment, setAssessment] = useState('10-item formative worksheet + lab safety exit card');

  const wsPlans = lessonPlans.filter(lp => lp.workspaceId === activeWorkspace.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedObjectives = objectives.split('\n').filter(o => o.trim().length > 0);
    const parsedMaterials = materials.split(',').map(m => m.trim()).filter(Boolean);

    addLessonPlan({
      title: title.trim(),
      classSubject,
      date,
      templateType,
      status: 'ready',
      objectives: parsedObjectives,
      materials: parsedMaterials,
      procedure: [
        { phase: 'Motivation & Introduction', description: 'Brief multimedia hook or real-world problem', durationMin: 10 },
        { phase: 'Guided Exploration', description: 'Step-by-step guided activity in student pods', durationMin: 25 },
        { phase: 'Discussion & Synthesis', description: 'Class reflection and conceptual consolidation', durationMin: 15 }
      ],
      assessment
    });

    setTitle('');
    setIsCreateOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>Lesson Plan Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Structured lesson templates, curriculum objectives, procedures, and duplicate reuse.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Lesson Plan</span>
        </button>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {wsPlans.map(plan => (
          <div
            key={plan.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                    {plan.templateType}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{plan.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{plan.classSubject}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      plan.status === 'ready'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {plan.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Objectives summary */}
              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Key Objectives:
                </span>
                <ul className="space-y-1">
                  {plan.objectives.slice(0, 2).map((obj, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span className="truncate">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Procedure Steps */}
              <div className="mt-3 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Procedure Phases ({plan.procedure.length} steps):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {plan.procedure.map((step, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-medium text-slate-600 flex items-center gap-1"
                    >
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      {step.phase} ({step.durationMin}m)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Plan Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5" /> Scheduled: {plan.date}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => duplicateLessonPlan(plan.id)}
                  title="Duplicate Lesson Plan"
                  className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() =>
                    updateLessonPlanStatus(
                      plan.id,
                      plan.status === 'ready' ? 'completed' : 'ready'
                    )
                  }
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors text-xs ${
                    plan.status === 'completed'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {plan.status === 'completed' ? 'Delivered' : 'Mark Ready'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Lesson Plan Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Structured Lesson Plan</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an educational methodology template and define procedural milestones.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lesson Plan Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Mendelian Genetics & Punnett Squares"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class / Section
                  </label>
                  <input
                    type="text"
                    value={classSubject}
                    onChange={e => setClassSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Methodology Template
                </label>
                <select
                  value={templateType}
                  onChange={e => setTemplateType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Hands-on Lab">Hands-on Lab (Experimentation & Data)</option>
                  <option value="Lecture">Lecture & Interactive Whiteboard</option>
                  <option value="Interactive Discussion">Inquiry Discussion (Socratic)</option>
                  <option value="Group Project">Collaborative Pod Project</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Learning Objectives (one per line)
                </label>
                <textarea
                  rows={3}
                  value={objectives}
                  onChange={e => setObjectives(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Materials Needed
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={e => setMaterials(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assessment / Exit Ticket
                </label>
                <input
                  type="text"
                  value={assessment}
                  onChange={e => setAssessment(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Lesson Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
