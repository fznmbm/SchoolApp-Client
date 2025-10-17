import React from "react";
import { ServiceTypeBadge } from "./StatusBadge";

const SpecialServicesSection = ({ specialServices = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          Special Services
        </h3>
        <div className="mt-4">
          {specialServices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Stop
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Day
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Service Type
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Charge
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Special Time
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {specialServices.map((serviceInfo, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}
                      aria-label={`Special service for ${serviceInfo.studentName}`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                        {serviceInfo.studentName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {serviceInfo.stopLocation} ({serviceInfo.stopType})
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {serviceInfo.service.dayOfWeek.charAt(0).toUpperCase() +
                          serviceInfo.service.dayOfWeek.slice(1)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <ServiceTypeBadge type={serviceInfo.service.serviceType} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        <div className="flex items-center">
                          <span>£{serviceInfo.service.additionalCharge.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {serviceInfo.service.specialTime || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {serviceInfo.service.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-gray-500 dark:text-gray-400">No special services configured for this route</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialServicesSection;