import React from 'react';
import { format } from 'date-fns';

const PeriodCell = ({ periodFrom, periodTo }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-1">
      <div className="text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        From: {formatDate(periodFrom)}
      </div>
      <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        To: {formatDate(periodTo)}
      </div>
    </div>
  );
};

export default PeriodCell;