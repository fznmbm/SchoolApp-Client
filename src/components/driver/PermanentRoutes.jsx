import React from 'react';
import { MapIcon, CurrencyDollarIcon, TruckIcon } from "@heroicons/react/24/outline";

export const CardWrapper = ({ title, children, isEmpty = false, emptyMessage = "No data available" }) => (
  <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg mt-6 transition-colors duration-200">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-white transition-colors duration-200">
        {title}
      </h3>
    </div>
    <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
      {isEmpty ? (
        <div className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {emptyMessage}
        </div>
      ) : children}
    </div>
  </div>
);

const PermanentRoutes = ({ routes }) => {
  if (!routes || routes.length === 0) {
    return (
      <CardWrapper 
        title="Permanent Route Assignments" 
        isEmpty 
        emptyMessage="No permanent routes assigned" 
      />
    );
  }

  return (
    <CardWrapper title="Permanent Route Assignments">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
        {routes.map((route) => (
          <li key={route._id} className="px-4 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <MapIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                  <h4 className="text-sm font-medium text-text-primary dark:text-white transition-colors duration-200">
                    {route.name} <span className="text-gray-500 dark:text-gray-400 ml-1 transition-colors duration-200">({route.routeNo})</span>
                  </h4>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    Driver Price: {route.driverPrice ? `£${route.driverPrice.toFixed(2)}` : 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    Daily Price: £{route.dailyPrice?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <TruckIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    Capacity: {route.capacity || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <MapIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    Daily Miles: {route.dailyMiles || 'N/A'}
                  </div>
                </div>

                {route.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    {route.description}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </CardWrapper>
  );
};

export default PermanentRoutes;