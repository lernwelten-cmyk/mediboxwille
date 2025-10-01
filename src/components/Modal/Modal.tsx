/**
 * Modal Component
 * Full-screen modal with large content for senior accessibility
 */

import React, { useEffect } from 'react';
import type { ModalProps } from './Modal.types';
import { Button } from '../Button';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = 'large'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-full h-full'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ paddingTop: 'var(--safe-area-top)', paddingBottom: 'var(--safe-area-bottom)' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content - Full-screen on mobile, centered on desktop */}
      <div className={`relative bg-white shadow-2xl w-full overflow-y-auto
        md:rounded-2xl md:mx-4 md:max-h-[90vh] md:${sizeClasses[size]}
        max-md:h-full max-md:max-w-full`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center md:rounded-t-2xl">
          <h2 className="text-senior-xl font-bold">{title}</h2>
          {showCloseButton && (
            <Button
              variant="secondary"
              size="medium"
              onClick={onClose}
              icon="✕"
            >
              Schließen
            </Button>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 pb-20">
          {children}
        </div>
      </div>
    </div>
  );
};
