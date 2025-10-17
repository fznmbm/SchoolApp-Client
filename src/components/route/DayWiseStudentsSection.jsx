import React from "react";

const DayWiseStudentsSection = ({ dayWiseStudents = [] }) => {
  if (dayWiseStudents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Day-wise Students
          </h3>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400">No day-wise student information available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Day-wise Students
        </h3>
        <div className="mt-4 flex flex-wrap gap-6">
          {dayWiseStudents.map((day, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-medium capitalize text-gray-800 dark:text-gray-200">{day.day}</h4>
              {day.students.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {day.students.map((student, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      {student.firstName} {student.lastName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No students</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayWiseStudentsSection;