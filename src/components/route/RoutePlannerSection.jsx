import React from "react";

const RoutePlannerSection = ({ routePlanner }) => {
  if (!routePlanner) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Route Planner
          </h3>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400">No route planner assigned</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Route Planner
        </h3>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
              <p className="mt-1 text-gray-800 dark:text-gray-200">{routePlanner.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
              <p className="mt-1 text-gray-800 dark:text-gray-200">{routePlanner.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p className="mt-1 text-gray-800 dark:text-gray-200">{routePlanner.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlannerSection;