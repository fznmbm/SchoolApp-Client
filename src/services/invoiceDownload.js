// services/invoiceDownload.js
import { format, parseISO, eachDayOfInterval, getDay } from 'date-fns';

/**
 * Maps service type codes to readable descriptions
 * @param {string} serviceType - The service type code
 * @returns {string} - Human-readable service description
 */
const getServiceTypeLabel = (serviceType) => {
  const serviceTypeMap = {
    'EARLY_PICKUP': 'Early Pickup',
    'LATE_PICKUP': 'Late Pickup',
    'EXTRA_PICKUP': 'Extra Pickup',
    'OTHER': 'Special Service'
  };
  
  return serviceTypeMap[serviceType] || serviceType;
};

/**
 * Generates invoice title in format: driver_name_month_year_01
 * @param {Object} invoiceData - The invoice data
 * @returns {string} - Formatted invoice title
 */
const generateInvoiceTitle = (invoiceData) => {
  // Get driver name and clean it up
  const driverName = (invoiceData.name || 'Driver').toLowerCase().replace(/\s+/g, '_');
  
  // Get month and year from periodFrom date
  let month = '01';
  let year = new Date().getFullYear();
  
  if (invoiceData.periodFrom) {
    try {
      const periodDate = parseISO(invoiceData.periodFrom);
      if (!isNaN(periodDate.getTime())) {
        month = format(periodDate, 'MM');
        year = periodDate.getFullYear();
      }
    } catch (error) {
      console.warn('Error parsing periodFrom date:', error);
    }
  }
  
  return `${driverName}_${month}_${year}_01`;
};

/**
 * Renders a received driver invoice in a new window for viewing and printing
 * @param {Object} invoiceData - The invoice data from the database
 */
export const renderReceivedDriverInvoice = (invoiceData) => {
  const invoiceWindow = window.open('', '_blank');
  
  if (!invoiceWindow) {
    alert('Please allow popups to view the invoice');
    return;
  }
  
  // Check if any day in regular assignments has a second route with non-zero fare
  const hasSecondRoute = invoiceData.weeks?.some(week => 
    week.days?.some(day => day.routes && day.routes.length > 1)
  );
  
  // Generate complete date range from original date parameters
  const fullDateRange = generateCompleteDateRangeFromInvoice(invoiceData);
  
  // If date range generation failed, show a fallback message
  if (!fullDateRange || fullDateRange.length === 0) {
    console.warn('Could not generate date range for invoice, using fallback display');
  }
  
  // Create the invoice HTML
  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="filename" content="${generateInvoiceTitle(invoiceData)}.pdf">
      <title>${generateInvoiceTitle(invoiceData)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #000;
        }
        .invoice {
          width: 210mm;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .section-header {
          font-size: 20px;
          font-weight: bold;
          margin: 30px 0 15px 0;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }
        .driver-info {
          margin-bottom: 20px;
        }
        .week-section {
          margin-bottom: 20px;
        }
        .week-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .print-button {
          display: block;
          margin: 20px auto;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .summary {
          margin-top: 20px;
          font-weight: bold;
        }
        .empty-cell {
          background-color: #f9f9f9;
          color: #999;
        }
        .subtotal {
          text-align: right;
          font-weight: bold;
          font-size: 16px;
          margin: 10px 0;
        }
        @media print {
          .print-button {
            display: none;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print(); return false;">Print Invoice</button>
      
      <div class="invoice">
        <div class="header">${generateInvoiceTitle(invoiceData)}</div>
        
        <div class="driver-info">
          <p><strong>Name:</strong> ${invoiceData.name}</p>
          <p><strong>Mobile:</strong> ${invoiceData.mobile || 'N/A'}</p>
          <p><strong>Email:</strong> ${invoiceData.email || 'N/A'}</p>
          <p><strong>Address:</strong> ${invoiceData.address || 'N/A'}</p>
        </div>
        
        <div class="section-header">Regular Assignments</div>
        ${fullDateRange && fullDateRange.length > 0 
          ? generateWeeklyTablesFromInvoice(fullDateRange, hasSecondRoute)
          : '<p>No regular assignments data available for the selected period</p>'
        }
        <div class="subtotal">Regular Assignments Subtotal: £${calculateRegularAssignmentsTotal(invoiceData.weeks).toFixed(2)}</div>
        
        <div class="section-header">Extra Jobs</div>
        ${generateExtraJobsTables(invoiceData.extraJobs || [])}
        <div class="subtotal">Extra Jobs Subtotal: £${calculateExtraJobsTotal(invoiceData.extraJobs || []).toFixed(2)}</div>
        
        <div class="summary">
          <p>Period of work: From ${invoiceData.periodFrom ? format(parseISO(invoiceData.periodFrom), 'yyyy-MM-dd') : 'N/A'} To ${invoiceData.periodTo ? format(parseISO(invoiceData.periodTo), 'yyyy-MM-dd') : 'N/A'}</p>
          <p>Total Pay: £${(invoiceData.totalPay || 0).toFixed(2)}</p>
          <p>Print Name: ${invoiceData.name || 'N/A'}</p>
          <p>Date: ${format(new Date(), 'yyyy-MM-dd')}</p>
          <p>Submitted: ${invoiceData.submittedAt ? format(parseISO(invoiceData.submittedAt), 'yyyy-MM-dd HH:mm') : 'N/A'}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Write the invoice HTML to the new window
  invoiceWindow.document.write(invoiceHtml);
  invoiceWindow.document.close();
};

/**
 * Generate a complete date range with all days from start to end date for received invoices
 * @param {Object} invoiceData - The invoice data from the database
 * @returns {Array} - Array of weeks with all days in the date range
 */
const generateCompleteDateRangeFromInvoice = (invoiceData) => {
  // Parse the original date range with error handling
  if (!invoiceData.periodFrom || !invoiceData.periodTo) {
    console.warn('Missing period dates in invoice data:', invoiceData);
    return [];
  }
  
  const startDate = parseISO(invoiceData.periodFrom);
  const endDate = parseISO(invoiceData.periodTo);
  
  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn('Invalid date format in invoice data:', { 
      periodFrom: invoiceData.periodFrom, 
      periodTo: invoiceData.periodTo 
    });
    return [];
  }
  
  // Collect all days that actually have route data (only include days with routes)
  const daysWithRoutes = [];
  
  if (invoiceData.weeks) {
    invoiceData.weeks.forEach(week => {
      if (week.days) {
        week.days.forEach(day => {
          // Only include days that have routes with actual data
          if (day.date && day.routes && day.routes.length > 0) {
            // Check if at least one route has a name and fare > 0
            const hasValidRoute = day.routes.some(route => route.name && (Number(route.fare) > 0));
            if (hasValidRoute) {
              daysWithRoutes.push(day);
            }
          }
        });
      }
    });
  }
  
  // If no days with routes, return empty array
  if (daysWithRoutes.length === 0) {
    return [];
  }
  
  // Group by week - only include days that have actual route data
  const weekMap = new Map();
  // Use sequential week numbering for display (Week 1, Week 2, ...)
  let displayWeekCounter = 1;
  
  daysWithRoutes.forEach(day => {
    if (!day.date) return;
    
    const date = parseISO(day.date);
    if (isNaN(date.getTime())) return;
    
    const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
    // Use Monday as the start of the week for consistency
    const weekStartDate = new Date(date);
    // Adjust to get to Monday (if Sunday, go back 6 days, etc.)
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStartDate.setDate(weekStartDate.getDate() - daysToSubtract);
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');
    
    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {
        weekNumber: displayWeekCounter++,
        days: []
      });
    }
    
    // Ensure date is in yyyy-MM-dd format for consistency
    const dayData = {
      ...day,
      date: format(date, 'yyyy-MM-dd'),
      day: day.day || format(date, 'EEEE') // Use existing day name or generate it
    };
    
    weekMap.get(weekKey).days.push(dayData);
  });
  
  // Convert map to array and sort weeks
  const weeks = Array.from(weekMap.values());
  weeks.sort((a, b) => {
    if (a.days.length === 0 || b.days.length === 0) return 0;
    return new Date(a.days[0].date) - new Date(b.days[0].date);
  });
  
  // Re-number weeks sequentially after sorting
  weeks.forEach((week, index) => {
    week.weekNumber = index + 1;
    // Sort days within each week
    week.days.sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  
  return weeks;
};

/**
 * Generate the weekly tables HTML for regular assignments from received invoice
 * @param {Array} weeks - The weeks data
 * @param {boolean} hasSecondRoute - Whether to include the second route column
 * @returns {string} - HTML for weekly tables
 */
const generateWeeklyTablesFromInvoice = (weeks, hasSecondRoute) => {
  if (!weeks || weeks.length === 0) {
    return '<p>No regular workdays in the selected period</p>';
  }
  
  return weeks.map(week => {
    return `
      <div class="week-section">
        <div class="week-title">Week ${week.weekNumber}</div>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Route name 1</th>
              <th>Fare 1</th>
              ${hasSecondRoute ? `
                <th>Route name 2</th>
                <th>Fare 2</th>
              ` : ''}
            </tr>
          </thead>
          <tbody>
            ${week.days.map(day => {
              const route1 = day.routes && day.routes[0];
              const route2 = day.routes && day.routes[1];
              
              // Format date as "03 Nov 2025"
              let formattedDate = '';
              if (day.date) {
                try {
                  const dateObj = parseISO(day.date);
                  if (!isNaN(dateObj.getTime())) {
                    formattedDate = format(dateObj, 'dd MMM yyyy');
                  } else {
                    formattedDate = day.date;
                  }
                } catch (error) {
                  formattedDate = day.date;
                }
              }
              
              return `
                <tr>
                  <td>${day.day || ''}</td>
                  <td>${formattedDate}</td>
                  <td class="${!route1 ? 'empty-cell' : ''}">${route1 ? `${route1.name} (${route1.fare})` : ''}</td>
                  <td class="${!route1 ? 'empty-cell' : ''}">${route1 ? `£${route1.fare.toFixed(2)}` : '£0.00'}</td>
                  ${hasSecondRoute ? `
                    <td class="${!route2 ? 'empty-cell' : ''}">${route2 ? `${route2.name} (${route2.fare})` : ''}</td>
                    <td class="${!route2 ? 'empty-cell' : ''}">${route2 ? `£${route2.fare.toFixed(2)}` : '£0.00'}</td>
                  ` : ''}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }).join('');
};

/**
 * Generate the tables HTML for extra jobs
 * @param {Array} extraJobs - The extra jobs data
 * @returns {string} - HTML for extra jobs tables
 */
const generateExtraJobsTables = (extraJobs) => {
  if (!extraJobs || !Array.isArray(extraJobs) || extraJobs.length === 0) {
    return '<p>No extra jobs in the selected period</p>';
  }
  
  // Filter out any invalid entries
  const validJobs = extraJobs.filter(job => job && typeof job === 'object');
  
  return `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Fare</th>
        </tr>
      </thead>
      <tbody>
        ${validJobs.map(job => {
          // Format date with null check
          const formattedDate = job.date ? format(parseISO(job.date), 'yyyy-MM-dd') : 'N/A';
          // Ensure fare is a number
          const fare = Number(job.fare) || 0;
          
          return `
          <tr>
            <td>${formattedDate}</td>
            <td>${job.description || 'N/A'}</td>
            <td>£${fare.toFixed(2)}</td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
};

/**
 * Calculate total for regular assignments
 * @param {Array} weeks - The weeks data
 * @returns {number} - Total amount
 */
const calculateRegularAssignmentsTotal = (weeks) => {
  if (!weeks) return 0;
  
  let total = 0;
  weeks.forEach(week => {
    if (week.days) {
      week.days.forEach(day => {
        if (day.routes) {
          day.routes.forEach(route => {
            total += route.fare || 0;
          });
        }
      });
    }
  });
  
  return total;
};

/**
 * Calculate total for extra jobs
 * @param {Array} extraJobs - The extra jobs data
 * @returns {number} - Total amount
 */
const calculateExtraJobsTotal = (extraJobs) => {
  if (!extraJobs || !Array.isArray(extraJobs)) return 0;
  
  // Filter out invalid entries and calculate total
  return extraJobs
    .filter(job => job && typeof job === 'object')
    .reduce((total, job) => total + (Number(job.fare) || 0), 0);
};
