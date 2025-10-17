import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  ClockIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export const SchoolDetails = ({ school }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors duration-200">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">School Details</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">General information about the school</p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <dl>
          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">School Name</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 transition-colors duration-200">
              <div className="flex items-center">
                <AcademicCapIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                {school?.name}
              </div>
            </dd>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Contact Person</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 transition-colors duration-200">
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                {school?.contact?.contactPerson || 'N/A'}
              </div>
            </dd>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Contact Information</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 transition-colors duration-200">
              <div className="space-y-2">
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                  {school?.contact?.phone || 'N/A'}
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                  {school?.contact?.email || 'N/A'}
                </div>
              </div>
            </dd>
          </div>
          
          <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Address</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 transition-colors duration-200">
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                <span>
                  {school?.address?.street}, {school?.address?.city}, {school?.address?.county}
                  {school?.address?.postCode && `, ${school.address.postCode}`}
                </span>
              </div>
            </dd>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Operating Hours</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 transition-colors duration-200">
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                <span>
                  {school?.operatingHours?.startTime} - {school?.operatingHours?.endTime}
                </span>
              </div>
            </dd>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Status</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 transition-colors duration-200">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                school?.isActive 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              } transition-colors duration-200`}>
                {school?.isActive ? 'Active' : 'Inactive'}
              </span>
            </dd>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Created</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 transition-colors duration-200">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                {school?.createdAt && formatDistanceToNow(new Date(school.createdAt), { addSuffix: true })}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};