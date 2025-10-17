import React, { useMemo } from 'react';
import { MapIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import StatusBadge from './StatusBadge';
import { CardWrapper } from './PermanentRoutes';

const TemporaryAssignments = ({ assignments }) => {
  // Show all assignments including completed ones
  const filteredAssignments = useMemo(() => {
    return assignments || [];
  }, [assignments]);

  if (!filteredAssignments.length) {
    return (
      <CardWrapper 
        title="Temporary Assignments" 
        isEmpty 
        emptyMessage="No temporary assignments" 
      />
    );
  }

  return (
    <CardWrapper title="Temporary Assignments">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
        {filteredAssignments.map((assignment) => (
          <li key={assignment._id} className="px-4 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    <h4 className="text-sm font-medium text-text-primary dark:text-white transition-colors duration-200">
                      {assignment.route?.name} 
                      <span className="text-gray-500 dark:text-gray-400 ml-1 transition-colors duration-200">
                        ({assignment.route?.routeNo})
                      </span>
                    </h4>
                  </div>
                  <StatusBadge status={assignment.status} />
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    {format(new Date(assignment.startDate), 'MMM d, yyyy')} - {format(new Date(assignment.endDate), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                    Time: {assignment.timeOfDay || 'BOTH'}
                  </div>
                </div>

                {assignment.reason && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    Reason: {assignment.reason}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </CardWrapper>
  );
};

export default TemporaryAssignments;