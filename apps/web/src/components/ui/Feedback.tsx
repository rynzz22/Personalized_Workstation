import React, { Component, ReactNode, ErrorInfo } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center">
      {icon && <div className="text-slate-300 mb-2">{icon}</div>}
      <h4 className="text-xs font-bold text-slate-800">{title}</h4>
      {description && <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizes[size]} border-indigo-600 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 text-center text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-200">
            An error occurred while loading this section.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
