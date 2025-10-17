import React from 'react';
import { format } from 'date-fns';
import { TruckIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline';
import AttendanceCheckbox from './AttendanceCheckbox';

const JobDateGroup = ({ date, jobs, tempDriverInfo, schoolHolidays, specialServices, onAttendanceChange }) => {
    const hasTempDriver = !!tempDriverInfo;
    const hasSchoolHolidays = schoolHolidays.length > 0;
    const hasSpecialServices = specialServices.length > 0;

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
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center flex-wrap transition-colors duration-200">
                <span className="mr-auto text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </span>
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Special Services Badges */}
                    {hasSpecialServices && specialServices.map((service, idx) => (
                        <span
                            key={`${service.studentId}-${service.serviceType}-${idx}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                      bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 transition-colors duration-200"
                            title={`${service.studentName}: ${getServiceTypeDisplay(service.serviceType)} ${service.specialTime ? `at ${service.specialTime}` : ''}`}
                        >
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {service.studentName.split(' ')[0]}: {getServiceTypeDisplay(service.serviceType)}
                            {service.additionalCharge ? ` (£${service.additionalCharge})` : ''}
                        </span>
                    ))}

                    {/* School Holiday Badges */}
                    {hasSchoolHolidays && schoolHolidays.map((holiday, idx) => (
                        <span
                            key={`${holiday.schoolId || idx}-${idx}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                      bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 transition-colors duration-200"
                        >
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            {holiday.schoolName || 'School Holiday'}
                        </span>
                    ))}

                    {/* Temp Driver Badge */}
                    {hasTempDriver && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 transition-colors duration-200">
                            <TruckIcon className="h-4 w-4 mr-1" />
                            {tempDriverInfo.name}
                            {tempDriverInfo.timeOfDay !== 'BOTH' && (
                                ` (${tempDriverInfo.timeOfDay === 'MORNING' ? 'AM' : 'PM'})`
                            )}
                        </span>
                    )}
                </div>
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                                Passenger
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                                AM Pickup Time
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                                PM Pickup Time
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                                From
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                                Destination
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                                Parent's Phone
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                        {jobs.map((job, index) => {
                            const isAbsent = (job.type === 'AM' && !job.morningAttended) ||
                                (job.type === 'PM' && !job.eveningAttended);

                            const hasSpecialService = job.hasSpecialService;

                            let rowClassName = isAbsent
                                ? 'bg-red-200 dark:bg-red-900/30 border-red-300 dark:border-red-700 border-l-4 transition-colors duration-200'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200';

                            if (hasSpecialService) {
                                rowClassName += ' border-l-4 border-purple-400 dark:border-purple-600';
                            }

                            return (
                                <tr key={index} className={rowClassName}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                        <div className="flex items-center">
                                            {job.passenger}
                                            {/* Show special service indicator next to passenger name */}
                                            {hasSpecialService && (
                                                <ClockIcon className="h-4 w-4 ml-1 text-purple-600 dark:text-purple-400 transition-colors duration-200" title="Has special service" />
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
                                                <AttendanceCheckbox
                                                    checked={job.morningAttended}
                                                    onChange={(e) => onAttendanceChange(
                                                        job.jobId,
                                                        job.studentId,
                                                        format(new Date(job.date), 'yyyy-MM-dd'),
                                                        'AM',
                                                        e.target.checked
                                                    )}
                                                    label={`AM attendance for ${job.passenger}`}
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
                                                <AttendanceCheckbox
                                                    checked={job.eveningAttended}
                                                    onChange={(e) => onAttendanceChange(
                                                        job.jobId,
                                                        job.studentId,
                                                        format(new Date(job.date), 'yyyy-MM-dd'),
                                                        'PM',
                                                        e.target.checked
                                                    )}
                                                    label={`PM attendance for ${job.passenger}`}
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
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobDateGroup;