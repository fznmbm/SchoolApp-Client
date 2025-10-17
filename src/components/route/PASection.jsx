import React from "react";
import { UserIcon, PencilIcon } from "@heroicons/react/24/outline";
import { usePAAssignment } from "@hooks/usePAAssignment";

const PASection = ({ route, routeId }) => {
  const {
    showPAForm,
    paForm,
    paError,
    pasData,
    isAssigning,
    handlePAFormChange,
    handlePASubmit,
    openPAForm,
    closePAForm
  } = usePAAssignment(route, routeId);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PA Status</p>
        <button
          onClick={openPAForm}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
          aria-label={route.isPANeeded && route.pa ? "Change PA assignment" : "Manage PA assignment"}
        >
          <>
            <PencilIcon className="w-4 h-4 mr-1" />
            {route.isPANeeded && route.pa ? "Change" : "Manage"}
          </>
        </button>
      </div>

      {/* PA Assignment Form */}
      {showPAForm && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded transition-colors duration-300">
          <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
            Manage PA Assignment
          </h4>
          {paError && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {paError}
            </div>
          )}
          <form onSubmit={handlePASubmit}>
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <input
                  id="isPANeeded"
                  name="isPANeeded"
                  type="checkbox"
                  checked={paForm.isPANeeded}
                  onChange={handlePAFormChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded"
                  aria-label="PA required for this route"
                />
                <label htmlFor="isPANeeded" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  PA Required for this Route
                </label>
              </div>
            </div>

            {paForm.isPANeeded && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="paId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Passenger Assistant (PA)
                    </label>
                    <select
                      id="paId"
                      name="paId"
                      value={paForm.paId}
                      onChange={handlePAFormChange}
                      required
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                      aria-label="Select PA"
                    >
                      <option value="">Select PA</option>
                      {Array.isArray(pasData) && pasData.map((pa) => (
                        <option key={pa._id} value={pa._id}>
                          {pa.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="paPrice"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Price
                    </label>
                    <input
                      id="paPrice"
                      type="number"
                      name="paPrice"
                      value={paForm.paPrice}
                      onChange={handlePAFormChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                      placeholder="Enter price"
                      aria-label="Enter PA price"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closePAForm}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Cancel PA assignment"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                disabled={isAssigning}
                aria-label={isAssigning ? "Saving PA status..." : "Update PA status"}
              >
                {isAssigning ? "Saving..." : "Update PA Status"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={`mt-1 flex items-center ${showPAForm ? 'opacity-50' : ''} transition-opacity duration-200`}>
        <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
        <div>
          {route.isPANeeded ? (
            route.pa ? (
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{route.pa.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {route.pa.phoneNumber}
                </p>
                {route.paPrice && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Price: £{route.paPrice}
                  </p>
                )}
              </div>
            ) : (
              <span className="text-amber-500 dark:text-amber-400 font-medium">
                Required - Not Assigned
              </span>
            )
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Not Required</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PASection;