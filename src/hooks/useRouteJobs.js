import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { getJobs } from '@services/jobs';
import { getRoutes } from '@services/route';

export const useRouteJobs = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRouteId, setSelectedRouteId] = useState(''); // Changed to store route ID instead of route number
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    // Format dates for API
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');

    // Fetch available routes for dropdown
    const {
        data: routesData,
        isLoading: isLoadingRoutes,
        isError: isErrorRoutes,
        error: routesError
    } = useQuery({
        queryKey: ['routes'],
        queryFn: () => getRoutes(),
    });

    // Convert routes to option format for the Select component
    const routeOptions = useMemo(() => {
        return routesData ? routesData.map(route => ({
            id: route._id, // Use MongoDB _id for the route
            routeNo: route.routeNo, // Keep routeNo for display
            name: `Route ${route.routeNo} - ${route.name || ''}`,
        })) : [];
    }, [routesData]);

    // Get selected route information for display
    const selectedRoute = useMemo(() => {
        if (!selectedRouteId || !routeOptions.length) return null;
        return routeOptions.find(option => option.id === selectedRouteId) || null;
    }, [selectedRouteId, routeOptions]);

    // Fetch jobs for the selected date range and route
    const {
        data: jobsResponse,
        isLoading: isLoadingJobs,
        isError: isErrorJobs,
        error: jobsError,
        refetch
    } = useQuery({
        queryKey: ['jobs', formattedStartDate, formattedEndDate, selectedRouteId],
        queryFn: () => getJobs({
            startDateFrom: `${formattedStartDate}T00:00:00.000Z`,
            startDateTo: `${formattedEndDate}T23:59:59.999Z`,
            // Use route parameter with Object ID instead of search parameter
            route: selectedRouteId
        }),
        placeholderData: (previousData) => previousData,
        enabled: !!selectedRouteId // Only fetch when a route is selected
    });

    // Get jobs data safely
    const jobs = jobsResponse?.data || [];

    // Process job data
    const processedJobData = useMemo(() => {
        // Extract students from stops and flatten the data
        const flattenedJobs = jobs.flatMap(job => {
            // Ensure stops is an array
            const stops = Array.isArray(job.stops) ? job.stops : [];

            // Ensure operatingDates is an array and filter to only include dates within the selected range
            const allOperatingDates = Array.isArray(job.operatingDates) ? job.operatingDates : [job.startDate];

            // Filter to only include dates within the selected range
            const startDateObj = new Date(formattedStartDate);
            const endDateObj = new Date(formattedEndDate);
            endDateObj.setHours(23, 59, 59, 999); // Include the entire end date

            const operatingDates = allOperatingDates.filter(dateStr => {
                const dateObj = new Date(dateStr);
                return dateObj >= startDateObj && dateObj <= endDateObj;
            });

            const originalSpecialServices = job.specialServices || [];

            // First create a map of student to their home (non-school) stops
            const studentHomeStopMap = new Map();

            // Then create a map of student to their school stops
            const studentSchoolStopMap = new Map();

            // Process all stops
            stops.forEach(stop => {
                if (!stop.students || !Array.isArray(stop.students)) return;

                stop.students.forEach(student => {
                    if (!student || !student.student) return;

                    const studentId = student.student._id;

                    if (stop.isSchool) {
                        // This is a school stop for this student
                        studentSchoolStopMap.set(studentId, stop);
                    } else {
                        // This is a home stop for this student
                        studentHomeStopMap.set(studentId, stop);
                    }
                });
            });

            // Get attendance records once
            const attendance = Array.isArray(job.attendance) ? job.attendance : [];

            // Helper function to check if a job has a temporary driver assignment for a specific date
            const getTempDriverForDate = (job, dateString) => {
                if (!job.temporaryAssignments || !Array.isArray(job.temporaryAssignments)) {
                    return null;
                }

                return job.temporaryAssignments.find(assignment => assignment.date === dateString);
            };

            // Helper function to get school holidays for a job on a specific date
            const getSchoolHolidaysForDate = (job, dateString) => {
                if (!job.schoolHolidays || job.schoolHolidays.length === 0) {
                    return [];
                }

                // Find all holidays that match the selected date
                return job.schoolHolidays.filter(holiday => holiday.date === dateString);
            };

            // Helper function to get special services for a given day
            const getSpecialServicesForDate = (job, dateString) => {
                if (!job.specialServices || job.specialServices.length === 0) {
                    return [];
                }

                // Get day of week for the current date
                const date = new Date(dateString);
                const dayOfWeek = format(date, 'EEEE').toLowerCase();

                // Filter special services for the given day of week
                return job.specialServices.filter(service => service.dayOfWeek === dayOfWeek);
            };

            // Helper function to get special pickup time for a student
            const getSpecialPickupTimeForStudent = (specialServices, studentId) => {
                if (!specialServices || !Array.isArray(specialServices) || specialServices.length === 0) {
                    return null;
                }

                // Find special services for this student
                const studentServices = specialServices.filter(service =>
                    service.studentId === studentId && service.specialTime
                );

                if (studentServices.length === 0) {
                    return null;
                }

                // Return the first one with a special time
                return studentServices[0].specialTime;
            };

            // Check if special time is AM or PM
            const isSpecialTimeAM = (specialTime) => {
                if (!specialTime) return null;

                // Parse the hours from the time string (format: "HH:MM")
                const hours = parseInt(specialTime.split(':')[0], 10);

                // Consider times before noon (12:00) as AM
                return hours < 12;
            };

            // Now create entries for each student for each operating date
            return operatingDates.flatMap(operatingDate => {
                // Format date for checking temporary assignments and school holidays
                const dateStr = format(new Date(operatingDate), 'yyyy-MM-dd');

                // Check if there's a temporary driver assignment for this date
                const tempAssignment = getTempDriverForDate(job, dateStr);

                // Get school holidays for this date
                const schoolHolidays = getSchoolHolidaysForDate(job, dateStr);

                // Get special services for this date
                const specialServices = getSpecialServicesForDate(job, dateStr);

                // Get all unique student IDs from both maps
                const allStudentIds = new Set([
                    ...studentHomeStopMap.keys(),
                    ...studentSchoolStopMap.keys()
                ]);

                return Array.from(allStudentIds).flatMap(studentId => {
                    const homeStop = studentHomeStopMap.get(studentId);
                    const schoolStop = studentSchoolStopMap.get(studentId);

                    // Skip if student doesn't have both a home and school stop
                    if (!homeStop || !schoolStop) return [];

                    // Find the student data from either stop
                    const studentData =
                        homeStop.students.find(s => s.student._id === studentId)?.student ||
                        schoolStop.students.find(s => s.student._id === studentId)?.student;

                    if (!studentData) return [];

                    // Find attendance for this student and date
                    const attendanceDateStr = format(new Date(operatingDate), 'yyyy-MM-dd');
                    const studentAttendance = attendance.find(
                        att => att && att.student && att.student._id === studentId &&
                            format(new Date(att.date), 'yyyy-MM-dd') === attendanceDateStr
                    ) || {};

                    // Get special pickup time for this student (if any)
                    const specialPickupTime = getSpecialPickupTimeForStudent(specialServices, studentId);

                    // Determine if special time is for AM or PM
                    const isAMSpecialTime = specialPickupTime ? isSpecialTimeAM(specialPickupTime) : null;

                    // Determine driver info (permanent or temporary)
                    const driverInfo = tempAssignment ? {
                        // If there's a temp driver assignment for this date, use its info
                        driverName: tempAssignment.driver.name || 'Temp Driver',
                        driverPhone: tempAssignment.driver.phoneNumber || '',
                        driverEmail: tempAssignment.driver.email || '',
                        driverLicenseNumber: tempAssignment.driver.licenseNumber || '',
                        driverLicenseExpiry: tempAssignment.driver.licenseExpiry ?
                            format(new Date(tempAssignment.driver.licenseExpiry), 'yyyy-MM-dd') : '',
                        isTemporaryDriver: true,
                        temporaryDriverDetails: tempAssignment
                    } : {
                        // Otherwise use permanent driver info
                        driverName: job.driverName || job.permanentDriver?.name || 'Not Assigned',
                        driverPhone: job.driverPhone || job.permanentDriver?.phoneNumber || '',
                        driverEmail: job.driverEmail || job.permanentDriver?.email || '',
                        driverLicenseNumber: job.driverLicenseNumber || '',
                        driverLicenseExpiry: job.driverLicenseExpiry ?
                            format(new Date(job.driverLicenseExpiry), 'yyyy-MM-dd') : '',
                        isTemporaryDriver: false
                    };

                    // AM Pickup (Home to School)
                    const amPickup = {
                        jobId: job._id,
                        routeNo: job.routeNo,
                        passenger: `${studentData.firstName || ''} ${studentData.lastName || ''}`,
                        pickupTime: homeStop.timeAM,
                        specialPickupTime: isAMSpecialTime === true ? specialPickupTime : null,
                        from: homeStop.location,
                        to: schoolStop.location,
                        type: 'AM',
                        whatsapp: studentData.parents && studentData.parents[0]?.whatsapp || '',
                        driver: driverInfo.driverName,
                        price: job.price,
                        notes: '',
                        studentId: studentId,
                        date: operatingDate,
                        morningAttended: studentAttendance.morningAttended || false,
                        eveningAttended: studentAttendance.eveningAttended || false,
                        contractPrice: job.contractPrice || job.route?.dailyPrice || 0,
                        driverPrice: job.driverPrice || job.route?.driverPrice || 0,
                        paPrice: job.paPrice || job.route?.paPrice || 0,
                        ...driverInfo,
                        vehicleRegistrationNumber: tempAssignment && tempAssignment.driver.vehicle ?
                            tempAssignment.driver.vehicle.registrationNumber : job.vehicleRegistrationNumber || '',
                        vehicleType: tempAssignment && tempAssignment.driver.vehicle ?
                            tempAssignment.driver.vehicle.type : job.vehicleType || '',
                        vehicleMake: tempAssignment && tempAssignment.driver.vehicle ?
                            tempAssignment.driver.vehicle.make : job.vehicleMake || '',
                        vehicleModel: tempAssignment && tempAssignment.driver.vehicle ?
                            tempAssignment.driver.vehicle.model : job.vehicleModel || '',
                        isPANeeded: job.isPANeeded || false,
                        paName: job.paName || (job.pa?.name) || '',
                        paPhone: job.paPhone || (job.pa?.contact ? job.pa.contact.phone : ''),
                        paEmail: job.paEmail || (job.pa?.contact ? job.pa.contact.email : ''),
                        routeNotes: job.routeNote || job.route?.note || '',
                        jobNotes: job.notes || '',
                        schoolHolidays: schoolHolidays || [],
                        specialServices: specialServices || [],
                        originalSpecialServices: originalSpecialServices,
                        hasSpecialService: specialServices.some(service => service.studentId === studentId)
                    };

                    // PM Pickup (School to Home)
                    const pmPickup = {
                        jobId: job._id,
                        routeNo: job.routeNo,
                        passenger: `${studentData.firstName || ''} ${studentData.lastName || ''}`,
                        pickupTime: schoolStop.timePM,
                        specialPickupTime: isAMSpecialTime === false ? specialPickupTime : null,
                        from: schoolStop.location,
                        to: homeStop.location,
                        type: 'PM',
                        whatsapp: studentData.parents && studentData.parents[0]?.whatsapp || '',
                        driver: driverInfo.driverName,
                        price: job.price,
                        notes: '',
                        studentId: studentId,
                        date: operatingDate,
                        morningAttended: studentAttendance.morningAttended || false,
                        eveningAttended: studentAttendance.eveningAttended || false,

                        contractPrice: job.contractPrice || job.route?.dailyPrice || 0,
                        driverPrice: job.driverPrice || job.route?.driverPrice || 0,
                        paPrice: job.paPrice || job.route?.paPrice || 0,
                        ...driverInfo,
                        vehicleRegistrationNumber: tempAssignment && tempAssignment.driver.vehicle ?
                            tempAssignment.driver.vehicle.registrationNumber : job.vehicleRegistrationNumber || '',
                        vehicleType: tempAssignment && tempAssignment.driver.vehicle ?
                            tempAssignment.driver.vehicle.type : job.vehicleType || '',
                        vehicleMake: tempAssignment && tempAssignment.driver.vehicle ?
                            tempAssignment.driver.vehicle.make : job.vehicleMake || '',
                        vehicleModel: tempAssignment && tempAssignment.driver.vehicle ?
                            tempAssignment.driver.vehicle.model : job.vehicleModel || '',
                        isPANeeded: job.isPANeeded || false,
                        paName: job.paName || (job.pa?.name) || '',
                        paPhone: job.paPhone || (job.pa?.contact ? job.pa.contact.phone : ''),
                        paEmail: job.paEmail || (job.pa?.contact ? job.pa.contact.email : ''),
                        routeNotes: job.routeNote || job.route?.note || '',
                        jobNotes: job.notes || '',
                        schoolHolidays: schoolHolidays || [],
                        specialServices: specialServices || [],
                        originalSpecialServices: originalSpecialServices,
                        hasSpecialService: specialServices.some(service => service.studentId === studentId)
                    };

                    // Filter out rows where both `from` and `to` are the same location
                    const validRows = [];
                    if (amPickup.from !== amPickup.to) validRows.push(amPickup);
                    if (pmPickup.from !== pmPickup.to) validRows.push(pmPickup);

                    return validRows;
                });
            });
        });

        // Group by date
        const jobsByDate = flattenedJobs.reduce((acc, job) => {
            const dateKey = format(new Date(job.date), 'yyyy-MM-dd');
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(job);
            return acc;
        }, {});

        // Check which dates have temporary drivers or school holidays
        const datesWithTempDrivers = {};
        const datesWithSchoolHolidays = {};
        const datesWithSpecialServices = {};

        Object.keys(jobsByDate).forEach(dateKey => {
            // Check for temporary drivers
            const tempDriverJob = jobsByDate[dateKey].find(job => job.isTemporaryDriver);
            if (tempDriverJob && tempDriverJob.temporaryDriverDetails) {
                datesWithTempDrivers[dateKey] = {
                    name: tempDriverJob.driverName,
                    timeOfDay: tempDriverJob.temporaryDriverDetails.timeOfDay || 'BOTH'
                };
            }

            // Check for school holidays
            const jobsWithHolidays = jobsByDate[dateKey].filter(job =>
                job.schoolHolidays && job.schoolHolidays.length > 0
            );

            if (jobsWithHolidays.length > 0) {
                // Collect all unique school holidays for this date
                const uniqueHolidays = new Map();

                jobsWithHolidays.forEach(job => {
                    job.schoolHolidays.forEach(holiday => {
                        // Use schoolId as key to avoid duplicates
                        if (holiday.schoolId && !uniqueHolidays.has(holiday.schoolId)) {
                            uniqueHolidays.set(holiday.schoolId, holiday);
                        }
                    });
                });

                datesWithSchoolHolidays[dateKey] = Array.from(uniqueHolidays.values());
            }

            // Check for special services
            const jobsWithSpecialServices = jobsByDate[dateKey].filter(job =>
                job.specialServices && job.specialServices.length > 0
            );

            if (jobsWithSpecialServices.length > 0) {
                // Collect all unique special services for this date
                const uniqueSpecialServices = new Map();

                jobsWithSpecialServices.forEach(job => {
                    job.specialServices.forEach(service => {
                        // Use combination of studentId and serviceType as key to avoid duplicates
                        const serviceKey = `${service.studentId}-${service.serviceType}`;
                        if (!uniqueSpecialServices.has(serviceKey)) {
                            uniqueSpecialServices.set(serviceKey, service);
                        }
                    });
                });

                datesWithSpecialServices[dateKey] = Array.from(uniqueSpecialServices.values());
            }
        });

        // Sort jobs within each date by type (AM first, then PM) and pickup time
        Object.keys(jobsByDate).forEach(dateKey => {
            jobsByDate[dateKey].sort((a, b) => {
                // First sort by type (AM comes before PM)
                if (a.type !== b.type) {
                    return a.type === 'AM' ? -1 : 1;
                }

                // If types are the same, sort by pickup time
                // Convert times like "07:30" to minutes for proper comparison
                const getMinutes = (timeStr) => {
                    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
                    return hours * 60 + minutes;
                };

                const aMinutes = getMinutes(a.pickupTime);
                const bMinutes = getMinutes(b.pickupTime);

                return aMinutes - bMinutes;
            });
        });

        // Sort dates
        const sortedDates = Object.keys(jobsByDate).sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        // Filter dates based on search term
        const filteredDates = sortedDates.filter(date => {
            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return jobsByDate[date].some(job =>
                (job.routeNo && job.routeNo.toLowerCase().includes(searchLower)) ||
                (job.passenger && job.passenger.toLowerCase().includes(searchLower)) ||
                (job.driver && job.driver.toLowerCase().includes(searchLower))
            );
        });

        // Get the first job to extract route details
        const firstJob = flattenedJobs[0] || null;

        // Collect all special services for the route to include in the expanded details panel
        const routeSpecialServices = firstJob ?
            flattenedJobs.reduce((services, job) => {
                if (job.specialServices && job.specialServices.length > 0) {
                    job.specialServices.forEach(service => {
                        // Use a unique key to avoid duplicates
                        const serviceKey = `${service.studentId}-${service.dayOfWeek}-${service.serviceType}`;
                        if (!services.some(s => `${s.studentId}-${s.dayOfWeek}-${s.serviceType}` === serviceKey)) {
                            services.push(service);
                        }
                    });
                }
                return services;
            }, []) : [];

        const routeOriginalSpecialServices = jobs.length > 0 ? jobs[0].specialServices || [] : [];

        return {
            flattenedJobs,
            jobsByDate,
            filteredDates,
            datesWithTempDrivers,
            datesWithSchoolHolidays,
            datesWithSpecialServices,
            firstJob,
            routeSpecialServices,
            routeOriginalSpecialServices,
        };
    }, [jobs, formattedStartDate, formattedEndDate, searchTerm]);

    // Toggle details panel
    const toggleDetailsPanel = useCallback(() => {
        setIsDetailsExpanded(prev => !prev);
    }, []);

    return {
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        selectedRouteId,
        setSelectedRouteId,
        searchTerm,
        setSearchTerm,
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
        routeOptions,
        selectedRoute,
        toggleDetailsPanel,
        ...processedJobData
    };
};