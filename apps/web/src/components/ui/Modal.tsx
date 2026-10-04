import React, { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className={`bg-white rounded-2xl ${maxWidth} w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150`}>
        {title && (
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {title && (
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-1 rounded text-slate-400 hover:bg-slate-100">
              ✕
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
};

export const Dialog = Modal;
