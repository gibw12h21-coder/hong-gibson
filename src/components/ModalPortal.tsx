import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ModalPortal: React.FC<ModalPortalProps> = ({ isOpen, children, className = "bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className={className}
        style={{
          position: 'relative',
          margin: 'auto',
          transform: 'none',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
