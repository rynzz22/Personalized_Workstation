import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, options, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={`w-full text-xs rounded-xl border bg-white px-3 py-2 transition-all outline-none ${
            error
              ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
