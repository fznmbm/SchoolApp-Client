import React from 'react';

export default function SimpleDatePicker({
  label,
  name,
  value,
  onChange,
  required = false,
  className = '',
  ...props
}) {
  // Convert Date object to YYYY-MM-DD format for input
  const formatDateForInput = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return '';
  };

  // Convert YYYY-MM-DD string to Date object
  const handleDateChange = (e) => {
    const dateString = e.target.value;
    if (dateString) {
      const date = new Date(dateString);
      onChange(date);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="w-full">
             {label && (
         <label
           htmlFor={name}
           className="block text-sm font-medium mb-2 text-gray-200"
         >
           {label}
           {required && <span className="ml-1 text-red-400">*</span>}
         </label>
       )}
       
       <input
         id={name}
         name={name}
         type="date"
         value={formatDateForInput(value)}
         onChange={handleDateChange}
         required={required}
         className={`
           block w-full rounded-lg px-4 py-3
           text-white text-sm
           bg-gray-700 border border-gray-600
           shadow-sm
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
           hover:border-gray-500
           transition-colors duration-200
           ${className}
         `}
         {...props}
       />
    </div>
  );
}
