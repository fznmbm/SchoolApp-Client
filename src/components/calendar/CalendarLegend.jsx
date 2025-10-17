import React, { useContext } from 'react';
import {
  AcademicCapIcon,
  TruckIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { ThemeContext } from '@context/ThemeContext';


const LegendItem = ({ icon, color, darkColor, iconColor, darkIconColor, label, description }) => {
  return (
    <div className="flex items-center mb-2 group">
      <div className={`p-1 rounded-full ${color} ${darkColor} mr-2 transition-colors duration-200`}>
        {React.cloneElement(icon, { 
          className: `h-4 w-4 ${iconColor} ${darkIconColor} transition-colors duration-200` 
        })}
      </div>
      <div>
        <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
          {label}:
        </span>{' '}
        <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
          {description}
        </span>
      </div>
    </div>
  );
};


const CalendarLegend = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200" 
         role="region" 
         aria-label="Calendar legend">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
        Calendar Legend
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <LegendItem 
          icon={<AcademicCapIcon />}
          color="bg-blue-100"
          darkColor="dark:bg-blue-900/50"
          iconColor="text-blue-600"
          darkIconColor="dark:text-blue-400"
          label="School Holidays"
          description="Days when schools are closed"
        />
        <LegendItem 
          icon={<TruckIcon />}
          color="bg-yellow-100"
          darkColor="dark:bg-yellow-900/50"
          iconColor="text-yellow-600"
          darkIconColor="dark:text-yellow-400"
          label="Temporary Drivers"
          description="Routes with substitute drivers assigned"
        />
        <LegendItem 
          icon={<ClockIcon />}
          color="bg-purple-100"
          darkColor="dark:bg-purple-900/50"
          iconColor="text-purple-600"
          darkIconColor="dark:text-purple-400"
          label="Special Services"
          description="Custom pickup/dropoff arrangements"
        />
        <LegendItem 
          icon={<ExclamationCircleIcon />}
          color="bg-red-100"
          darkColor="dark:bg-red-900/50"
          iconColor="text-red-600"
          darkIconColor="dark:text-red-400"
          label="Absences"
          description="Students reported absent (non-holiday)"
        />
      </div>
    </div>
  );
};

export default CalendarLegend;