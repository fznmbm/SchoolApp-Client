import React from 'react';

export default function SimpleFileUpload({
  label,
  name,
  onChange,
  required = false,
  accept = '*/*',
  className = '',
  ...props
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
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
         type="file"
         onChange={handleFileChange}
         accept={accept}
         required={required}
         className={`
           block w-full rounded-lg px-4 py-3
           text-white text-sm
           bg-gray-700 border border-gray-600
           shadow-sm
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
           hover:border-gray-500
           transition-colors duration-200
           file:mr-4 file:py-2 file:px-4
           file:rounded-full file:border-0
           file:text-sm file:font-semibold
           file:bg-blue-600 file:text-white
           hover:file:bg-blue-700
           ${className}
         `}
         {...props}
       />
    </div>
  );
}
