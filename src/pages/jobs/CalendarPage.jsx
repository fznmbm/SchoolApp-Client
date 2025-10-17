import React, { useState, useContext } from 'react';
import Calendar from '@components/calendar/CalenderView';
import RouteScheduleView from '@components/calendar/RouteScheduleView';
import { ViewColumnsIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '@context/ThemeContext';

const CalendarPage = () => {
  const [viewMode, setViewMode] = useState('table'); // 'calendar' or 'table'
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="container mx-auto py-4 px-4 transition-colors duration-200">
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
            Route Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            View school holidays, temporary driver assignments, special services, and absences
          </p>
        </div>
        
        <div className="flex border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 mt-2 sm:mt-0 transition-colors duration-200">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center px-3 py-2 transition-colors duration-200 ${
              viewMode === 'table' 
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            aria-label="Switch to route view"
          >
            <ViewColumnsIcon className="h-5 w-5 mr-1" />
            <span>Route View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center px-3 py-2 transition-colors duration-200 ${
              viewMode === 'calendar' 
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            aria-label="Switch to calendar view"
          >
            <CalendarIcon className="h-5 w-5 mr-1" />
            <span>Calendar View</span>
          </button>
        </div>
      </div>
      
      {viewMode === 'calendar' ? <Calendar /> : <RouteScheduleView />}
    </div>
  );
};

export default CalendarPage;