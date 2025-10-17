import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const JobRow = ({ job, routeColor, handleAttendanceChange, formattedDate }) => {
    const isAbsent = (job.type === 'AM' && !job.morningAttended) ||
        (job.type === 'PM' && !job.eveningAttended);

    const hasSpecialService = job.specialServices && job.specialServices.some(
        service => service.studentId === job.studentId
    );

    const darkModeRouteColor = routeColor.replace('bg-', 'dark:bg-').replace('-50', '-900/20');

    let rowClassName = isAbsent
        ? `${routeColor} ${darkModeRouteColor} bg-red-200 dark:bg-red-900/30 border-red-300 dark:border-red-700 border-l-4 transition-colors duration-200`
        : `${routeColor} ${darkModeRouteColor} transition-colors duration-200`;
    
    if (hasSpecialService) {
        rowClassName += ' border-l-4 border-purple-400 dark:border-purple-600';
    }

    return (
        <tr className={rowClassName}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <div className="flex items-center">
                    {job.passenger}
                    {hasSpecialService && (
                        <ClockIcon className="h-4 w-4 ml-1 text-purple-600 dark:text-purple-400 transition-colors duration-200" 
                                  title="Has special service" />
                    )}
                </div>
            </td>
            {/* AM Pickup Time */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                {job.type === 'AM' ? (
                    <div className="flex items-center space-x-2">
                        {/* If this is an AM row AND has a special AM pickup time, show it */}
                        {job.specialPickupTime ? (
                            <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400 transition-colors duration-200" />
                                <span className="text-purple-800 dark:text-purple-300 transition-colors duration-200">
                                    {job.specialPickupTime}
                                </span>
                            </div>
                        ) : (
                            <span>{job.pickupTime}</span>
                        )}
                        <input
                            type="checkbox"
                            checked={job.morningAttended}
                            onChange={(e) => handleAttendanceChange(
                                job.jobId,
                                job.studentId,
                                formattedDate,
                                'AM',
                                e.target.checked
                            )}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 
                                     rounded transition-colors duration-200"
                            aria-label={`AM attendance for ${job.passenger}`}
                        />
                    </div>
                ) : ''}
            </td>
            {/* PM Pickup Time */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                {job.type === 'PM' ? (
                    <div className="flex items-center space-x-2">
                        {/* If this is a PM row AND has a special PM pickup time, show it */}
                        {job.specialPickupTime ? (
                            <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400 transition-colors duration-200" />
                                <span className="text-purple-800 dark:text-purple-300 transition-colors duration-200">
                                    {job.specialPickupTime}
                                </span>
                            </div>
                        ) : (
                            <span>{job.pickupTime}</span>
                        )}
                        <input
                            type="checkbox"
                            checked={job.eveningAttended}
                            onChange={(e) => handleAttendanceChange(
                                job.jobId,
                                job.studentId,
                                formattedDate,
                                'PM',
                                e.target.checked
                            )}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 
                                     rounded transition-colors duration-200"
                            aria-label={`PM attendance for ${job.passenger}`}
                        />
                    </div>
                ) : ''}
            </td>
            {/* From */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                {job.from}
            </td>
            {/* To */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                {job.to}
            </td>
            {/* Parent's Phone Number */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                {job.whatsapp}
            </td>
        </tr>
    );
};

export default JobRow;