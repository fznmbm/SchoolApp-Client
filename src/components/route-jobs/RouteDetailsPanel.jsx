import React from 'react';
import Card from '@components/common/Card';
import { format } from 'date-fns';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const RouteDetailsPanel = ({ firstJob, routeSpecialServices, id }) => {
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
        <Card id={id} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Contract Details</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Daily Price: {firstJob.contractPrice}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Driver Price: {firstJob.driverPrice}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">PA Price: {firstJob.paPrice}</p>
                </div>
                <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                        {firstJob.isTemporaryDriver ? 'Permanent Driver' : 'Driver Details'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        Name: <span className="font-semibold">{firstJob.driverName}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Phone: {firstJob.driverPhone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Email: {firstJob.driverEmail}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">License: {firstJob.driverLicenseNumber}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Expiry: {firstJob.driverLicenseExpiry}</p>

                    {firstJob.isTemporaryDriver && firstJob.temporaryDriverDetails && (
                        <div className="mt-2">
                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 transition-colors duration-200">Temporary Assignment</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Reason: {firstJob.temporaryDriverDetails.reason}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                From: {format(new Date(firstJob.temporaryDriverDetails.startDate), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                To: {format(new Date(firstJob.temporaryDriverDetails.endDate), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                Time of Day: {firstJob.temporaryDriverDetails.timeOfDay === 'MORNING' ? 'Morning Only' :
                                firstJob.temporaryDriverDetails.timeOfDay === 'EVENING' ? 'Evening Only' :
                                'Both Morning & Evening'}
                            </p>
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Vehicle Details</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        Registration: {firstJob.vehicleRegistrationNumber}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        Vehicle: {firstJob.vehicleMake} {firstJob.vehicleModel} ({firstJob.vehicleType})
                    </p>
                </div>
                {firstJob.isPANeeded && (
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">PA Details</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Name: <span className="font-semibold">{firstJob.paName || 'Not Assigned'}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Phone: {firstJob.paPhone || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Email: {firstJob.paEmail || 'N/A'}
                        </p>
                    </div>
                )}

                {/* Special Services Section */}
                {routeSpecialServices.length > 0 && (
                    <div className="md:col-span-2">
                        <h4 className="font-medium text-purple-700 dark:text-purple-400 transition-colors duration-200">
                            Special Services
                        </h4>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {routeSpecialServices.map((service, idx) => (
                                <div key={`${service.studentId}-${service.serviceType}-${idx}`}
                                    className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700 transition-colors duration-200">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">
                                        {service.studentName}
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                            {getServiceTypeDisplay(service.serviceType)}
                                            {service.specialTime ? ` at ${service.specialTime}` : ''}
                                            <span className="ml-2 text-purple-600 dark:text-purple-400 capitalize transition-colors duration-200">
                                                ({service.dayOfWeek})
                                            </span>
                                        </span>
                                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full flex items-center transition-colors duration-200">
                                            <BanknotesIcon className="h-3 w-3 mr-1" />
                                            £{service.additionalCharge.toFixed(2)}
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
            </div>

            {/* Notes Section */}
            <div className="mt-4 space-y-4">
                {/* Route Notes */}
                {firstJob.routeNotes && (
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                            Route Notes
                        </h4>
                        <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                            <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                {firstJob.routeNotes}
                            </p>
                        </div>
                    </div>
                )}

                {/* Job Notes */}
                {firstJob.jobNotes && (
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                            Job Notes
                        </h4>
                        <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                            <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                {firstJob.jobNotes}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default RouteDetailsPanel;