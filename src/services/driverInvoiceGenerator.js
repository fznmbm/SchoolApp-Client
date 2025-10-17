// utils/driverInvoiceGenerator.js
import { format, parseISO, eachDayOfInterval, getDay, getWeek } from 'date-fns';

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
 * Renders a driver invoice in a new window
 * @param {Object} invoiceData - The invoice data from the API
 */
export const renderDriverInvoice = (invoiceData) => {
  const invoiceWindow = window.open('', '_blank');
  
  if (!invoiceWindow) {
    alert('Please allow popups to view the invoice');
    return;
  }
  
  // Check if any day in regular assignments has a second route with non-zero fare
  const hasSecondRoute = invoiceData.regularAssignments.weeks.some(week => 
    week.days.some(day => day.route2 && day.route2.fare && day.route2.fare > 0)
  );
  
  // Generate complete date range from original date parameters
  const fullDateRange = generateCompleteDateRange(invoiceData);
  
  // Create the invoice HTML
  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice For Self Employment Work</title>
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
        <div class="header">Invoice For Self Employment Work</div>
        
        <div class="driver-info">
          <p><strong>Name:</strong> ${invoiceData.driver.name}</p>
          <p><strong>Mobile:</strong> ${invoiceData.driver.phoneNumber || 'N/A'}</p>
          <p><strong>Email:</strong> ${invoiceData.driver.email || 'N/A'}</p>
          <p><strong>Address:</strong> ${invoiceData.driver.address || 'N/A'}</p>
        </div>
        
        <div class="section-header">Regular Assignments</div>
        ${generateWeeklyTables(fullDateRange, hasSecondRoute)}
        <div class="subtotal">Regular Assignments Subtotal: £${invoiceData.regularAssignments.totalPay.toFixed(2)}</div>
        
        <div class="section-header">Temporary Assignments</div>
        ${generateTemporaryAssignmentsTables(invoiceData.temporaryAssignments.days)}
        <div class="subtotal">Temporary Assignments Subtotal: £${invoiceData.temporaryAssignments.totalPay.toFixed(2)}</div>
        
        <div class="section-header">Special Services</div>
        ${generateSpecialServicesTables(invoiceData.specialServices.services)}
        <div class="subtotal">Special Services Subtotal: £${invoiceData.specialServices.totalPay.toFixed(2)}</div>
        
        <div class="summary">
          <p>Period of work: From ${invoiceData.originalDateRange.startDate} To ${invoiceData.originalDateRange.endDate}</p>
          <p>Total Pay: £${invoiceData.totalPay.toFixed(2)}</p>
          <p>Print Name: ${invoiceData.driver.name}</p>
          <p>Date: ${format(new Date(), 'yyyy-MM-dd')}</p>
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
 * Generate a complete date range with all days from start to end date
 * @param {Object} invoiceData - The invoice data from the API
 * @returns {Array} - Array of weeks with all days in the date range
 */
const generateCompleteDateRange = (invoiceData) => {
  // Parse the original date range
  const startDate = parseISO(invoiceData.originalDateRange.startDate);
  const endDate = parseISO(invoiceData.originalDateRange.endDate);
  
  // Create a map of existing data for lookup
  const routeDataByDate = new Map();
  
  // Add all existing days from regular assignments to the map
  invoiceData.regularAssignments.weeks.forEach(week => {
    week.days.forEach(day => {
      routeDataByDate.set(day.date, day);
    });
  });
  
  // Generate all dates in the range
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group by week
  const weekMap = new Map();
  let weekCounter = 1;
  
  allDates.forEach(date => {
    const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
    const dateString = format(date, 'yyyy-MM-dd');
    // Use Monday as the start of the week for consistency
    const weekStartDate = new Date(date);
    // Adjust to get to Monday (if Sunday, go back 6 days, etc.)
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStartDate.setDate(weekStartDate.getDate() - daysToSubtract);
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');
    
    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {
        weekNumber: weekCounter++,
        days: []
      });
    }
    
    // Get existing data or create empty day
    const existingData = routeDataByDate.get(dateString);
    const dayData = existingData || {
      day: format(date, 'EEEE'), // Full day name
      date: dateString,
      route1: null,
      route2: null
    };
    
    weekMap.get(weekKey).days.push(dayData);
  });
  
  // Convert map to array and sort weeks
  const weeks = Array.from(weekMap.values());
  weeks.sort((a, b) => {
    if (a.days.length === 0 || b.days.length === 0) return 0;
    return new Date(a.days[0].date) - new Date(b.days[0].date);
  });
  
  // Sort days within each week
  weeks.forEach(week => {
    week.days.sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  
  return weeks;
};

/**
 * Generate the weekly tables HTML for regular assignments
 * @param {Array} weeks - The weeks data
 * @param {boolean} hasSecondRoute - Whether to include the second route column
 * @returns {string} - HTML for weekly tables
 */
const generateWeeklyTables = (weeks, hasSecondRoute) => {
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
              ${hasSecondRoute && week.days.some(day => day.extraRoutes && day.extraRoutes.length > 0) ? `
                <th>Additional Routes</th>
              ` : ''}
            </tr>
          </thead>
          <tbody>
            ${week.days.map(day => `
              <tr>
                <td>${day.day || ''}</td>
                <td>${day.date || ''}</td>
                <td class="${!day.route1 ? 'empty-cell' : ''}">${day.route1 ? `${day.route1.routeName} (${day.route1.routeNo})` : ''}</td>
                <td class="${!day.route1 ? 'empty-cell' : ''}">${(day.route1 && day.route1.fare && day.route1.fare > 0) ? `£${day.route1.fare.toFixed(2)}` : '£0.00'}</td>
                ${hasSecondRoute ? `
                  <td class="${!day.route2 ? 'empty-cell' : ''}">${day.route2 ? `${day.route2.routeName} (${day.route2.routeNo})` : ''}</td>
                  <td class="${!day.route2 ? 'empty-cell' : ''}">${(day.route2 && day.route2.fare && day.route2.fare > 0) ? `£${day.route2.fare.toFixed(2)}` : '£0.00'}</td>
                ` : ''}
                ${hasSecondRoute && day.extraRoutes && day.extraRoutes.length > 0 ? `
                  <td>
                    ${day.extraRoutes.map(route => `
                      <div>${route.routeName} (${route.routeNo}): £${route.fare.toFixed(2)}</div>
                    `).join('')}
                  </td>
                ` : hasSecondRoute && week.days.some(d => d.extraRoutes && d.extraRoutes.length > 0) ? `
                  <td class="empty-cell"></td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }).join('');
};

/**
 * Generate the tables HTML for special services
 * @param {Array} services - The special services data
 * @returns {string} - HTML for special services tables
 */
const generateSpecialServicesTables = (services) => {
  if (!services || services.length === 0) {
    return '<p>No special services in the selected period</p>';
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Date</th>
          <th>Route</th>
          <th>Service Type</th>
          <th>Time</th>
          <th>Notes</th>
          <th>Additional Charge</th>
        </tr>
      </thead>
      <tbody>
        ${services.map(service => `
          <tr>
            <td>${service.day}</td>
            <td>${service.date}</td>
            <td>${service.routeName} (${service.routeNo})</td>
            <td>${getServiceTypeLabel(service.serviceType)}</td>
            <td>${service.specialTime || 'N/A'}</td>
            <td>${service.notes || ''}</td>
            <td>£${service.additionalCharge.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

/**
 * Generate the tables HTML for temporary assignments
 * @param {Array} days - The temporary assignment days
 * @returns {string} - HTML for temporary assignments tables
 */
const generateTemporaryAssignmentsTables = (temporaryDays) => {
  if (!temporaryDays || temporaryDays.length === 0) {
    return '<p>No temporary assignments in the selected period</p>';
  }
  
  // Group by date
  const dateMap = new Map();
  temporaryDays.forEach(day => {
    if (day.routes && day.routes.length > 0) {
      dateMap.set(day.date, day);
    }
  });
  
  if (dateMap.size === 0) {
    return '<p>No temporary assignments in the selected period</p>';
  }
  
  // Sort dates
  const sortedDates = Array.from(dateMap.keys()).sort();
  
  return `
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Date</th>
          <th>Route</th>
          <th>Fare</th>
        </tr>
      </thead>
      <tbody>
        ${sortedDates.map(date => {
          const day = dateMap.get(date);
          return day.routes.map((route, index) => `
            <tr>
              ${index === 0 ? `
                <td rowspan="${day.routes.length}">${day.day}</td>
                <td rowspan="${day.routes.length}">${day.date}</td>
              ` : ''}
              <td>${route.routeName} (${route.routeNo})</td>
              <td>£${route.fare.toFixed(2)}</td>
            </tr>
          `).join('');
        }).join('')}
      </tbody>
    </table>
  `;
};