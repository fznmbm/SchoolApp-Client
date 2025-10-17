import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12"
};

const Spinner = ({ 
  size = 'md', 
  className, 
  color = 'primary',
  ...props 
}) => {
  const colorClasses = {
    primary: "text-blue-600 dark:text-blue-500",
    secondary: "text-gray-600 dark:text-gray-400",
    success: "text-green-600 dark:text-green-500",
    danger: "text-red-600 dark:text-red-500",
    warning: "text-yellow-600 dark:text-yellow-500",
    info: "text-indigo-600 dark:text-indigo-500",
  };

  return (
    <div className="flex justify-center items-center" role="status">
      <svg
        className={clsx(
          "animate-spin transition-colors duration-200",
          colorClasses[color] || "text-blue-600 dark:text-blue-500",
          sizeClasses[size],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        {...props}
      >
        <circle
          className="opacity-25 transition-colors duration-200"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75 transition-colors duration-200"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  className: PropTypes.string
};

export default Spinner;