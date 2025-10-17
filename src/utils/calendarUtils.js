/**
 * Helper for consistent date string formatting - fixes timezone issues
 */
export const formatDateString = (date) => {
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
  
  /**
   * Helper to check if a date is in the job's operatingDates
   */
  export const isDateInOperatingDates = (dateToCheck, operatingDates) => {
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