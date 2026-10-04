import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', elevated = false, children, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 ${
        elevated ? 'shadow-md shadow-slate-200/50' : 'shadow-xs'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
