import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { monthNames } from './calendarConstants';

/**
 * Calendar header with navigation controls
 */
const CalendarHeader = ({ month, year, onPrevMonth, onNextMonth, onToday }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">
        {monthNames[month]} {year}
      </h2>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToday}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm
                     text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-700
                     transition-colors duration-200"
          aria-label="Go to today"
        >
          Today
        </button>
        <div className="flex items-center">
          <button 
            onClick={onPrevMonth}
            className="p-1 rounded-full 
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       text-gray-600 dark:text-gray-400
                       transition-colors duration-200"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={onNextMonth}
            className="p-1 rounded-full 
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       text-gray-600 dark:text-gray-400
                       transition-colors duration-200"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;