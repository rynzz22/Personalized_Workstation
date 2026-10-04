import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ROLE_TEMPLATES } from '../../data/initialData';
import {
  Layers,
  ChevronDown,
  Plus,
  Sliders,
  Move,
  Check,
  Search,
  Sparkles,
  HelpCircle,
  FolderKanban,
  GraduationCap,
  BookOpen,
  Store,
  Laptop,
  Briefcase
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    editMode,
    setEditMode,
    isCustomizeOpen,
    setIsCustomizeOpen,
    searchQuery,
    setSearchQuery,
    setIsCreateModalOpen,
    setIsOnboardingOpen,
    activeView,
    setActiveView
  } = useWorkspace();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'student':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'business':
        return <Store className="w-4 h-4 text-emerald-500" />;
      case 'freelancer':
        return <Laptop className="w-4 h-4 text-amber-500" />;
      case 'employee':
        return <Briefcase className="w-4 h-4 text-cyan-500" />;
      case 'personal':
        return <Sparkles className="w-4 h-4 text-pink-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <header className="workspace-navbar sticky top-0 z-30">
      <div className="navbar-content flex items-center justify-between gap-4">
        {/* Left: Branding & Workspace Switcher */}
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <button
            aria-label="Talibon Workspace dashboard"
            onClick={() => setActiveView('dashboard')}
            className="workspace-brand flex items-center gap-2 cursor-pointer group text-left"
          >
            <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 tracking-tight text-base block leading-none">
                Talibon Workspace
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Personalized Workstation
              </span>
            </div>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* Workspace Switcher */}
          <div className="relative">
            <button
              aria-label="Switch workspace"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="workspace-switcher flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200/70 hover:border-slate-300 bg-white/60 hover:bg-white transition-colors text-left"
            >
              <div
                className="w-2.5 h-2.5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: activeWorkspace.color }}
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[150px] md:max-w-[200px]">
                  {activeWorkspace.name}
                </span>
                <span className="text-[10px] text-slate-500 capitalize">
                  {activeWorkspace.role} Workspace
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="workspace-dropdown absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Your Workspaces
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {workspaces.map(ws => (
                      <button
                        key={ws.id}
                        onClick={() => {
                          switchWorkspace(ws.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                          ws.id === activeWorkspace.id ? 'bg-indigo-50/70 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: ws.color }}
                          />
                          <div className="truncate">
                            <p className="text-xs text-slate-800 truncate">{ws.name}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{ws.role}</p>
                          </div>
                        </div>
                        {ws.id === activeWorkspace.id && (
                          <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsCreateModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      New Workspace from Role
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Search */}
        <div className="workspace-search flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            aria-label="Search workspace"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search your workspace..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white rounded-lg border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
          />
        </div>

        {/* Right: Actions */}
        <div className="navbar-actions flex items-center gap-2 sm:gap-3">
          {/* Guide / Onboarding */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            title="Workspace Overview & Roles"
            aria-label="Workspace overview and roles"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 text-xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">Roles</span>
          </button>

          {/* Edit Mode Toggle */}
          {activeView === 'dashboard' && (
            <button
              onClick={() => setEditMode(prev => !prev)}
              className={`navbar-arrange flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                editMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>{editMode ? 'Done Editing' : 'Arrange'}</span>
            </button>
          )}

          {/* Customize Drawer Trigger */}
          <button
            aria-label="Customize workspace"
            onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
            className="navbar-customize flex items-center gap-1.5 p-2.5 text-sm font-medium text-slate-600 bg-white/60 hover:bg-white rounded-full border border-slate-200/60 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="sr-only">Customize</span>
          </button>
          <button onClick={() => setActiveView('settings')} className="account-button" aria-label="Workspace settings" title={activeWorkspace.name}>{activeWorkspace.name.charAt(0)}</button>
        </div>
      </div>
    </header>
  );
};
