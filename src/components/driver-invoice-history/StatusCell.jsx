import React from 'react';
import { DocumentCheckIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const StatusCell = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: <DocumentCheckIcon className="h-4 w-4 mr-1" />,
          text: 'Approved',
          className: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
        };
      case 'REJECTED':
        return {
          icon: <XCircleIcon className="h-4 w-4 mr-1" />,
          text: 'Rejected',
          className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        };
      default:
        return {
          icon: <ClockIcon className="h-4 w-4 mr-1" />,
          text: 'Pending',
          className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
        };
    }
  };

  const { icon, text, className } = getStatusConfig();
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${className}`}
    >
      {icon}
      {text}
    </span>
  );
};

export default StatusCell;