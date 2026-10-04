import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          className={`w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 transition-colors ${className}`}
          {...props}
        />
        {label && <span className="text-xs text-slate-700 font-medium">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="radio"
          className={`w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 transition-colors ${className}`}
          {...props}
        />
        {label && <span className="text-xs text-slate-700 font-medium">{label}</span>}
      </label>
    );
  }
);
Radio.displayName = 'Radio';
