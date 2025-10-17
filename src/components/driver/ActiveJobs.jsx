import React from 'react';
import { 
  BriefcaseIcon, 
  MapIcon, 
  CalendarIcon, 
  ClockIcon, 
  CurrencyDollarIcon 
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

const CardWrapper = ({ title, icon: Icon, children, isEmpty = false, emptyMessage = "No data available" }) => (
  <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg mt-6 transition-colors duration-200">
    <div className="px-4 py-5 sm:px-6 flex items-center">
      <Icon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
      <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-white transition-colors duration-200">
        {title}
      </h3>
    </div>
    <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
      {isEmpty ? (
        <div className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {emptyMessage}
        </div>
      ) : children}
    </div>
  </div>
);

const ActiveJobs = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <CardWrapper 
        title="Current Jobs" 
        icon={BriefcaseIcon}
        isEmpty 
        emptyMessage="Not currently working on any jobs" 
      />
    );
  }

  return (
    <CardWrapper title="Current Jobs" icon={BriefcaseIcon}>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
        {jobs.map((job) => (
          <li key={job._id} className="px-4 py-4">
            <div className="flex items-start">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-text-primary dark:text-white transition-colors duration-200">
                  {job.title}
                </h4>

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  <div className="flex items-center">
                    <MapIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    Route: {job.route?.name} ({job.routeNo})
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    {format(new Date(job.startDate), 'MMM d, yyyy')} - {format(new Date(job.endDate), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    Working Days: {job.operatingDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    Daily Price: ${job.route?.dailyPrice?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </CardWrapper>
  );
};

export default ActiveJobs;