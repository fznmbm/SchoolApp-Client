import React from "react";

const PricingSection = ({ route }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Price Per Mile
            </p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">£{route.pricePerMile || '0.00'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Price</p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">£{route.dailyPrice || '0.00'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Driver Price
            </p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">£{route.driverPrice || '0.00'}</p>
          </div>
          {route.isPANeeded && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PA Price</p>
              <p className="mt-1 text-gray-800 dark:text-gray-200">£{route.paPrice || '0.00'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;