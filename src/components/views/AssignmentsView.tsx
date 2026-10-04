import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { StudentAssignment } from '../../types/workspace';
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  PieChart
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { assignments, activeWorkspace, addAssignment, updateAssignmentStatus } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Advanced Calculus');
  const [deadline, setDeadline] = useState('Tomorrow, 5:00 PM');
  const [priority, setPriority] = useState<StudentAssignment['priority']>('high');
  const [estimatedHours, setEstimatedHours] = useState(2.5);
  const [group, setGroup] = useState<StudentAssignment['group']>('today');

  const wsAssignments = assignments.filter(a => a.workspaceId === activeWorkspace.id);
  const totalHours = wsAssignments.reduce((acc, a) => acc + a.estimatedHours, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAssignment({
      title: title.trim(),
      subject,
      deadline,
      priority,
      estimatedHours,
      status: 'not_started',
      group
    });

    setTitle('');
    setIsModalOpen(false);
  };

  const renderAssignmentCard = (asgn: StudentAssignment) => {
    const isSubmitted = asgn.status === 'submitted';
    return (
      <div
        key={asgn.id}
        className={`p-4 rounded-xl border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-all ${
          isSubmitted ? 'opacity-60 bg-slate-50 border-slate-200' : 'border-slate-200 hover:border-purple-300'
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              {asgn.subject}
            </span>
            {asgn.priority === 'urgent' && (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                Urgent
              </span>
            )}
          </div>
          <h3 className={`text-sm font-bold text-slate-900 mt-1 ${isSubmitted ? 'line-through text-slate-400' : ''}`}>
            {asgn.title}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5" /> Due: {asgn.deadline}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {asgn.estimatedHours} hrs study load
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            updateAssignmentStatus(asgn.id, isSubmitted ? 'in_progress' : 'submitted')
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors self-start sm:self-auto ${
            isSubmitted
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
          }`}
        >
          {isSubmitted ? 'Submitted' : 'Mark Complete'}
        </button>
      </div>
    );
  };

  const todayList = wsAssignments.filter(a => a.group === 'today');
  const thisWeekList = wsAssignments.filter(a => a.group === 'this_week');
  const laterList = wsAssignments.filter(a => a.group === 'later');

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <span>Assignments & Workload</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grouped by urgent deadlines with total estimated study workload: {totalHours.toFixed(1)} hours.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm shadow-purple-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Grouped lists */}
      <div className="space-y-6">
        {/* Due Today */}
        <div>
          <h2 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Due Today ({todayList.length})
          </h2>
          <div className="space-y-2.5">
            {todayList.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 bg-white rounded-xl border border-slate-200 text-center">
                No assignments due today.
              </div>
            ) : (
              todayList.map(renderAssignmentCard)
            )}
          </div>
        </div>

        {/* Due This Week */}
        <div>
          <h2 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Due This Week ({thisWeekList.length})
          </h2>
          <div className="space-y-2.5">
            {thisWeekList.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 bg-white rounded-xl border border-slate-200 text-center">
                No assignments due later this week.
              </div>
            ) : (
              thisWeekList.map(renderAssignmentCard)
            )}
          </div>
        </div>

        {/* Later */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Upcoming & Term Deadlines ({laterList.length})
          </h2>
          <div className="space-y-2.5">
            {laterList.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 bg-white rounded-xl border border-slate-200 text-center">
                No later assignments queued.
              </div>
            ) : (
              laterList.map(renderAssignmentCard)
            )}
          </div>
        </div>
      </div>

      {/* New Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Study Assignment</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics Chapter Problem Set"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deadline Group
                  </label>
                  <select
                    value={group}
                    onChange={e => setGroup(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="today">Due Today</option>
                    <option value="this_week">Due This Week</option>
                    <option value="later">Later</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date / Time Text
                  </label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    placeholder="e.g. Tonight, 11:59 PM"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Est. Study Hours
                  </label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={e => setEstimatedHours(Number(e.target.value))}
                    step={0.5}
                    min={0.5}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
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
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm"
                >
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
