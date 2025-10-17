import React from "react";

const ScheduleSection = ({ operatingDays = [] }) => {
  const sortedDays = [...operatingDays]
    .sort((a, b) => {
      const daysOfWeek = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      return daysOfWeek.indexOf(a.toLowerCase()) - daysOfWeek.indexOf(b.toLowerCase());
    });

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h3>
        <div className="mt-4">
          {sortedDays.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sortedDays.map((day) => (
                <span
                  key={day}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm transition-colors duration-200"
                  aria-label={`Operating day: ${day}`}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No operating days specified</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;