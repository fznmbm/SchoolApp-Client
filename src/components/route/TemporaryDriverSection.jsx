import React from "react";
import {
  TruckIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { useTemporaryDriver } from "@hooks/useTemporaryDriver";
import { StatusBadge, TimeOfDayBadge } from "./StatusBadge";

const TemporaryDriverSection = ({ route, routeId }) => {
  const {
    hasTemporaryDriver,
    activeAssignments,
    showAssignForm,
    showRemoveForm,
    showHistory,
    assignmentForm,
    error,
    availableDriversForTemp,
    historyData,
    isAssigning,
    isRemoving,
    handleAssignmentFormChange,
    handleAssignmentSubmit,
    handleRemoveSubmit,
    openAssignForm,
    openRemoveForm,
    toggleHistory,
    closeAllForms,
    getLatestAssignmentHistory,
    formatDate
  } = useTemporaryDriver(route, routeId);

  const formatTimeOfDay = (timeOfDay) => {
    switch (timeOfDay) {
      case "MORNING":
        return "Morning only";
      case "EVENING":
        return "Evening only";
      case "BOTH":
      default:
        return "Morning & Evening";
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Temporary Driver
      </p>
      <div className="mt-1">
        {hasTemporaryDriver ? (
          <div className="space-y-3">
            {activeAssignments.map((assignment) => (
              <div key={assignment._id} className="flex items-start">
                <TruckIcon className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-2 mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{assignment.driver?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {assignment.driver?.phoneNumber}
                      </p>
                      <div className="flex items-center mt-1">
                        <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <ClockIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimeOfDay(assignment.timeOfDay || "BOTH")}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <DocumentTextIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          £{assignment.price} per day
                        </p>
                      </div>
                      <div className="mt-2">
                        <StatusBadge status={assignment.status || "SCHEDULED"} />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openRemoveForm(assignment._id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                        aria-label="Remove temporary driver"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center">
            <TruckIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
            <p className="text-gray-500 dark:text-gray-400">No temporary driver assigned</p>
          </div>
        )}

        {/* Always allow adding a new assignment */}
        <div className="mt-2 flex justify-end">
          <button
            onClick={openAssignForm}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
            aria-label="Assign temporary driver"
          >
            Add Temp Assignment
          </button>
        </div>
      </div>

      {/* Assignment form */}
      {showAssignForm && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded transition-colors duration-300">
          <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Assign Temporary Driver</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Only drivers with vehicles meeting the required capacity ({route.capacity} seats) are shown
          </p>
          {error && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleAssignmentSubmit}>
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
                  value={assignmentForm.driverId}
                  onChange={handleAssignmentFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  aria-label="Select temporary driver"
                >
                  <option value="">Select driver</option>
                  {availableDriversForTemp.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
                {route.permanentDriver && availableDriversForTemp.length !== route.capacity && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Note: The permanent driver cannot be assigned as a temporary driver
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Price (per day)
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={assignmentForm.price}
                  onChange={handleAssignmentFormChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Enter daily price"
                  aria-label="Enter daily price"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={assignmentForm.startDate}
                  onChange={handleAssignmentFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  aria-label="Select start date"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={assignmentForm.endDate}
                  onChange={handleAssignmentFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  aria-label="Select end date"
                />
              </div>
              <div>
                <label
                  htmlFor="timeOfDay"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Time of Day
                </label>
                <select
                  id="timeOfDay"
                  name="timeOfDay"
                  value={assignmentForm.timeOfDay}
                  onChange={handleAssignmentFormChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  aria-label="Select time of day"
                >
                  <option value="BOTH">Both Morning & Evening</option>
                  <option value="MORNING">Morning Only</option>
                  <option value="EVENING">Evening Only</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                value={assignmentForm.reason}
                onChange={handleAssignmentFormChange}
                required
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows="2"
                placeholder="Reason for temporary assignment"
                aria-label="Reason for temporary assignment"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeAllForms}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Cancel assignment"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                disabled={isAssigning}
                aria-label={isAssigning ? "Assigning driver..." : "Assign driver"}
              >
                {isAssigning ? "Assigning..." : "Assign Driver"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Remove form */}
      {showRemoveForm && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded transition-colors duration-300">
          <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Remove Temporary Driver</h4>
          {error && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleRemoveSubmit}>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeAllForms}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Cancel removal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                disabled={isRemoving}
                aria-label={isRemoving ? "Removing driver..." : "Confirm driver removal"}
              >
                {isRemoving ? "Removing..." : "Confirm Remove"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History button */}
      <div className="mt-2">
        <button
          onClick={toggleHistory}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition-colors duration-200"
          aria-label={showHistory ? "Hide assignment history" : "View assignment history"}
          aria-expanded={showHistory}
        >
          {showHistory ? "Hide History" : "View Assignment History"}
          <CalendarIcon className="ml-1 w-4 h-4" />
        </button>
      </div>

      {/* Assignment history */}
      {showHistory && (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700 rounded-lg">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Driver
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Period
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Time of Day
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {historyData && historyData.length > 0 ? (
                getLatestAssignmentHistory(historyData).map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {item.driver?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <TimeOfDayBadge timeOfDay={item.timeOfDay || "BOTH"} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      £{item.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                    No assignment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TemporaryDriverSection;