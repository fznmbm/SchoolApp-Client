import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon, link }) => {
  const CardWrapper = ({ children }) => {
    const baseClasses = "bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 border border-transparent dark:border-gray-700 p-4 flex flex-col transition-colors duration-200";
    
    if (!link) {
      return (
        <div className={baseClasses}>
          {children}
        </div>
      );
    }

    return (
      <Link 
        to={link}
        className={`${baseClasses} hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer group`}
        aria-label={`View all ${title}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="rounded-full bg-blue-50 dark:bg-blue-900/30 p-3 text-blue-600 dark:text-blue-400 transition-colors duration-200">
          {icon}
        </div>
      </div>
      {link && (
        <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 flex items-center transition-colors duration-200">
          View all
          <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      )}
    </CardWrapper>
  );
};

export default StatCard;