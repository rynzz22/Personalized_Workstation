import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CalendarEvent } from '../../types/workspace';
import { Calendar, Plus, Clock, MapPin, Trash2, Filter } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { events, activeWorkspace, addEvent, deleteEvent } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [date, setDate] = useState('2026-10-04');
  const [category, setCategory] = useState<CalendarEvent['category']>('class');
  const [location, setLocation] = useState('Room 204');

  const wsEvents = events.filter(e => e.workspaceId === activeWorkspace.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title: title.trim(),
      startTime,
      endTime,
      date,
      category,
      location: location.trim()
    });

    setTitle('');
    setIsModalOpen(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'class':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'meeting':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'study':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'deadline':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span>Calendar & Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Time-blocked agenda for classes, faculty meetings, study sessions, and milestones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Events timeline / list */}
      <div className="space-y-3">
        {wsEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No events scheduled for this workspace. Click Add Event to create one!
          </div>
        ) : (
          wsEvents.map(evt => (
            <div
              key={evt.id}
              className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex flex-col items-center justify-center min-w-[70px] border border-indigo-100">
                  <span className="text-[10px] text-indigo-500 font-semibold uppercase">Time</span>
                  <span className="font-mono text-slate-900 mt-0.5">{evt.startTime}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(
                        evt.category
                      )}`}
                    >
                      {evt.category}
                    </span>
                    <span className="text-xs text-slate-400">to {evt.endTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h3>
                  {evt.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">{evt.date}</span>
                <button
                  onClick={() => deleteEvent(evt.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">Schedule Event</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Science Department Planning Session"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="class">Class</option>
                    <option value="meeting">Meeting</option>
                    <option value="study">Study</option>
                    <option value="deadline">Deadline</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / Room
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Room 204 or Zoom link"
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
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
