import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/common/Button';
import {
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useHolidayManagement } from '@hooks/useHolidayManagement';

export const SchoolHolidays = ({ school, id, queryClient }) => {
  const {
    holidayList,
    isEditingHolidays,
    isUpdatingHolidays,
    startEditingHolidays,
    cancelEditingHolidays,
    handleAddHoliday,
    handleRemoveHoliday,
    handleHolidayChange,
    handleSaveHolidays
  } = useHolidayManagement({ id, school, queryClient });

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors duration-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">School Holidays</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Scheduled holiday periods</p>
        </div>
        
        {!isEditingHolidays ? (
          <Button
            onClick={startEditingHolidays}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white flex items-center h-10 px-4 py-2 transition-colors duration-200"
            aria-label="Edit holidays"
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            Edit
          </Button>
        ) : (
          <div className='flex gap-3'>
            <Button
              onClick={cancelEditingHolidays}
              type="button"
              variant='outline'
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 h-10 px-4 py-2 transition-colors duration-200"
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveHolidays}
              disabled={isUpdatingHolidays}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white h-10 px-4 py-2 transition-colors duration-200"
              aria-label="Save holidays"
            >
              {isUpdatingHolidays ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      {!isEditingHolidays ? (
        <ViewHolidays holidays={school?.holidays} />
      ) : (
        <EditHolidays 
          holidayList={holidayList} 
          handleAddHoliday={handleAddHoliday}
          handleRemoveHoliday={handleRemoveHoliday}
          handleHolidayChange={handleHolidayChange}
        />
      )}
    </div>
  );
};

const ViewHolidays = ({ holidays }) => (
  <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
    {holidays?.length > 0 ? (
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
        {holidays.map((holiday, index) => (
          <li key={index} className="px-6 py-4">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 transition-colors duration-200" />
              <div>
                <p className="text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {format(new Date(holiday.startDate), 'PPP')} - {format(new Date(holiday.endDate), 'PPP')}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="px-6 py-5 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
        No holidays scheduled
      </div>
    )}
  </div>
);

const EditHolidays = ({ holidayList, handleAddHoliday, handleRemoveHoliday, handleHolidayChange }) => (
  <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
    {holidayList.length > 0 ? (
      <div className="space-y-5">
        {holidayList.map((holiday, index) => (
          <div key={index} className="flex items-start space-x-3 border border-gray-200 dark:border-gray-700 rounded-md p-4 transition-colors duration-200">
            <div className="grid grid-cols-2 gap-4 flex-grow">
              <div>
                <label 
                  htmlFor={`startDate-${index}`} 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="date"
                    id={`startDate-${index}`}
                    value={holiday.startDate}
                    onChange={(e) => handleHolidayChange(index, 'startDate', e.target.value)}
                    className="pl-10 py-2 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    required
                    aria-label={`Holiday ${index + 1} start date`}
                  />
                </div>
              </div>
              <div>
                <label 
                  htmlFor={`endDate-${index}`} 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                >
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="date"
                    id={`endDate-${index}`}
                    value={holiday.endDate}
                    onChange={(e) => handleHolidayChange(index, 'endDate', e.target.value)}
                    min={holiday.startDate}
                    className="pl-10 py-2 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    required
                    aria-label={`Holiday ${index + 1} end date`}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemoveHoliday(index)}
              type="button"
              className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors duration-200 mt-6"
              aria-label={`Remove holiday ${index + 1}`}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400 transition-colors duration-200">
        No holidays added yet
      </div>
    )}

    <div className="mt-5">
      <Button
        onClick={handleAddHoliday}
        type="button"
        className="dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white transition-colors duration-200"
        aria-label="Add holiday"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Holiday
      </Button>
    </div>
  </div>
);