import React from 'react';
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import StatusBadge from './StatusBadge';

const DetailItem = ({ label, children, alternate = false }) => (
  <div className={`${alternate ? 'bg-gray-50 dark:bg-gray-800' : 'bg-surface dark:bg-surface-dark'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200`}>
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
      {label}
    </dt>
    <dd className="mt-1 text-sm text-text-primary dark:text-white sm:mt-0 sm:col-span-2 transition-colors duration-200">
      {children}
    </dd>
  </div>
);

const DriverDetailsCard = ({ driver }) => {
  return (
    <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg transition-colors duration-200">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-white transition-colors duration-200">
          Driver Details
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Personal and professional information
        </p>
      </div>
      <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
        <dl>
          <DetailItem label="Driver Number" alternate>
            {driver?.driverNumber}
          </DetailItem>

          <DetailItem label="Name">
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
              {driver?.name}
            </div>
          </DetailItem>

          <DetailItem label="Short Name">
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
              {driver?.shortName}
            </div>
          </DetailItem>

          <DetailItem label="Contact Information" alternate>
            <div className="space-y-1">
              <div className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                {driver?.phoneNumber}
              </div>
              <div className="flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                {driver?.email}
              </div>
            </div>
          </DetailItem>

          <DetailItem label="Status">
            <StatusBadge status={driver?.status} />
          </DetailItem>

          <DetailItem label="Personal Details" alternate>
            <div className="space-y-1">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                Date of Birth: {new Date(driver?.dateOfBirth).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                Nationality: {driver?.nationality}
              </div>
            </div>
          </DetailItem>
        </dl>
      </div>
    </div>
  );
};

export default DriverDetailsCard;