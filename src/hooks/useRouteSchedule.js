import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarData } from '@services/calendar';
import { formatDateString, isDateInOperatingDates } from '@utils/calendarUtils';

/**
 * Custom hook for route schedule functionality
 */
export const useRouteSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const [selectedDay, setSelectedDay] = useState(null);
  
  const [eventTypeFilters, setEventTypeFilters] = useState({
    holiday: true,
    tempDriver: true,
    specialService: true,
    absence: true
  });
  
  // Handle event type filter changes
  const handleFilterChange = useCallback((eventType) => {
    setEventTypeFilters(prev => ({
      ...prev,
      [eventType]: !prev[eventType]
    }));
  }, []);
  
  // Navigation functions
  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1));
  }, [month, year]);
  
  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1));
  }, [month, year]);
  
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);
  
  // Fetch calendar data from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['calendarData', month, year],
    queryFn: () => getCalendarData(month, year),
    placeholderData: (previousData) => previousData
  });
  
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
  
  // Process data for route-based view
  const { dates, routeEvents, availableRoutes } = useMemo(() => {
    const result = {
      dates: [],
      routeEvents: {},
      availableRoutes: []
    };
    
    if (!data || !data.data) return result;
    
    // Get all routes
    const routeSet = new Set();
    data.data.forEach(job => {
      if (job.routeNo) {
        routeSet.add(job.routeNo);
      }
    });
    result.availableRoutes = Array.from(routeSet).sort();
    
    // Generate dates for the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      result.dates.push(new Date(year, month, i));
    }
    
    // Initialize route events map
    result.availableRoutes.forEach(route => {
      result.routeEvents[route] = {};
      result.dates.forEach(date => {
        const dateStr = formatDateString(date);
        result.routeEvents[route][dateStr] = [];
      });
    });
    
    // Process jobs and their events
    if (Array.isArray(data.data)) {
      data.data.forEach(job => processJobEvents(job, result, month, year, dayMap));
    }
    
    return result;
  }, [data, month, year, dayMap]);
  
  // Filter events based on event type filters
  const getFilteredEvents = useCallback((events) => {
    if (!events) return [];
    return events.filter(event => event.type && eventTypeFilters[event.type]);
  }, [eventTypeFilters]);
  
  // Handle day cell click
  const handleDayCellClick = useCallback((dayData) => {
    setSelectedDay(dayData);
  }, []);
  
  return {
    month,
    year,
    currentDate,
    selectedDay,
    setSelectedDay,
    eventTypeFilters,
    handleFilterChange,
    nextMonth,
    prevMonth,
    goToToday,
    getFilteredEvents,
    handleDayCellClick,
    dates,
    routeEvents,
    availableRoutes,
    isLoading,
    error
  };
};

/**
 * Helper function to process job events
 */
function processJobEvents(job, result, month, year, dayMap) {
  const routeNo = job.routeNo;
  if (!routeNo || !result.routeEvents[routeNo]) return;
  
  // Process school holidays
  if (job.schoolHolidays && Array.isArray(job.schoolHolidays)) {
    job.schoolHolidays.forEach(holiday => {
      const dateStr = formatDateString(holiday.date);
      if (!result.routeEvents[routeNo][dateStr]) return;
      
      // Check if this school holiday is already in the list
      const existingHoliday = result.routeEvents[routeNo][dateStr].find(
        e => e.type === 'holiday' && e.schoolId === holiday.schoolId
      );
      
      if (!existingHoliday) {
        result.routeEvents[routeNo][dateStr].push({
          type: 'holiday',
          schoolId: holiday.schoolId,
          schoolName: holiday.schoolName || 'School Holiday',
          label: holiday.schoolName || 'School Holiday',
          description: 'School closed for holiday'
        });
      }
    });
  }
  
  // Process temporary driver assignments
  if (job.temporaryAssignments && Array.isArray(job.temporaryAssignments)) {
    job.temporaryAssignments.forEach(assignment => {
      if (!assignment.date) return;
      
      const dateStr = formatDateString(assignment.date);
      if (!result.routeEvents[routeNo][dateStr]) return;
      
      const driverName = assignment.driver && assignment.driver.name 
        ? assignment.driver.name 
        : 'Unknown Driver';
      
      const timeOfDay = assignment.timeOfDay || 'BOTH';
      
      result.routeEvents[routeNo][dateStr].push({
        type: 'tempDriver',
        driverName: driverName,
        timeOfDay: timeOfDay,
        label: `${driverName.split(' ')[0]} - ${timeOfDay}`,
        description: `Temporary driver ${driverName} assigned for ${timeOfDay === 'BOTH' ? 'morning and afternoon' : timeOfDay === 'AM' ? 'morning' : 'afternoon'} routes`
      });
    });
  }
  
  // Process special services
  processSpecialServices(job, result, month, year, dayMap);
  
  // Process absences
  processAbsences(job, result);
}

/**
 * Helper function to process special services
 */
function processSpecialServices(job, result, month, year, dayMap) {
  if (!job.specialServices || !Array.isArray(job.specialServices)) return;
  
  const routeNo = job.routeNo;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
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
            if (!result.routeEvents[routeNo][dateStr]) continue;
            
            result.routeEvents[routeNo][dateStr].push({
              type: 'specialService',
              studentName: service.studentName || 'Unknown Student',
              serviceType: service.serviceType || 'Service',
              label: `${(service.studentName || 'Student').split(' ')[0]} - ${service.serviceType || 'Service'}`,
              description: `Special service: ${service.serviceType || 'Service'} for ${service.studentName || 'Unknown Student'}`
            });
          }
        }
      }
    }
  });
}

/**
 * Helper function to process absences
 */
function processAbsences(job, result) {
  if (!job.attendance || !Array.isArray(job.attendance)) return;
  
  const routeNo = job.routeNo;
  
  job.attendance.forEach(record => {
    if (!record.date) return;
    
    // Check for absences based only on morningAttended and eveningAttended flags
    const isMorningAbsent = !record.morningAttended;
    const isEveningAbsent = !record.eveningAttended;
    
    // Only process if at least one session was missed
    if (isMorningAbsent || isEveningAbsent) {
      const dateStr = formatDateString(record.date);
      if (!result.routeEvents[routeNo][dateStr]) return;
      
      // Check if there's already a school holiday for this date
      const hasHoliday = result.routeEvents[routeNo][dateStr].some(e => e.type === 'holiday');
      
      // Only add absence if it's not a holiday
      if (!hasHoliday) {
        // Get student info safely
        const studentName = record.student ? 
          `${record.student.firstName || ''} ${record.student.lastName || ''}`.trim() : 
          'Unknown Student';
        
        const studentFirstName = record.student && record.student.firstName ? 
          record.student.firstName : 
          'Student';
        
        const attendanceType = isMorningAbsent && isEveningAbsent ? 
          'All Day' : 
          isMorningAbsent ? 'Morning' : 'Afternoon';
        
        result.routeEvents[routeNo][dateStr].push({
          type: 'absence',
          studentName: studentName,
          attendanceType: attendanceType,
          label: `${studentFirstName} - ${attendanceType === 'All Day' ? 'All' : attendanceType === 'Morning' ? 'AM' : 'PM'}`,
          description: `${studentName} absent for ${attendanceType.toLowerCase()} session${attendanceType === 'All Day' ? 's' : ''}`
        });
      }
    }
  });
}