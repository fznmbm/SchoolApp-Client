import React from 'react';
import { format } from 'date-fns';

const formatValue = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') return value.toFixed(2);
  if (typeof value === 'string') {
    // Try to parse as date
    const date = new Date(value);
    if (!isNaN(date)) {
      return format(date, 'dd MMM yyyy');
    }
    return value;
  }
  return JSON.stringify(value);
};

const HistoryDetailsCell = ({ details }) => {
  // Handle approval/rejection reasons
  if (details?.reason) {
    return <span>{details.reason}</span>;
  }

  // Handle creation note
  if (details?.note) {
    return <span>{details.note}</span>;
  }

  // Handle update diffs
  if (details && typeof details === 'object') {
    return (
      <div className="space-y-2">
        {Object.entries(details).map(([field, changes]) => {
          if (changes.before === undefined || changes.after === undefined) return null;
          
          // Special handling for arrays (weeks, extraJobs)
          if (Array.isArray(changes.before) || Array.isArray(changes.after)) {
            const beforeCount = Array.isArray(changes.before) ? changes.before.length : 0;
            const afterCount = Array.isArray(changes.after) ? changes.after.length : 0;
            
            if (field === 'extraJobs') {
              return (
                <div key={field} className="text-sm">
                  <span className="font-medium">Extra Jobs:</span> Changed from {beforeCount} to {afterCount} jobs
                </div>
              );
            }
            
            if (field === 'weeks') {
              return (
                <div key={field} className="text-sm">
                  <span className="font-medium">Weekly Routes:</span> Updated {afterCount} weeks
                </div>
              );
            }
          }

          // Handle simple value changes
          return (
            <div key={field} className="text-sm">
              <span className="font-medium">{field}:</span>{' '}
              <span className="line-through text-red-500 dark:text-red-400">
                {formatValue(changes.before)}
              </span>
              {' → '}
              <span className="text-green-500 dark:text-green-400">
                {formatValue(changes.after)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return <span>-</span>;
};

export default HistoryDetailsCell;
