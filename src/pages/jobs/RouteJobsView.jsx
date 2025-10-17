import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import {
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline';


import { ThemeContext } from '@context/ThemeContext';
import { Button } from '@components/common/Button';
import Card from '@components/common/Card';
import Spinner from '@components/common/Spinner';
import InvoiceConfirmationModal from '@/components/forms/route-invoice-confirm-form/RouteInvoiceConfirmForm';


import DateRangeFilter from '@components/route-jobs/DateRangeFilter';
import RouteSelector from '@components/route-jobs/RouteSelector';
import SearchBar from '@components/route-jobs/SearchBar';
import RouteDetailsPanel from '@components/route-jobs/RouteDetailsPanel';
import JobDateGroup from '@components/route-jobs/JobDateGroup';

import { useRouteJobs } from '@hooks/useRouteJobs';
import { useAttendance } from '@hooks/useAttendance';
import { useInvoiceGeneration } from '@hooks/useInvoiceGeneration';

const RouteJobsView = () => {
    const { theme } = useContext(ThemeContext);
    const {
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        isDetailsExpanded,
        setIsDetailsExpanded,
        formattedStartDate,
        formattedEndDate,
        routesData,
        isLoadingRoutes,
        isErrorRoutes,
        routesError,
        jobsResponse,
        isLoadingJobs,
        isErrorJobs,
        jobsError,
        refetch,
        flattenedJobs,
        jobsByDate,
        filteredDates,
        datesWithTempDrivers,
        datesWithSchoolHolidays,
        datesWithSpecialServices,
        routeOptions,
        firstJob,
        routeSpecialServices,
        toggleDetailsPanel,
        selectedRouteId,
        setSelectedRouteId,
        selectedRoute
    } = useRouteJobs();

    const { updateAttendanceMutation, handleAttendanceChange } = useAttendance(refetch);

    const {
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        invoiceData,
        setInvoiceData,
        isPreparingInvoice,
        setIsPreparingInvoice,
        handlePrepareInvoice,
        handleCloseInvoiceModal,
        handleFinalizeInvoice
    } = useInvoiceGeneration(flattenedJobs, jobsByDate, filteredDates, startDate, endDate, routeOptions);

    // Combine loading and error states
    const isLoading = isLoadingRoutes || isLoadingJobs;
    const isError = isErrorRoutes || isErrorJobs;
    const error = routesError || jobsError;

    return (
        <div className="container mx-auto px-4 py-6 bg-white dark:bg-gray-900 transition-colors duration-200">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">Route Jobs</h1>

                <div className="flex items-center gap-2">
                    <Button
                        variant="primary"
                        onClick={handlePrepareInvoice}
                        disabled={isPreparingInvoice || !selectedRouteId || filteredDates.length === 0}
                        aria-busy={isPreparingInvoice}
                        title={
                            !selectedRouteId
                                ? "Please select a route first"
                                : filteredDates.length === 0
                                    ? "No jobs available for the selected criteria"
                                    : "Generate invoice for selected jobs"
                        }
                        aria-label={
                            !selectedRouteId
                                ? "Generate invoice button - disabled, please select a route first"
                                : filteredDates.length === 0
                                    ? "Generate invoice button - disabled, no jobs available for the selected criteria"
                                    : "Generate invoice for selected jobs"
                        }
                    >
                        {isPreparingInvoice ? (
                            <>
                                <Spinner size="sm" className="mr-2" />
                                Preparing...
                            </>
                        ) : (
                            'Generate Invoice'
                        )}
                    </Button>
                </div>
            </div>

            {/* Date Range and Route Selection */}
            <Formik
                initialValues={{
                    routeId: '',
                }}
                onSubmit={(values) => {
                    // Set the selected route ID directly
                    setSelectedRouteId(values.routeId);
                    refetch();
                }}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <Card className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 transition-colors duration-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                <DateRangeFilter
                                    startDate={startDate}
                                    endDate={endDate}
                                    onStartDateChange={setStartDate}
                                    onEndDateChange={setEndDate}
                                />

                                <RouteSelector
                                    routeOptions={routeOptions}
                                    value={values.routeId}
                                    onChange={(option) => {
                                        setFieldValue('routeId', option?.id || '');
                                    }}
                                />

                                <div className="flex items-end">
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white border-transparent focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                                        aria-label="View jobs for selected route and date range"
                                    >
                                        View Jobs
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Form>
                )}
            </Formik>

            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {isLoadingRoutes ? (
                <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                    <Spinner size="lg" />
                    <span className="ml-2">Loading routes...</span>
                </div>
            ) : isErrorRoutes ? (
                <div className="text-center p-8 bg-red-50 dark:bg-red-900 rounded-lg transition-colors duration-200">
                    <p className="text-red-600 dark:text-red-300 transition-colors duration-200">
                        Error loading routes: {routesError.message}
                    </p>
                    <Button onClick={refetch} variant="outline" className="mt-4">
                        Try Again
                    </Button>
                </div>
            ) : !selectedRoute ? (
                <div className="text-center p-8 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg transition-colors duration-200">
                    <p className="text-yellow-600 dark:text-yellow-400 transition-colors duration-200">
                        Please select a route to view jobs
                    </p>
                </div>
            ) : isLoadingJobs ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            ) : isErrorJobs ? (
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/30 rounded-lg transition-colors duration-200">
                    <p className="text-red-600 dark:text-red-300 transition-colors duration-200">
                        Error loading jobs: {jobsError.message}
                    </p>
                    <Button onClick={refetch} variant="outline" className="mt-4">
                        Try Again
                    </Button>
                </div>
            ) : filteredDates.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200">
                    <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
                        No jobs found for the selected criteria
                    </p>
                </div>
            ) : (
                <div>
                    {/* Expandable Details Panel Header - Always visible */}
                    <div
                        className="mb-2 bg-gray-300 dark:bg-gray-700 p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors duration-200"
                        onClick={toggleDetailsPanel}
                        aria-expanded={isDetailsExpanded}
                        aria-controls="route-details-panel"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                            Route Details
                        </h3>
                        <div className="flex items-center">
                            {isDetailsExpanded ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors duration-200" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors duration-200" />
                            )}
                        </div>
                    </div>

                    {/* Route Details Panel */}
                    {isDetailsExpanded && firstJob && (
                        <RouteDetailsPanel
                            firstJob={firstJob}
                            routeSpecialServices={routeSpecialServices}
                            id="route-details-panel"
                        />
                    )}

                    {/* Jobs by Date */}
                    {filteredDates.map(date => (
                        <JobDateGroup
                            key={date}
                            date={date}
                            jobs={jobsByDate[date]}
                            tempDriverInfo={datesWithTempDrivers[date]}
                            schoolHolidays={datesWithSchoolHolidays[date] || []}
                            specialServices={datesWithSpecialServices[date] || []}
                            onAttendanceChange={handleAttendanceChange}
                        />
                    ))}
                </div>
            )}

            {/* Invoice Confirmation Modal */}
            <InvoiceConfirmationModal
                isOpen={isInvoiceModalOpen}
                onClose={handleCloseInvoiceModal}
                initialInvoiceData={invoiceData}
                onConfirm={handleFinalizeInvoice}
            />
        </div>
    );
};

export default RouteJobsView;