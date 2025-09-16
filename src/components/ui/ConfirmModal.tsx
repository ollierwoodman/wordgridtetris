import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import { Modal } from './modal';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600 dark:text-red-500',
          confirmButton: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white',
          cancelButton: 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        };
      case 'warning':
        return {
          icon: 'text-yellow-600 dark:text-yellow-500',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white',
          cancelButton: 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        };
      case 'info':
        return {
          icon: 'text-blue-600 dark:text-blue-500',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
          cancelButton: 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        };
      default:
        return {
          icon: 'text-red-600 dark:text-red-500',
          confirmButton: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white',
          cancelButton: 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} header={title} className="max-w-md">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertTriangleIcon className={`size-12 ${styles.icon}`} />
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-balance">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center text-sm pt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${styles.cancelButton}`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}; 