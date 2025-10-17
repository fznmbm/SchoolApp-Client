import React from 'react';

export default function SimpleInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  className = '',
  ...props
}) {
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
         type={type}
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         required={required}
         className={`
           block w-full rounded-lg px-4 py-3
           text-white text-sm
           bg-gray-700 border border-gray-600
           placeholder:text-gray-400
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
