import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { FileText, Pin, ArrowRight } from 'lucide-react';

export const NotesRecentWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { notes, setActiveView } = useWorkspace();
  const wsNotes = notes.filter(n => n.workspaceId === workspaceId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium">{wsNotes.length} Notes</span>
        <button
          onClick={() => setActiveView('notes')}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          View All →
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {wsNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
            <FileText className="w-6 h-6 mb-1 text-slate-300" />
            No notes saved. Click Notes to write one!
          </div>
        ) : (
          wsNotes.map(n => (
            <div
              key={n.id}
              onClick={() => setActiveView('notes')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                  {n.title}
                </h4>
                {n.pinned && (
                  <Pin className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {n.content}
              </p>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                  {n.category}
                </span>
                <span>{n.updatedAt}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
