import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarData } from '@services/calendar';
import { getRoutes } from '@services/route';

// Helper for consistent date string formatting - fixes timezone issues
const formatDateString = (date) => {
  if (date instanceof Date) {
    // Use a method that preserves the local date without timezone conversion
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  
  // Handle date strings that might include time
  if (typeof date === 'string') {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // If it includes time (has a T), split and take date part
    if (date.includes('T')) {
      return date.split('T')[0];
    }
  }
  
  return date;
};

// Helper to check if a date is in the job's operatingDates
const isDateInOperatingDates = (dateToCheck, operatingDates) => {
  if (!operatingDates || !Array.isArray(operatingDates) || operatingDates.length === 0) {
    return false;
  }
  
  // Format the date to check in the same way as operatingDates
  const formattedDateToCheck = formatDateString(dateToCheck);
  
  // Check if the formatted date exists in the operatingDates array
  return operatingDates.some(opDate => {
    const formattedOpDate = formatDateString(opDate);
    return formattedDateToCheck === formattedOpDate;
  });
};

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoute, setSelectedRoute] = useState('');
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Fetch calendar data from API
  const { data, isLoading: isCalendarLoading, error: calendarError } = useQuery({
    queryKey: ['calendarData', month, year],
    queryFn: () => getCalendarData(month, year),
    placeholderData: (previousData) => previousData
  });

  // Fetch routes directly from API
  const { data: routesData, isLoading: isRoutesLoading, error: routesError } = useQuery({
    queryKey: ['routes'],
    queryFn: () => getRoutes({ isActive: true }),
  });

  // Get routes from API data
  const routes = useMemo(() => {
    if (!routesData || !Array.isArray(routesData)) return [];
    
    // Return all active routes
    return routesData.map(route => route.routeNo || route.name);
  }, [routesData]);

  // Set initial selected route when routes are loaded
  useEffect(() => {
    if (routes.length > 0 && !selectedRoute) {
      setSelectedRoute(routes[0]);
    }
  }, [routes, selectedRoute]);

  // Make sure we always have a route selected if available
  const routeToUse = selectedRoute || (routes.length > 0 ? routes[0] : '');

  // Navigation functions
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar grid data
  const calendarDays = useMemo(() => {
    if (!data) return [];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Process and organize the event data by date
    const eventsByDate = {};

    // Day mapping for special services
    const dayMap = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };

    // Process jobs and their events
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach(job => {
        // Skip if this isn't the selected route
        if (job.routeNo !== routeToUse) {
          return;
        }

        // Process school holidays
        if (job.schoolHolidays && Array.isArray(job.schoolHolidays)) {
          job.schoolHolidays.forEach(holiday => {
            const dateStr = formatDateString(holiday.date);
            if (!eventsByDate[dateStr]) {
              eventsByDate[dateStr] = { events: [] };
            }

            // Check if this school holiday is already in the list
            const existingHoliday = eventsByDate[dateStr].events.find(
              e => e.type === 'holiday' && e.schoolId === holiday.schoolId
            );

            if (!existingHoliday) {
              eventsByDate[dateStr].events.push({
                type: 'holiday',
                schoolId: holiday.schoolId,
                schoolName: holiday.schoolName,
                routeNo: job.routeNo, // Include route number for filtering
                label: holiday.schoolName
              });
            }
          });
        }
        
        // Process temporary driver assignments
        if (job.temporaryAssignments && Array.isArray(job.temporaryAssignments)) {
          job.temporaryAssignments.forEach(assignment => {
            if (!assignment.date) return;

            // Ensure the date is correctly formatted
            const dateStr = formatDateString(assignment.date);
            if (!eventsByDate[dateStr]) {
              eventsByDate[dateStr] = { events: [] };
            }

            // Make sure driver object exists and has name
            const driverName = assignment.driver && assignment.driver.name
              ? assignment.driver.name
              : 'Unknown Driver';

            eventsByDate[dateStr].events.push({
              type: 'tempDriver',
              routeNo: job.routeNo,
              driverName: driverName,
              timeOfDay: assignment.timeOfDay || 'BOTH',
              label: `${driverName.split(' ')[0]} - ${assignment.timeOfDay || 'BOTH'}`
            });
          });
        }

        // Process special services - FIXED VERSION
        if (job.specialServices && Array.isArray(job.specialServices)) {
          job.specialServices.forEach(service => {
            if (!service.dayOfWeek) return;

            // Map day of week to dates in current month
            const dayIndex = dayMap[service.dayOfWeek.toLowerCase()];

            if (dayIndex !== undefined) {
              // Find all dates in current month that match this day of week
              for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(year, month, i);
                if (date.getDay() === dayIndex) {
                  // Only add special service if this date is in the job's operating dates
                  const dateStr = formatDateString(date);
                  
                  // Check if this date is in the job's operating dates
                  if (isDateInOperatingDates(dateStr, job.operatingDates)) {
                    if (!eventsByDate[dateStr]) {
                      eventsByDate[dateStr] = { events: [] };
                    }
                    
                    eventsByDate[dateStr].events.push({
                      type: 'specialService',
                      routeNo: job.routeNo,
                      studentName: service.studentName || 'Unknown Student',
                      serviceType: service.serviceType || 'Service',
                      label: `${(service.studentName || 'Student').split(' ')[0]} - ${service.serviceType || 'Service'}`
                    });
                  }
                }
              }
            }
          });
        }

        // Process absences
        if (job.attendance && Array.isArray(job.attendance)) {
          job.attendance.forEach(record => {
            if (!record.date) return;

            // Check for absences based only on morningAttended and eveningAttended flags
            const isMorningAbsent = !record.morningAttended;
            const isEveningAbsent = !record.eveningAttended;
            
            // Only process if at least one session was missed
            if (isMorningAbsent || isEveningAbsent) {
              const dateStr = formatDateString(record.date);

              if (!eventsByDate[dateStr]) {
                eventsByDate[dateStr] = { events: [] };
              }

              // Check if there's already a school holiday for this date
              const hasHoliday = eventsByDate[dateStr].events.some(e =>
                e.type === 'holiday' && e.routeNo === job.routeNo
              );

              // Only add absence if it's not a holiday
              if (!hasHoliday) {
                // Determine absence type (AM, PM, or All)
                const attendanceType = isMorningAbsent && isEveningAbsent ?
                  'All' :
                  isMorningAbsent ? 'AM' : 'PM';

                // Get student name safely
                const studentName = record.student ?
                  `${record.student.firstName || ''} ${record.student.lastName || ''}`.trim() :
                  'Unknown Student';

                // Get student first name for label
                const studentFirstName = record.student && record.student.firstName ?
                  record.student.firstName :
                  'Student';

                eventsByDate[dateStr].events.push({
                  type: 'absence',
                  routeNo: job.routeNo,
                  studentName: studentName,
                  attendanceType: attendanceType,
                  label: `${studentFirstName} - ${attendanceType}`
                });
              }
            }
          });
        }
      });
    }

    // Add blank spaces for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDateString(date);
      const eventsData = eventsByDate[dateStr] || { events: [] };

      // Sort events: holidays first, then by type and route
      const sortedEvents = [...eventsData.events].sort((a, b) => {
        // Holidays come first
        if (a.type === 'holiday' && b.type !== 'holiday') return -1;
        if (a.type !== 'holiday' && b.type === 'holiday') return 1;

        // Group by type
        if (a.type !== b.type) {
          const typeOrder = {
            'holiday': 0,
            'tempDriver': 1,
            'specialService': 2,
            'absence': 3
          };
          return typeOrder[a.type] - typeOrder[b.type];
        }

        // Group by route
        if (a.routeNo !== b.routeNo) {
          // Handle null routeNo 
          if (a.routeNo === null) return -1;
          if (b.routeNo === null) return 1;
          return String(a.routeNo).localeCompare(String(b.routeNo));
        }

        return 0;
      });

      days.push({
        day: i,
        date: dateStr,
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
        events: sortedEvents,
        hasMoreEvents: sortedEvents.length > 5 // Show max 5 events per day
      });
    }

    // Add blank spaces for days after the last day of month (to complete the grid)
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42
    for (let i = 0; i < remainingCells; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    return days;
  }, [data, month, year, routeToUse]);

  return {
    currentDate,
    month,
    year,
    calendarDays,
    nextMonth,
    prevMonth,
    goToToday,
    isLoading: isCalendarLoading || isRoutesLoading,
    error: calendarError || routesError,
    routes,
    selectedRoute,
    setSelectedRoute
  };
};