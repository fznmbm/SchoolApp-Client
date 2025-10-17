import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';

const Popup = ({ isOpen, onClose, onConfirm, message, title }) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Prevent background scrolling when popup is open
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

  // Render nothing if not open
  if (!isOpen) return null;
  
  // Use portal to render outside the main component hierarchy
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
          
          <div className="flex min-h-full items-center justify-center p-4 text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl border border-gray-200 dark:border-gray-700 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              aria-modal="true"
              role="dialog"
              aria-labelledby="popup-title"
              aria-describedby="popup-message"
            >
              <h3 
                id="popup-title" 
                className="text-lg font-medium text-gray-900 dark:text-white mb-4"
              >
                {title}
              </h3>
              <p 
                id="popup-message" 
                className="text-sm text-gray-500 dark:text-gray-400 mb-6"
              >
                {message}
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={onClose}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                  aria-label="Cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
                  aria-label="Confirm"
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Usage example
export const usePopup = () => {
  const [popupState, setPopupState] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const openPopup = (title, message, onConfirm) => {
    setPopupState({ isOpen: true, title, message, onConfirm });
  };

  const closePopup = () => {
    setPopupState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    Popup: () => (
      <Popup
        isOpen={popupState.isOpen}
        title={popupState.title}
        message={popupState.message}
        onConfirm={() => {
          popupState.onConfirm();
          closePopup();
        }}
        onClose={closePopup}
      />
    ),
    openPopup,
    closePopup,
  };
};

export default Popup;