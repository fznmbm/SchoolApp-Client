export const formatTime = (time, use12Hour = true) => {
    if (!time) return '';
    
    // Extract hours and minutes from time string
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    
    if (isNaN(hours) || isNaN(minutes)) {
      return time; // Return original if parsing fails
    }
    
    if (use12Hour) {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  /**
   * Format a date to a readable string
   * @param {Date|string} date - Date object or date string
   * @param {string} format - Format of the output ('short', 'medium', 'long')
   * @returns {string} Formatted date string
   */
  export const formatDate = (date, format = 'medium') => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return String(date); // Return original if parsing fails
    }
    
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString('en-US', { 
          month: 'numeric', 
          day: 'numeric', 
          year: '2-digit' 
        });
      case 'long':
        return dateObj.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      case 'medium':
      default:
        return dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
    }
  };
  
  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: 'USD')
   * @returns {string} Formatted currency string
   */
  export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  /**
   * Format phone number to a readable format
   * @param {string} phone - Phone number string
   * @returns {string} Formatted phone number
   */
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format according to length
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // If not standard format, return with proper spacing
    if (cleaned.length > 4) {
      return cleaned.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
    }
    
    return phone; // Return original if cannot be formatted
  };
  
  /**
   * Format job status to a more readable string
   * @param {string} status - Job status code
   * @returns {string} Formatted status string
   */
  export const formatJobStatus = (status) => {
    if (!status) return '';
    
    const statusMap = {
      'ACTIVE': 'Active',
      'COMPLETED': 'Completed',
      'RENEWED': 'Renewed',
      'CANCELLED': 'Cancelled'
    };
    
    return statusMap[status] || status;
  };
  
  /**
   * Capitalize first letter of each word in a string
   * @param {string} text - Input text
   * @returns {string} Text with first letter of each word capitalized
   */
  export const toTitleCase = (text) => {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Format operation day to a more readable format
   * @param {string} day - Day of week (e.g., 'monday')
   * @returns {string} Formatted day
   */
  export const formatDay = (day) => {
    if (!day) return '';
    
    const days = {
      'monday': 'Monday',
      'tuesday': 'Tuesday',
      'wednesday': 'Wednesday',
      'thursday': 'Thursday',
      'friday': 'Friday',
      'saturday': 'Saturday',
      'sunday': 'Sunday'
    };
    
    return days[day.toLowerCase()] || day;
  };
  
  /**
   * Format array of days into a readable string
   * @param {Array} days - Array of days
   * @returns {string} Formatted days string
   */
  export const formatDays = (days) => {
    if (!days || days.length === 0) return 'No days';
    
    if (days.length === 7) return 'Every day';
    
    if (days.every(day => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.toLowerCase()))) {
      return 'Weekdays';
    }
    
    if (days.every(day => ['saturday', 'sunday'].includes(day.toLowerCase()))) {
      return 'Weekends';
    }
    
    // For 1-3 days, show full names
    if (days.length <= 3) {
      return days.map(day => formatDay(day)).join(', ');
    }
    
    // For more than 3 days, use abbreviations
    const abbreviations = {
      'monday': 'Mon',
      'tuesday': 'Tue',
      'wednesday': 'Wed',
      'thursday': 'Thu',
      'friday': 'Fri',
      'saturday': 'Sat',
      'sunday': 'Sun'
    };
    
    return days.map(day => abbreviations[day.toLowerCase()] || day).join(', ');
  };
  
  /**
   * Truncate text to a specific length with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 50) => {
    if (!text) return '';
    
    if (text.length <= length) {
      return text;
    }
    
    return text.substring(0, length) + '...';
  };