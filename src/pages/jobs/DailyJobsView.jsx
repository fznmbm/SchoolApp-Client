import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, addDays, subDays } from 'date-fns';
import { getJobsByDate, updateAttendance } from '@services/jobs';
import DateNavigation from '@components/daily-jobs/DateNavigation';
import JobsTable from '@components/daily-jobs/JobsTable';
import { ThemeContext } from '@context/ThemeContext';
import { Button } from '@components/common/Button';
import Spinner from '@components/common/Spinner';

const DailyJobsView = () => {
    const { theme } = useContext(ThemeContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRoutes, setExpandedRoutes] = useState({});

    // Format for display and API
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const displayDate = format(selectedDate, 'EEEE, MMMM d, yyyy');

    // Get day of week for special services filtering
    const currentDayOfWeek = format(selectedDate, 'EEEE').toLowerCase();

    // Fetch jobs for the selected date
    const {
        data: jobsResponse,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['jobs', formattedDate],
        queryFn: () => getJobsByDate(formattedDate),
        placeholderData: (previousData) => previousData
    });

    // Mutation for updating attendance
    const updateAttendanceMutation = useMutation({
        mutationFn: (attendanceData) => updateAttendance(attendanceData),
        onSuccess: () => {
            refetch(); // Refresh the jobs data after successful update
        }
    });

    // Handle attendance change
    const handleAttendanceChange = (jobId, studentId, date, type, value) => {
        updateAttendanceMutation.mutate({
            jobId,
            studentId,
            date,
            type,
            value
        });
    };

    // Toggle route details expansion
    const toggleRouteExpansion = (routeNo) => {
        setExpandedRoutes(prev => ({
            ...prev,
            [routeNo]: !prev[routeNo]
        }));
    };

    // Handle date navigation
    const goToPreviousDay = () => {
        setSelectedDate(prevDate => subDays(prevDate, 1));
    };

    const goToNextDay = () => {
        setSelectedDate(prevDate => addDays(prevDate, 1));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Handle search
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    // Get jobs data safely
    const jobs = jobsResponse?.data || [];

    // Define route colors
    const routeColors = [
        'bg-blue-50 dark:bg-blue-900/20', // Light blue
        'bg-green-50 dark:bg-green-900/20', // Light green
        'bg-purple-50 dark:bg-purple-900/20', // Light purple
        'bg-pink-50 dark:bg-pink-900/20', // Light pink
        'bg-indigo-50 dark:bg-indigo-900/20', // Light indigo
    ];

    // Create data for child components
    const preparedJobsData = prepareJobsData(jobs, formattedDate, currentDayOfWeek, expandedRoutes, routeColors, searchTerm);

    return (
        <div className="container mx-auto px-4 py-6 transition-colors duration-200 text-gray-900 dark:text-gray-100">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6 transition-colors duration-200">
                <div className="flex flex-col lg:flex-row gap-4 justify-between mb-2">
                    <div className="flex items-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Daily Jobs
                        </h1>
                    </div>

                    {/* DateNavigation Component */}
                    <DateNavigation
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        goToPreviousDay={goToPreviousDay}
                        goToNextDay={goToNextDay}
                        displayDate={displayDate}
                    />
                </div>

                {/* Search Bar*/}
                <div className="relative mt-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="block w-full p-3 pl-10 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Search routes, drivers, vehicles..."
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64 transition-colors duration-200">
                    <Spinner size="lg" />
                </div>
            ) : isError ? (
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors duration-200">
                    <p className="text-red-600 dark:text-red-400">Error loading jobs: {error.message}</p>
                    <Button onClick={refetch} variant="outline" className="mt-4">
                        Try Again
                    </Button>
                </div>
            ) : (
                <JobsTable
                    preparedJobsData={preparedJobsData}
                    toggleRouteExpansion={toggleRouteExpansion}
                    handleAttendanceChange={handleAttendanceChange}
                    formattedDate={formattedDate}
                />
            )}
        </div>
    );
};

// Helper function to prepare the jobs data for the table component
const prepareJobsData = (jobs, formattedDate, currentDayOfWeek, expandedRoutes, routeColors, searchTerm) => {
    // Extract students from stops and flatten the data
    const flattenedJobs = jobs.flatMap(job => {
        // Get temporary driver for this job on the selected date
        const tempDriver = getTemporaryDriverForDate(job, formattedDate);

        // Get special services for the current day
        const specialServices = getSpecialServicesForDay(job, currentDayOfWeek);

        // Store job details for all routes
        const jobDetails = {
            contractPrice: job.contractPrice || job.route?.dailyPrice || 0,
            driverPrice: job.driverPrice || job.route?.driverPrice || 0,
            paPrice: job.paPrice || job.route?.paPrice || 0,
            driverLicenseNumber: job.driverLicenseNumber || '',
            driverLicenseExpiry: job.driverLicenseExpiry ? format(new Date(job.driverLicenseExpiry), 'yyyy-MM-dd') : '',
            vehicleRegistrationNumber: job.vehicleRegistrationNumber || '',
            vehicleType: job.vehicleType || '',
            vehicleMake: job.vehicleMake || '',
            vehicleModel: job.vehicleModel || '',
            // Add temporary driver information
            temporaryDriver: tempDriver ? {
                name: tempDriver.name || '',
                phoneNumber: tempDriver.phoneNumber || '',
                email: tempDriver.email || '',
                driverNumber: tempDriver.driverNumber || ''
            } : null,
            // Add school holiday information
            schoolHolidays: getSchoolHolidaysForDate(job, formattedDate),
            // Add special services for current day
            specialServices: specialServices || []
        };

        return job.stops.flatMap(stop => {
            return stop.students.flatMap(student => {
                // Find the school for this student
                const schoolStop = job.stops.find(s =>
                    s.isSchool && s.students.some(st => st.student._id === student.student._id)
                );

                if (!schoolStop) {
                    // If no school is found for the student, skip this student
                    return [];
                }

                const schoolLocation = schoolStop.location;
                const studentId = student.student._id;

                // Find attendance for this student on the selected date
                const studentAttendance = job.attendance?.find(
                    att => att.student._id === studentId &&
                        format(new Date(att.date), 'yyyy-MM-dd') === formattedDate
                );

                // Get special pickup time for this student (if any)
                const specialPickupTime = getSpecialPickupTimeForStudent(specialServices, studentId);

                // Determine if special time is for AM or PM
                const isAMSpecialTime = specialPickupTime ? isSpecialTimeAM(specialPickupTime) : null;

                // AM Pickup (Home to School)
                const amPickup = {
                    jobId: job._id,
                    routeNo: job.routeNo,
                    passenger: `${student.student.firstName} ${student.student.lastName}`,
                    pickupTime: stop.timeAM,
                    specialPickupTime: isAMSpecialTime === true ? specialPickupTime : null, // Only set for AM if it's an AM time
                    from: stop.location, // Home location
                    to: schoolLocation, // School location
                    type: 'AM', // Indicates AM pickup
                    whatsapp: student.student.parents[0]?.whatsapp || '', // Parent's phone number
                    driver: job.permanentDriver?.name || job.temporaryDriver?.driver?.name || '',
                    price: job.contractPrice || job.price || 0,
                    notes: job.notes || '', // Keep notes in the object for the expandable section
                    studentId: studentId,
                    morningAttended: studentAttendance?.morningAttended || false,
                    eveningAttended: studentAttendance?.eveningAttended || false,
                    attendanceId: studentAttendance?._id || null,
                    // Add new fields
                    ...jobDetails
                };

                // PM Pickup (School to Home)
                const pmPickup = {
                    jobId: job._id,
                    routeNo: job.routeNo,
                    passenger: `${student.student.firstName} ${student.student.lastName}`,
                    pickupTime: schoolStop.timePM, // Use the school's PM pickup time
                    specialPickupTime: isAMSpecialTime === false ? specialPickupTime : null, // Only set for PM if it's a PM time
                    from: schoolLocation, // School location
                    to: stop.location, // Home location
                    type: 'PM', // Indicates PM pickup
                    whatsapp: student.student.parents[0]?.whatsapp || '', // Parent's phone number
                    driver: job.permanentDriver?.name || job.temporaryDriver?.driver?.name || '',
                    price: job.contractPrice || job.price || 0,
                    notes: job.notes || '', // Keep notes in the object for the expandable section
                    studentId: studentId,
                    morningAttended: studentAttendance?.morningAttended || false,
                    eveningAttended: studentAttendance?.eveningAttended || false,
                    attendanceId: studentAttendance?._id || null,
                    // Add new fields
                    ...jobDetails
                };

                // Filter out rows where both `from` and `to` are the same location
                const validRows = [];
                if (amPickup.from !== amPickup.to) validRows.push(amPickup);
                if (pmPickup.from !== pmPickup.to) validRows.push(pmPickup);

                return validRows;
            });
        });
    });

    // Sort by route and pickup time
    const sortedJobs = flattenedJobs.sort((a, b) => {
        const routeComparison = a.routeNo.localeCompare(b.routeNo);
        if (routeComparison !== 0) return routeComparison;
        return a.pickupTime.localeCompare(b.pickupTime); // Sort by pickup time within the same route
    });

    // Filter jobs based on search term
    const filteredJobs = sortedJobs.filter(job => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            (job.routeNo && job.routeNo.toLowerCase().includes(searchLower)) ||
            (job.passenger && job.passenger.toLowerCase().includes(searchLower)) ||
            (job.driver && job.driver.toLowerCase().includes(searchLower)) ||
            (job.vehicleRegistrationNumber && job.vehicleRegistrationNumber.toLowerCase().includes(searchLower)) ||
            // Also search in temporary driver name
            (job.temporaryDriver && job.temporaryDriver.name &&
                job.temporaryDriver.name.toLowerCase().includes(searchLower))
        );
    });

    // Create a mapping of routeNo to color
    const routeColorMap = {};
    filteredJobs.forEach(job => {
        if (!routeColorMap[job.routeNo]) {
            routeColorMap[job.routeNo] = routeColors[Object.keys(routeColorMap).length % routeColors.length];
        }
    });

    // Group jobs by route for route details
    const routeDetails = prepareRouteDetails(jobs, formattedDate, currentDayOfWeek);

    return {
        filteredJobs,
        routeColorMap,
        routeDetails,
        expandedRoutes
    };
};

// Helper function to prepare route details
const prepareRouteDetails = (jobs, formattedDate, currentDayOfWeek) => {
    const routeDetails = {};

    jobs.forEach(job => {
        const tempDriver = getTemporaryDriverForDate(job, formattedDate);
        const schoolHolidays = getSchoolHolidaysForDate(job, formattedDate);
        const specialServices = getSpecialServicesForDay(job, currentDayOfWeek);

        if (!routeDetails[job.routeNo]) {
            routeDetails[job.routeNo] = {
                contractPrice: job.contractPrice || job.route?.dailyPrice || 0,
                driverPrice: job.driverPrice || job.route?.driverPrice || 0,
                paPrice: job.paPrice || job.route?.paPrice || 0,

                // Driver details
                driverName: job.driverName || job.permanentDriver?.name || job.temporaryDriver?.driver?.name || 'Not Assigned',
                driverPhone: job.driverPhone || job.permanentDriver?.phoneNumber || job.temporaryDriver?.driver?.phoneNumber || '',
                driverEmail: job.driverEmail || job.permanentDriver?.email || job.temporaryDriver?.driver?.email || '',
                driverLicenseNumber: job.driverLicenseNumber || '',
                driverLicenseExpiry: job.driverLicenseExpiry ? format(new Date(job.driverLicenseExpiry), 'yyyy-MM-dd') : '',

                // Temporary driver details for this date
                hasTempDriver: !!tempDriver,
                tempDriverName: tempDriver?.name || '',
                tempDriverPhone: tempDriver?.phoneNumber || '',
                tempDriverEmail: tempDriver?.email || '',
                tempDriverNumber: tempDriver?.driverNumber || '',
                tempDriverTimeOfDay: tempDriver?.timeOfDay || 'BOTH',

                // School holiday information
                schoolHolidays: schoolHolidays || [],

                // Special services information
                specialServices: specialServices || [],

                // Vehicle details
                vehicleRegistrationNumber: job.vehicleRegistrationNumber || '',
                vehicleType: job.vehicleType || '',
                vehicleMake: job.vehicleMake || '',
                vehicleModel: job.vehicleModel || '',

                // PA details
                isPANeeded: job.isPANeeded || false,
                paName: job.paName || job.pa?.name || '',
                paPhone: job.paPhone || job.pa?.phoneNumber || '',
                paEmail: job.paEmail || job.pa?.email || '',

                // Notes - separate route notes from job notes
                routeNotes: job.routeNote || job.route?.note || '',
                jobNotes: job.notes || ''
            };
        } else {
            // Merge school holidays if this job has different schools with holidays
            const existingHolidaySchoolIds = new Set(routeDetails[job.routeNo].schoolHolidays.map(h => h.schoolId));
            const newHolidays = schoolHolidays.filter(h => !existingHolidaySchoolIds.has(h.schoolId));
            routeDetails[job.routeNo].schoolHolidays = [
                ...routeDetails[job.routeNo].schoolHolidays,
                ...newHolidays
            ];

            // Merge special services
            const existingSpecialServiceIds = new Set(
                routeDetails[job.routeNo].specialServices.map(s => `${s.studentId}-${s.dayOfWeek}-${s.serviceType}`)
            );

            const newSpecialServices = specialServices.filter(service =>
                !existingSpecialServiceIds.has(`${service.studentId}-${service.dayOfWeek}-${service.serviceType}`)
            );

            routeDetails[job.routeNo].specialServices = [
                ...routeDetails[job.routeNo].specialServices,
                ...newSpecialServices
            ];
        }
    });

    return routeDetails;
};

// Utility functions
const getTemporaryDriverForDate = (job, dateString) => {
    if (!job.temporaryAssignments || job.temporaryAssignments.length === 0) {
        return null;
    }

    // Find a temporary assignment for the selected date
    const tempAssignment = job.temporaryAssignments.find(assignment => {
        // Check if the assignment date matches the selected date
        if (assignment.date === dateString) {
            return true;
        }

        // Or check if selected date falls within the assignment date range
        if (assignment.startDate && assignment.endDate) {
            const start = new Date(assignment.startDate);
            const end = new Date(assignment.endDate);
            const selected = new Date(dateString);

            return selected >= start && selected <= end;
        }

        return false;
    });

    return tempAssignment ? {
        ...tempAssignment.driver,
        timeOfDay: tempAssignment.timeOfDay || 'BOTH'
    } : null;
};

const getSchoolHolidaysForDate = (job, dateString) => {
    if (!job.schoolHolidays || job.schoolHolidays.length === 0) {
        return [];
    }

    // Find all holidays that match the selected date
    return job.schoolHolidays.filter(holiday => holiday.date === dateString);
};

const getSpecialServicesForDay = (job, dayOfWeek) => {
    if (!job.specialServices || job.specialServices.length === 0) {
        return [];
    }

    // Filter special services for the current day of week
    return job.specialServices.filter(service => service.dayOfWeek === dayOfWeek);
};

const getSpecialPickupTimeForStudent = (specialServices, studentId) => {
    if (!specialServices || !Array.isArray(specialServices) || specialServices.length === 0) {
        return null;
    }

    // Find special services for this student with a special time
    const studentServices = specialServices.filter(service =>
        service.studentId === studentId && service.specialTime
    );

    if (studentServices.length === 0) {
        return null;
    }

    // Return the first one with a special time
    return studentServices[0].specialTime;
};

const isSpecialTimeAM = (specialTime) => {
    if (!specialTime) return null;

    // Parse the hours from the time string (format: "HH:MM")
    const hours = parseInt(specialTime.split(':')[0], 10);

    // Consider times before noon (12:00) as AM
    return hours < 12;
};

export default DailyJobsView;