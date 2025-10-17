import React from 'react';
import { DocumentCheckIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Notification = ({ message, type, onDismiss }) => {
  const bgColor = type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const textColor = type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300';
  const icon = type === 'success' ? <DocumentCheckIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />;
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg ${bgColor} p-4 max-w-sm transition-colors duration-200`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${textColor}`}>
          {icon}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button 
              type="button" 
              onClick={onDismiss} 
              className={`inline-flex rounded-md ${bgColor} p-1.5 ${textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type === 'success' ? 'green' : 'red'}-50 focus:ring-${type === 'success' ? 'green' : 'red'}-600`}
            >
              <span className="sr-only">Dismiss</span>
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;