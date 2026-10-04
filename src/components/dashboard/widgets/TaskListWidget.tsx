import React, { useState } from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { CheckSquare, Square, Plus, AlertCircle, Clock } from 'lucide-react';

export const TaskListWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { tasks, toggleTask, addTask } = useWorkspace();
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [showAdd, setShowAdd] = useState(false);

  const wsTasks = tasks.filter(t => t.workspaceId === workspaceId);
  const openTasks = wsTasks.filter(t => t.status !== 'done');
  const doneTasks = wsTasks.filter(t => t.status === 'done');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      status: 'todo',
      priority: newPriority,
      dueAt: 'Today'
    });
    setNewTitle('');
    setShowAdd(false);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgent':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Urgent</span>;
      case 'high':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">High</span>;
      case 'low':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">Low</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">Med</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {openTasks.length} open · {doneTasks.length} completed
          </span>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Quick Add
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
          <input
            type="text"
            aria-label="Task title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
          />
          <div className="flex items-center justify-between">
            <select
              aria-label="Task priority"
              value={newPriority}
              onChange={e => setNewPriority(e.target.value as any)}
              className="text-[11px] px-2 py-1 bg-white border border-slate-300 rounded"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {wsTasks.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
            <CheckSquare className="w-6 h-6 mb-1 text-slate-300" />
            No tasks scheduled. Click Quick Add!
          </div>
        ) : (
          wsTasks.map(task => {
            const isDone = task.status === 'done';
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer group ${
                  isDone
                    ? 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
                    : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                <button
                  type="button"
                  aria-label={`${isDone ? 'Mark incomplete' : 'Complete'}: ${task.title}`}
                  aria-pressed={isDone}
                  className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors"
                >
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium leading-snug truncate ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getPriorityBadge(task.priority)}
                    {task.dueAt && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.dueAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
