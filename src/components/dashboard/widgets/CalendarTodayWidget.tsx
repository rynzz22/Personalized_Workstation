import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';

export const CalendarTodayWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { events, setActiveView } = useWorkspace();
  const wsEvents = events.filter(e => e.workspaceId === workspaceId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium">
          {wsEvents.length} events scheduled
        </span>
        <button
          onClick={() => setActiveView('calendar')}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Full Calendar →
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {wsEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
            <Calendar className="w-6 h-6 mb-1 text-slate-300" />
            No events scheduled for today.
          </div>
        ) : (
          wsEvents.map(evt => (
            <div
              key={evt.id}
              onClick={() => setActiveView('calendar')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {evt.title}
                </h4>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {evt.startTime} - {evt.endTime}
                </span>
              </div>
              {evt.location && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{evt.location}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
