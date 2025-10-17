import React from 'react';
import { format } from 'date-fns';
import {
    ChevronUpIcon,
    ChevronDownIcon,
    TruckIcon,
    AcademicCapIcon,
    ClockIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import JobRow from './JobRow';
import RouteDetailPanel from './RouteDetailPanel';

const RouteRow = ({
    routeNo,
    routeColor,
    routeDetail,
    jobsForRoute,
    isExpanded,
    toggleRouteExpansion,
    handleAttendanceChange,
    formattedDate
}) => {
    const getServiceTypeDisplay = (serviceType) => {
        switch (serviceType) {
            case 'EARLY_PICKUP': return 'Early Pickup';
            case 'LATE_PICKUP': return 'Late Pickup';
            case 'EXTRA_PICKUP': return 'Extra Pickup';
            case 'OTHER': return 'Special Service';
            default: return serviceType;
        }
    };

    return (
        <React.Fragment>
            {/* Route Header */}
            <tr
                className="bg-gray-300 dark:bg-gray-700 cursor-pointer transition-colors duration-200"
                onClick={toggleRouteExpansion}
            >
                <td colSpan="7" className="px-6 py-3">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                            Route {routeNo}
                        </span>
                        <div className="flex items-center space-x-2">
                            {/* Special Services Badges */}
                            {routeDetail.specialServices && routeDetail.specialServices.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {routeDetail.specialServices.map((service, idx) => (
                                        <span
                                            key={`${service.studentId}-${service.serviceType}-${idx}`}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                      bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 
                                                      transition-colors duration-200"
                                            title={`${service.studentName}: ${getServiceTypeDisplay(service.serviceType)} ${service.specialTime ? `at ${service.specialTime}` : ''}`}
                                        >
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            {service.studentName.split(' ')[0]}: {getServiceTypeDisplay(service.serviceType)}
                                            {service.additionalCharge ? ` (£${service.additionalCharge})` : ''}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* School Holiday Badges */}
                            {routeDetail.schoolHolidays && routeDetail.schoolHolidays.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {routeDetail.schoolHolidays.map((holiday, idx) => (
                                        <span
                                            key={`${holiday.schoolId}-${idx}`}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                      bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 
                                                      transition-colors duration-200"
                                        >
                                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                                            {holiday.schoolName}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Temp Driver Badge */}
                            {routeDetail.hasTempDriver && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 
                                                transition-colors duration-200">
                                    <TruckIcon className="h-4 w-4 mr-1" />
                                    {routeDetail.tempDriverName}
                                    {routeDetail.tempDriverTimeOfDay !== 'BOTH' && (
                                        ` (${routeDetail.tempDriverTimeOfDay === 'MORNING' ? 'AM' : 'PM'})`
                                    )}
                                </span>
                            )}

                            {isExpanded ? (
                                <ChevronUpIcon className="h-4 w-4 text-gray-700 dark:text-gray-300 transition-colors duration-200" />
                            ) : (
                                <ChevronDownIcon className="h-4 w-4 text-gray-700 dark:text-gray-300 transition-colors duration-200" />
                            )}
                        </div>
                    </div>
                </td>
            </tr>

            {/* Route Details (expandable) */}
            {isExpanded && (
                <RouteDetailPanel routeDetail={routeDetail} getServiceTypeDisplay={getServiceTypeDisplay} />
            )}

            {/* Jobs for this route */}
            {jobsForRoute.map((job, index) => (
                <JobRow
                    key={`${job.jobId}-${job.studentId}-${job.type}-${index}`}
                    job={job}
                    routeColor={routeColor}
                    handleAttendanceChange={handleAttendanceChange}
                    formattedDate={formattedDate}
                />
            ))}
        </React.Fragment>
    );
};

export default RouteRow;