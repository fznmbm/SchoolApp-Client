import React from 'react';
import RouteRow from './RouteRow';

const JobsTable = ({ 
    preparedJobsData, 
    toggleRouteExpansion, 
    handleAttendanceChange, 
    formattedDate 
}) => {
    const { filteredJobs, routeColorMap, routeDetails, expandedRoutes } = preparedJobsData;

    const uniqueRoutes = [...new Set(filteredJobs.map(job => job.routeNo))];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark-mode transition-colors duration-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b border-border-light dark:border-border-dark-mode bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                            Passenger
                        </th>
                        <th className="px-6 py-3 border-b border-border-light dark:border-border-dark-mode bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                            AM Pickup Time
                        </th>
                        <th className="px-6 py-3 border-b border-border-light dark:border-border-dark-mode bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                            PM Pickup Time
                        </th>
                        <th className="px-6 py-3 border-b border-border-light dark:border-border-dark-mode bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                            From
                        </th>
                        <th className="px-6 py-3 border-b border-border-light dark:border-border-dark-mode bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                            Destination
                        </th>
                        <th className="px-6 py-3 border-b border-border-light dark:border-border-dark-mode bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200">
                            Parent's Phone
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
                    {uniqueRoutes.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                No jobs found for the selected date. Try changing the filters or date.
                            </td>
                        </tr>
                    ) : (
                        uniqueRoutes.map(routeNo => (
                            <RouteRow
                                key={routeNo}
                                routeNo={routeNo}
                                routeColor={routeColorMap[routeNo]}
                                routeDetail={routeDetails[routeNo] || {}}
                                jobsForRoute={filteredJobs.filter(job => job.routeNo === routeNo)}
                                isExpanded={expandedRoutes[routeNo] || false}
                                toggleRouteExpansion={() => toggleRouteExpansion(routeNo)}
                                handleAttendanceChange={handleAttendanceChange}
                                formattedDate={formattedDate}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default JobsTable;