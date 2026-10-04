import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Target, Plus, CheckCircle2, Circle, Calendar, Sparkles } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, activeWorkspace, addGoal, toggleMilestone } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic Administration');
  const [targetDate, setTargetDate] = useState('Nov 30, 2026');
  const [milestonesInput, setMilestonesInput] = useState(
    '1. Complete initial syllabus draft\n2. Align with curriculum heads\n3. Deliver final classroom presentations'
  );

  const wsGoals = goals.filter(g => g.workspaceId === activeWorkspace.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const ms = milestonesInput
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean)
      .map((text, idx) => ({
        id: `ms-${Date.now()}-${idx}`,
        text,
        completed: false
      }));

    addGoal({
      title: title.trim(),
      category: category.trim(),
      targetDate,
      progress: 0,
      milestones: ms
    });

    setTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            <span>Goals & Milestones</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track long-term OKRs, quarterly deadlines, and milestone achievements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {wsGoals.map(goal => (
          <div
            key={goal.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
                    {goal.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{goal.title}</h3>
                </div>
                <span className="text-base font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                  {goal.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-3">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              {/* Milestones checklist */}
              <div className="space-y-1.5 mt-4">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Key Milestones ({goal.milestones.filter(m => m.completed).length}/
                  {goal.milestones.length})
                </span>
                {goal.milestones.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(goal.id, m.id)}
                    className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-slate-50 transition-colors group"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs leading-snug ${
                        m.completed ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {m.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5" /> Target Deadline: {goal.targetDate}
              </span>
              <span className="font-semibold text-indigo-600 text-[11px]">
                {goal.progress === 100 ? 'Goal Completed!' : 'In Progress'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Milestone Goal</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Science Olympiad Regional Championship"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Date
                  </label>
                  <input
                    type="text"
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Milestone Checkpoints (one per line)
                </label>
                <textarea
                  rows={3}
                  value={milestonesInput}
                  onChange={e => setMilestonesInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
