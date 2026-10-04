import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { NoteItem } from '../../types/workspace';
import { FileText, Plus, Pin, Trash2, Search, Tag, Sparkles } from 'lucide-react';

export const NotesView: React.FC = () => {
  const { notes, activeWorkspace, addNote, togglePinNote, deleteNote } = useWorkspace();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [color, setColor] = useState('#ffffff');

  const wsNotes = notes.filter(n => n.workspaceId === activeWorkspace.id);
  const categories = Array.from(new Set(wsNotes.map(n => n.category)));

  const filteredNotes = wsNotes.filter(n => {
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    if (
      search &&
      !n.title.toLowerCase().includes(search.toLowerCase()) &&
      !n.content.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNote({
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'General',
      pinned: false,
      color
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            <span>Notes & Documents</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture lesson reflections, rubrics, study formulas, and meeting minutes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Notes ({wsNotes.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map(n => (
          <div
            key={n.id}
            style={{ backgroundColor: n.color || '#ffffff' }}
            className="p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h3>
                <button
                  onClick={() => togglePinNote(n.id)}
                  title={n.pinned ? 'Unpin' : 'Pin note'}
                  className="text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <Pin
                    className={`w-4 h-4 ${
                      n.pinned ? 'text-amber-500 fill-amber-500' : ''
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                {n.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold bg-white/70 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                {n.category}
              </span>
              <div className="flex items-center gap-2">
                <span>{n.updatedAt}</span>
                <button
                  onClick={() => deleteNote(n.id)}
                  className="hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Note</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Science Fair Scoring Criteria"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Content
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your note, formulas, or checklist..."
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
                    placeholder="e.g. Lab, Guidelines, Ideas"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Card Background
                  </label>
                  <select
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="#ffffff">Default White</option>
                    <option value="#fef3c7">Warm Yellow</option>
                    <option value="#e0f2fe">Light Sky</option>
                    <option value="#f3e8ff">Soft Lavender</option>
                    <option value="#dcfce7">Mint Green</option>
                  </select>
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
