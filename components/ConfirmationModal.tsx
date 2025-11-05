import React, { Fragment } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" 
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center p-6 m-4 max-w-sm w-full transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100" id="modal-title">
          {title}
        </h3>
        <div className="mt-2">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {children}
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
            onClick={onClose}
          >
            Got it, thanks!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
