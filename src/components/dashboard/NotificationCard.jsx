import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BellIcon } from '@heroicons/react/24/outline';

const NotificationCard = ({ title, count, newCount, link, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'group-hover:text-blue-800 dark:group-hover:text-blue-300'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400',
      hover: 'group-hover:text-green-800 dark:group-hover:text-green-300'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      icon: 'text-orange-600 dark:text-orange-400',
      text: 'text-orange-600 dark:text-orange-400',
      hover: 'group-hover:text-orange-800 dark:group-hover:text-orange-300'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      icon: 'text-purple-600 dark:text-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'group-hover:text-purple-800 dark:group-hover:text-purple-300'
    }
  };

  const classes = colorClasses[color] || colorClasses.blue;

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
        aria-label={`View ${title}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <div className="flex h-full">
        {/* Left Section - Title and Icon */}
        <div className="flex items-center flex-1 pr-6">
          <div className={`rounded-full ${classes.bg} p-4 ${classes.icon} transition-colors duration-200 mr-4`}>
            {icon || <BellIcon className="h-8 w-8" />}
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        </div>
        
        {/* Middle Section - Pending */}
        <div className="flex flex-col items-center justify-center px-6 border-l border-r border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pending</span>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{count}</p>
        </div>
        
        {/* Right Section - New */}
        <div className="flex flex-col items-center justify-center px-6">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">New</span>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{newCount}</p>
        </div>
      </div>
      {link && (
        <div className={`mt-4 text-sm ${classes.text} ${classes.hover} flex items-center transition-colors duration-200`}>
          View all
          <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      )}
    </CardWrapper>
  );
};

export default NotificationCard;
