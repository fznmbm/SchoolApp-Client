import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="mb-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                              placeholder-gray-500 dark:placeholder-gray-400
                              focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                              dark:focus:ring-blue-400 dark:focus:border-blue-400
                              sm:text-sm transition-colors duration-200"
                    placeholder="Search passengers, drivers..."
                    value={value}
                    onChange={onChange}
                    aria-label="Search jobs"
                />
            </div>
        </div>
    );
};

export default SearchBar;