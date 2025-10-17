import React, { useState } from 'react';
import { 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    CalendarIcon
} from '@heroicons/react/24/outline';
import { Button } from '@components/common/Button';
import DatePicker from '@components/common/input/DatePicker';

const DateNavigation = ({ 
    selectedDate, 
    onDateChange, 
    goToPreviousDay, 
    goToNextDay, 
    displayDate
}) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const handleDateChange = (date) => {
        onDateChange(date);
        setIsDatePickerOpen(false);
    };

    return (
        <div className="space-y-4">
            {/* Control buttons row */}
            <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="relative">
                    <Button
                        variant="outline"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        aria-haspopup="true"
                        aria-expanded={isDatePickerOpen}
                        className="rounded-full shadow-sm hover:shadow text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 
                            hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                        <CalendarIcon className="h-5 w-5 mr-1.5" />
                        <span className="font-medium">Select Date</span>
                    </Button>

                    {isDatePickerOpen && (
                        <div className="absolute z-50 mt-2 right-0 shadow-xl rounded-lg overflow-hidden transform transition-all duration-200 origin-top-right">
                            <DatePicker
                                selectedDate={selectedDate}
                                onChange={handleDateChange}
                                onClose={() => setIsDatePickerOpen(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Date display with navigation */}
            <div className="w-full overflow-hidden">
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 
                    p-4 rounded-xl shadow-sm border border-blue-100 dark:border-gray-600 transition-all duration-200">
                    <button
                        onClick={goToPreviousDay}
                        className="p-2 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                            shadow-sm hover:shadow transition-all duration-200 text-blue-600 dark:text-blue-400
                            focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-50"
                        aria-label="Previous day"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                            {displayDate.split(',')[1]?.trim()}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {displayDate.split(',')[0]}, {displayDate.split(',')[2]}
                        </p>
                    </div>

                    <button
                        onClick={goToNextDay}
                        className="p-2 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                            shadow-sm hover:shadow transition-all duration-200 text-blue-600 dark:text-blue-400
                            focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-50"
                        aria-label="Next day"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateNavigation;