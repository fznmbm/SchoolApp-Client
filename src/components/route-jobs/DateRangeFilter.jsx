import React, { useState, useContext } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Button } from '@components/common/Button';
import DatePicker from '@components/common/input/DatePicker';
import { ThemeContext } from '@context/ThemeContext';

const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    const { theme } = useContext(ThemeContext);
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

    const handleStartDateChange = (date) => {
        onStartDateChange(date);
        setIsStartDatePickerOpen(false);
    };

    const handleEndDateChange = (date) => {
        onEndDateChange(date);
        setIsEndDatePickerOpen(false);
    };

    return (
        <>
            <div className="relative">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Start Date
                </label>
                <div className="flex items-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                        className="w-full flex justify-between bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors duration-200"
                        aria-haspopup="true"
                        aria-expanded={isStartDatePickerOpen}
                    >
                        <span>{format(startDate, 'MMMM d, yyyy')}</span>
                        <CalendarIcon className="h-5 w-5 ml-2 text-gray-600 dark:text-gray-400 transition-colors duration-200" />
                    </Button>
                </div>
                {isStartDatePickerOpen && (
                    <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <DatePicker
                            selectedDate={startDate}
                            onChange={handleStartDateChange}
                            onClose={() => setIsStartDatePickerOpen(false)}
                            theme={theme}
                        />
                    </div>
                )}
            </div>

            <div className="relative">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    End Date
                </label>
                <div className="flex items-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEndDatePickerOpen(!isEndDatePickerOpen)}
                        className="w-full flex justify-between bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors duration-200"
                        aria-haspopup="true"
                        aria-expanded={isEndDatePickerOpen}
                    >
                        <span>{format(endDate, 'MMMM d, yyyy')}</span>
                        <CalendarIcon className="h-5 w-5 ml-2 text-gray-600 dark:text-gray-400 transition-colors duration-200" />
                    </Button>
                </div>
                {isEndDatePickerOpen && (
                    <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <DatePicker
                            selectedDate={endDate}
                            onChange={handleEndDateChange}
                            onClose={() => setIsEndDatePickerOpen(false)}
                            theme={theme}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default DateRangeFilter;