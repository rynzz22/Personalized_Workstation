import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';

export const FocusTimeWidget: React.FC<{ workspaceId: string }> = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(2);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(sec => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      setSessionsCompleted(c => c + 1);
      setSecondsLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  return (
    <div className="flex flex-col h-full items-center justify-between text-center">
      <div className="w-full flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Pomodoro Focus
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
          <Flame className="w-3 h-3 fill-rose-500" />
          {sessionsCompleted} completed
        </span>
      </div>

      <div className="my-auto py-2">
        <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
          {timeFormatted}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">25 min deep work sprint</p>
      </div>

      <div className="flex items-center gap-2 w-full">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Start Sprint</span>
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
