import React, { HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'U', size = 'md', className = '', ...props }) => {
  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-slate-200 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center border border-indigo-200 ${className}`}
      {...props}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export const Separator: React.FC<{ orientation?: 'horizontal' | 'vertical'; className?: string }> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  if (orientation === 'vertical') {
    return <div className={`w-px h-full bg-slate-200 ${className}`} />;
  }
  return <div className={`w-full h-px bg-slate-200 ${className}`} />;
};

export const Icon: React.FC<{ component: React.ComponentType<any>; size?: number; className?: string }> = ({
  component: Component,
  size = 16,
  className = '',
}) => {
  return <Component size={size} className={className} />;
};
