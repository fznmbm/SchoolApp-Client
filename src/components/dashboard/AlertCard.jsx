import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { format, isAfter, subDays } from 'date-fns';

const AlertCard = ({ title, description, type, date, link }) => {
  const { alertDate, isExpired, isUrgent, alertStyles } = useMemo(() => {
    const parsedDate = new Date(date);
    const today = new Date();
    const expired = isAfter(today, parsedDate);
    const urgent = isAfter(today, subDays(parsedDate, 7)) && !expired;    
    let styles;
    
    if (expired) {
      styles = {
        bg: 'bg-red-100 dark:bg-red-900/20',
        border: 'border-red-500 dark:border-red-600',
        text: 'text-red-800 dark:text-red-300',
        icon: 'text-red-500 dark:text-red-400'
      };
    } else if (urgent) {
      styles = {
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        border: 'border-yellow-500 dark:border-yellow-600',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: 'text-yellow-500 dark:text-yellow-400'
      };
    } else {
      styles = {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        border: 'border-blue-500 dark:border-blue-600',
        text: 'text-blue-800 dark:text-blue-300',
        icon: 'text-blue-500 dark:text-blue-400'
      };
    }
    
    return { 
      alertDate: parsedDate, 
      isExpired: expired, 
      isUrgent: urgent, 
      alertStyles: styles 
    };
  }, [date]);
  
  const formattedDate = useMemo(() => {
    return format(alertDate, 'MMM dd, yyyy');
  }, [alertDate]);

  const CardWrapper = ({ children }) => {
    if (!link) {
      return (
        <div 
          className={`rounded-md p-3 border-l-4 ${alertStyles.bg} ${alertStyles.border} transition-colors duration-200`}
          role="alert"
          aria-live={isExpired ? "assertive" : "polite"}
        >
          {children}
        </div>
      );
    }

    return (
      <Link 
        to={link}
        className={`block rounded-md p-3 border-l-4 ${alertStyles.bg} ${alertStyles.border} transition-colors duration-200 
          hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 
          focus:ring-opacity-60 focus:ring-current cursor-pointer`}
        role="alert"
        aria-live={isExpired ? "assertive" : "polite"}
        aria-label={`Alert: ${title}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <ExclamationTriangleIcon 
            className={`h-5 w-5 mr-2 mt-0.5 ${alertStyles.icon}`} 
            aria-hidden="true" 
          />
          <div>
            <h4 className={`font-medium text-sm ${alertStyles.text}`}>
              {title}
            </h4>
            {description && (
              <p className={`text-xs mt-1 ${alertStyles.text} opacity-90`}>
                {description}
              </p>
            )}
          </div>
        </div>
        <div className={`flex items-center text-xs ${alertStyles.text}`}>
          <ClockIcon className="h-3 w-3 mr-1" aria-hidden="true" />
          <span title={`Alert date: ${formattedDate}`}>
            {formattedDate}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};

export default AlertCard;