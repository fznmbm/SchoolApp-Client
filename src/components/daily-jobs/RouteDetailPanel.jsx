import React from 'react';
import { format } from 'date-fns';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const RouteDetailPanel = ({ routeDetail, getServiceTypeDisplay }) => {
    return (
        <tr className='bg-gray-50 dark:bg-gray-800 transition-colors duration-200'>
            <td colSpan="7" className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                            Contract Details
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Daily Price: {routeDetail.contractPrice}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Driver Price: {routeDetail.driverPrice}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            PA Price: {routeDetail.paPrice}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                            {routeDetail.hasTempDriver ? 'Permanent Driver' : 'Driver Details'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Name: <span className="font-semibold">{routeDetail.driverName}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Phone: {routeDetail.driverPhone}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Email: {routeDetail.driverEmail}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            License: {routeDetail.driverLicenseNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Expiry: {routeDetail.driverLicenseExpiry}
                        </p>
                    </div>
                    {routeDetail.hasTempDriver && (
                        <div>
                            <h4 className="font-medium text-yellow-700 dark:text-yellow-500 transition-colors duration-200">
                                Temporary Driver
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Name: <span className="font-semibold">{routeDetail.tempDriverName}</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Phone: {routeDetail.tempDriverPhone}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Email: {routeDetail.tempDriverEmail}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Driver #: {routeDetail.tempDriverNumber}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Time of Day: {routeDetail.tempDriverTimeOfDay === 'MORNING' ? 'Morning Only' :
                                    routeDetail.tempDriverTimeOfDay === 'EVENING' ? 'Evening Only' :
                                        'Both Morning & Evening'}
                            </p>
                        </div>
                    )}
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                            Vehicle Details
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Registration: {routeDetail.vehicleRegistrationNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Vehicle: {routeDetail.vehicleMake} {routeDetail.vehicleModel} ({routeDetail.vehicleType})
                        </p>
                    </div>
                    {routeDetail.isPANeeded && (
                        <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                PA Details
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Name: <span className="font-semibold">{routeDetail.paName || 'Not Assigned'}</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Phone: {routeDetail.paPhone}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Email: {routeDetail.paEmail}
                            </p>
                        </div>
                    )}

                    {/* Special Services Section */}
                    {routeDetail.specialServices && routeDetail.specialServices.length > 0 && (
                        <div>
                            <h4 className="font-medium text-purple-700 dark:text-purple-500 transition-colors duration-200">
                                Special Services
                            </h4>
                            <div className="space-y-2 mt-1">
                                {routeDetail.specialServices.map((service, idx) => (
                                    <div
                                        key={`${service.studentId}-${service.serviceType}-${idx}`}
                                        className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 
                                                dark:border-purple-800 transition-colors duration-200"
                                    >
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                            {service.studentName}
                                        </p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                {getServiceTypeDisplay(service.serviceType)}
                                                {service.specialTime ? ` at ${service.specialTime}` : ''}
                                            </span>
                                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 
                                                        dark:text-green-300 px-2 py-1 rounded-full flex items-center 
                                                        transition-colors duration-200">
                                                <BanknotesIcon className="h-3 w-3 mr-1" />
                                                £{service.additionalCharge ? service.additionalCharge.toFixed(2) : '0.00'}
                                            </span>
                                        </div>
                                        {service.notes && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-200">
                                                {service.notes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* School Holidays Section */}
                    {routeDetail.schoolHolidays && routeDetail.schoolHolidays.length > 0 && (
                        <div>
                            <h4 className="font-medium text-red-700 dark:text-red-500 transition-colors duration-200">
                                School Holidays
                            </h4>
                            {routeDetail.schoolHolidays.map((holiday, idx) => (
                                <div key={`${holiday.schoolId}-${idx}`} className="mb-2">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                        {holiday.schoolName}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                        Holiday period: {format(new Date(holiday.holidayPeriod?.startDate), 'MMM d')} - {format(new Date(holiday.holidayPeriod?.endDate), 'MMM d, yyyy')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes Section */}
                <div className="mt-4 space-y-4">
                    {/* Route Notes */}
                    {routeDetail.routeNotes && (
                        <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                Route Notes
                            </h4>
                            <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 
                                          dark:border-gray-600 transition-colors duration-200">
                                <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200 transition-colors duration-200">
                                    {routeDetail.routeNotes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Job Notes */}
                    {routeDetail.jobNotes && (
                        <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                Job Notes
                            </h4>
                            <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 
                                          dark:border-gray-600 transition-colors duration-200">
                                <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200 transition-colors duration-200">
                                    {routeDetail.jobNotes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default RouteDetailPanel;