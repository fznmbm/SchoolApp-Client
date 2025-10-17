import React from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

const StopsSection = ({ stops }) => {
  if (!stops) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stops</h3>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400">No stops information available</p>
          </div>
        </div>
      </div>
    );
  }

  const formatStopStudents = (students) => {
    return (
      students?.map((student) => ({
        name: `${student.student.firstName} ${student.student.lastName}`,
        action: student.action,
        phone: student.student.parentPhone,
      })) || []
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stops</h3>
        <div className="mt-4 space-y-6">
          {/* Starting Stop */}
          {stops.startingStop && (
            <div>
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Starting Stop</h4>
              </div>
              <div className="mt-2 ml-7">
                <p className="text-gray-800 dark:text-gray-200">{stops.startingStop.location}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AM: {stops.startingStop.timeAM}, PM: {stops.startingStop.timePM}
                </p>
                {stops.startingStop.students?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Students:</p>
                    <ul className="mt-1 space-y-1">
                      {formatStopStudents(
                        stops.startingStop.students
                      ).map((student, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                          {student.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Intermediate Stops */}
          {stops.intermediateStops?.map((stop, index) => (
            <div key={index}>
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Stop {index + 1}</h4>
              </div>
              <div className="mt-2 ml-7">
                <p className="text-gray-800 dark:text-gray-200">{stop.location}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AM: {stop.timeAM}, PM: {stop.timePM}
                </p>
                {stop.students?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Students:</p>
                    <ul className="mt-1 space-y-1">
                      {formatStopStudents(stop.students).map(
                        (student, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                            {student.name}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Ending Stop */}
          {stops.endingStop && (
            <div>
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Ending Stop</h4>
              </div>
              <div className="mt-2 ml-7">
                <p className="text-gray-800 dark:text-gray-200">{stops.endingStop.location}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AM: {stops.endingStop.timeAM}, PM: {stops.endingStop.timePM}
                </p>
                {stops.endingStop.students?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Students:</p>
                    <ul className="mt-1 space-y-1">
                      {formatStopStudents(
                        stops.endingStop.students
                      ).map((student, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                          {student.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StopsSection;