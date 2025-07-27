import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import type { ModalProps } from '../../types/game';
import { cn } from '@sglara/cn';

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, header, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure the element is in the DOM before applying visible styles
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsVisible(false);
      // Keep rendered for exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col p-4 m-8 transition-all duration-200 ease-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 motion-reduce:scale-100",
        className
      )}>
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
