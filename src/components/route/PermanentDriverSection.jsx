import React from "react";
import { TruckIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useDriverAssignment } from "@hooks/useDriverAssignment";

const PermanentDriverSection = ({ route, routeId }) => {
  const {
    showDriverForm,
    driverForm,
    driverError,
    driversData = [],
    isAssigning,
    handleDriverFormChange,
    handleDriverSubmit,
    openDriverForm,
    closeDriverForm
  } = useDriverAssignment(route, routeId);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Permanent Driver
        </p>
        <button
          onClick={openDriverForm}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
          aria-label={route.permanentDriver ? "Change permanent driver" : "Assign permanent driver"}
        >
          {route.permanentDriver ? (
            <>
              <PencilIcon className="w-4 h-4 mr-1" />
              Change
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4 mr-1" />
              Assign
            </>
          )}
        </button>
      </div>

      {/* Permanent Driver Assignment Form */}
      {showDriverForm && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded transition-colors duration-300">
          <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
            {route.permanentDriver ? "Change Permanent Driver" : "Assign Permanent Driver"}
          </h4>
          {driverError && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {driverError}
            </div>
          )}
          <form onSubmit={handleDriverSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label 
                  htmlFor="driverId" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Driver
                </label>
                <select
                  id="driverId"
                  name="driverId"
                  value={driverForm.driverId}
                  onChange={handleDriverFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  aria-label="Select a driver"
                >
                  <option value="">Select driver</option>
                  {driversData.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label 
                  htmlFor="driverPrice" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Price
                </label>
                <input
                  id="driverPrice"
                  type="number"
                  name="driverPrice"
                  value={driverForm.driverPrice}
                  onChange={handleDriverFormChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  placeholder="Enter price"
                  aria-label="Enter driver price"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeDriverForm}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Cancel driver assignment"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                disabled={isAssigning}
                aria-label={isAssigning ? "Saving..." : (route.permanentDriver ? "Update driver" : "Assign driver")}
              >
                {isAssigning ? "Saving..." :
                  route.permanentDriver ? "Update Driver" : "Assign Driver"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={`mt-1 flex items-center ${showDriverForm ? 'opacity-50' : ''} transition-opacity duration-200`}>
        <TruckIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
        <div>
          {route.permanentDriver ? (
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{route.permanentDriver.name}</p>
              {route.permanentDriver.phoneNumber && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {route.permanentDriver.phoneNumber}
                </p>
              )}
              {route.driverPrice && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Price: £{route.driverPrice}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No permanent driver assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermanentDriverSection;