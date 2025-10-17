import axios from "../utils/api/axios";

export const getCalendarData = async (month, year) => {
  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    // Format dates for API
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Fetch jobs with attendance data, route info, and school holidays
    const response = await axios.get('/jobs', {
      params: {
        startDateFrom: startDateStr,
        startDateTo: endDateStr,
        limit: 100, // Adjust as needed
        includeHolidays: true,
        includeAttendance: true,
        includeSpecialServices: true,
        includeTemporaryAssignments: true
      }
    });
    
    // Add debugging if needed
    
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    throw error;
  }
};