import React from 'react';

const AttendanceCheckbox = ({ checked, onChange, label }) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 
                     border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
            aria-label={label}
        />
    );
};

export default AttendanceCheckbox;