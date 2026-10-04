import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Sparkles,
  Layers,
  GraduationCap,
  BookOpen,
  Store,
  CheckCircle,
  Sliders,
  Move,
  ArrowRight
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, switchWorkspace, workspaces } = useWorkspace();

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    localStorage.setItem('talibon_onboarding_done', 'true');
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm shadow-indigo-100">
          <Layers className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Welcome to Talibon Workspace
        </h2>
        <p className="text-xs text-indigo-600 font-semibold tracking-wide uppercase mt-1">
          Personalized Productivity, Planning and Progress Platform
        </p>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          <em>"Your work, your dashboard, your way."</em> A modular platform where your dashboard adapts around your exact role, goals, and daily responsibilities.
        </p>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-left">
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
            <GraduationCap className="w-5 h-5 text-blue-600 mb-1" />
            <h4 className="text-xs font-bold text-slate-900">Role Templates</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Instant setups for Teachers, Students, Small Businesses, and Professionals.
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <Sliders className="w-5 h-5 text-indigo-600 mb-1" />
            <h4 className="text-xs font-bold text-slate-900">Modular Widgets</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Add, resize, reorder, or remove tiles matching what matters most to you.
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <Layers className="w-5 h-5 text-emerald-600 mb-1" />
            <h4 className="text-xs font-bold text-slate-900">Multi-Context</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Seamlessly switch between school, store, and personal workspaces.
            </p>
          </div>
        </div>

        {/* Quick Role Jump */}
        <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-left">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Try a Preloaded Workspace:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => {
                  switchWorkspace(ws.id);
                  handleFinish();
                }}
                className="p-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-left transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: ws.color }}
                  />
                  <span className="text-xs font-bold text-slate-800 capitalize truncate">
                    {ws.role}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{ws.name}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleFinish}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
        >
          <span>Get Started with Talibon Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
