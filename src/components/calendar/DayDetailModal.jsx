import React, { useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { monthNames } from './calendarConstants';
import Event from './Event';


const DayDetailModal = ({ day, onClose }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    if (modalRef.current) {
      modalRef.current.focus();
    }
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  
  if (!day) return null;
  
  const date = new Date(day.date);
  const dayOfMonth = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  
  // Format the title based on whether we have a route or not
  const title = day.route 
    ? `${dayOfMonth} ${month} ${year} - Route ${day.route}`
    : `${dayOfMonth} ${month} ${year}`;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-colors duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-gray-900 w-full max-w-md max-h-[80vh] overflow-auto focus:outline-none transition-colors duration-200"
        tabIndex="-1"
      >
        {/* Header */}
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 rounded-t-xl border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <h3 
              id="modal-title"
              className="text-xl font-semibold text-gray-800 dark:text-white transition-colors duration-200"
            >
              {title}
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm mt-1 transition-colors duration-200">
            {dayOfWeek}
          </div>
        </div>
        
        {/* Body */}
        <div className="p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-b-xl transition-colors duration-200">
          <h4 className="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-200">
            EVENTS ({day.events?.length || 0})
          </h4>
          
          {!day.events || day.events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="text-gray-400 dark:text-gray-400 text-lg mb-2 transition-colors duration-200">
                No events for this day
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {day.events.map((event, idx) => (
                <div 
                  key={idx} 
                  className="rounded-lg transition-colors duration-200"
                >
                  <Event event={event} isDetailed={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;