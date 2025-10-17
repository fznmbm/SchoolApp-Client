import React from "react";

const RouteInformation = ({ route }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Route Information
        </h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Route Number
            </p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{route.routeNo}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{route.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Driver PO Number</p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{route.poNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PA PO Number</p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{route.paPoNumber || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Miles</p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{route.dailyMiles} miles</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Vehicle Capacity Required
            </p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{route.capacity} seats</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Invoice Template
            </p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{route.invoiceTemplate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteInformation;