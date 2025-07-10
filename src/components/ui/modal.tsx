import React from 'react';
import { XIcon } from 'lucide-react';
import type { ModalProps } from '../../types/game';
import { cn } from '@sglara/cn';

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, header, children, className }) => {
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn("relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col p-4 m-4", className)}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{header}</h2>
          <button
            onClick={() => {
              onClose();
            }}
            className="cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <XIcon />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
