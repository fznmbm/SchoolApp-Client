import React from 'react';
import { TruckIcon } from "@heroicons/react/24/outline";
import StatusBadge from './StatusBadge';

const VehicleDetailsCard = ({ vehicle }) => {
  if (!vehicle) {
    return (
      <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg transition-colors duration-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-white transition-colors duration-200">
            Vehicle Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
            No vehicle information available
          </p>
        </div>
        <div className="border-t border-border-light dark:border-border-dark-mode px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          No vehicle has been registered for this driver
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg transition-colors duration-200">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-white transition-colors duration-200">
          Vehicle Details
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Vehicle information and status
        </p>
      </div>
      <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
        <dl>
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Vehicle</dt>
            <dd className="mt-1 text-sm text-text-primary dark:text-white sm:mt-0 sm:col-span-2 transition-colors duration-200">
              <div className="flex items-center">
                <TruckIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                {vehicle?.make} {vehicle?.model} ({vehicle?.type})
              </div>
            </dd>
          </div>

          <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Registration
            </dt>
            <dd className="mt-1 text-sm text-text-primary dark:text-white sm:mt-0 sm:col-span-2 transition-colors duration-200">
              {vehicle?.registrationNumber}
            </dd>
          </div>

          {vehicle?.status && (
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Vehicle Status
              </dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                <StatusBadge status={vehicle?.status} />
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default VehicleDetailsCard;