import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ className = '', variant = 'neutral', children, ...props }) => {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({ className = '', variant = 'info', title, children, ...props }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
  };

  return (
    <div className={`p-3.5 rounded-xl border text-xs ${styles[variant]} ${className}`} {...props}>
      {title && <h4 className="font-bold mb-0.5">{title}</h4>}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
};

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-medium animate-in slide-in-from-bottom-2">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-white ml-2">
          ✕
        </button>
      )}
    </div>
  );
};
