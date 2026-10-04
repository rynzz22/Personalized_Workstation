import React, { FormHTMLAttributes, LabelHTMLAttributes, HTMLAttributes } from 'react';

export const Form: React.FC<FormHTMLAttributes<HTMLFormElement>> = ({ className = '', children, ...props }) => {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
};

export const Label: React.FC<LabelHTMLAttributes<HTMLLabelElement>> = ({ className = '', children, ...props }) => {
  return (
    <label className={`block text-xs font-semibold text-slate-700 mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
};

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Field: React.FC<FieldProps> = ({ label, error, hint, children, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`} {...props}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && !error && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
    </div>
  );
};
