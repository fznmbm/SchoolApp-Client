import { format } from 'date-fns';
import { getInvoiceDetails } from '@services/invoice';
import invoiceSequenceGenerator from './InvoiceSequenceGenerator';

// Helper: is student absent for special service (AM/PM aware)
const isStudentAbsentForSpecialService = (job, date, studentId, serviceType, specialTime) => {
  if (!job || !job.attendance || job.attendance.length === 0) return false;
  const dateStr = date.toISOString().split('T')[0];
  const att = job.attendance.find(r=>{
    const recDateStr = new Date(r.date).toISOString().split('T')[0];
    return recDateStr===dateStr && r.student.toString()===studentId.toString();
  });
  if (!att) return false;
  // If student is marked as not present for the entire day, they're absent for special service
  if (att.present === false) return true;
  let isMorning;
  if (specialTime) {
    const t=specialTime.toLowerCase();
    isMorning = t.includes('am')||t.includes('morning')||(t.includes(':')&&parseInt(t.split(':')[0])<12);
  } else {
    isMorning = ['EARLY_PICKUP','LATE_PICKUP','EXTRA_PICKUP'].includes(serviceType);
  }
  return isMorning ? !att.morningAttended : !att.eveningAttended;
};

/**
 * Prepares invoice data for confirmation
 * @param {Object} options - The jobs and dates data
 * @returns {Promise<Object>} - The prepared invoice data
 */
export const prepareInvoiceData = async ({
  jobs,
  filteredDates,
  jobsByDate,
  startDate,
  endDate,
  routeOptions
}) => {
  // Calculate invoice data based on filtered jobs
  let totalAmount = 0;
  let routeName = '';
  let routeId = null;

  const dayOccurrences = {
    'monday': 0, 'tuesday': 0, 'wednesday': 0, 'thursday': 0,
    'friday': 0, 'saturday': 0, 'sunday': 0
  };

  // Get all jobs across all dates
  const allJobs = [];
  filteredDates.forEach(date => {
    allJobs.push(...jobsByDate[date]);
  });

  // Generate invoice number with proper sequencing (preview only, not committed yet)
  let invoiceNumberData = { fullNumber: 'invoice', components: null };

  if (allJobs.length > 0) {
    const routeNumber = allJobs[0].routeNo || '';

    // Use the month from the start date of the selected range
    const startMonth = format(startDate, 'MMM'); // Get abbreviated month name (Jan, Feb, etc.)
    const startYearFull = startDate.getFullYear();
    const startYearShort = String(startYearFull).slice(-2); // Get last 2 digits

    // Generate invoice number using the start date's month and year
    invoiceNumberData = invoiceSequenceGenerator.generatePreviewInvoiceNumber(
      routeNumber,
      startMonth,
      startYearShort,
      startYearFull
    );
  }

  // Extract driver info from first job
  const driverInfo = allJobs.length > 0 ? {
    driverName: allJobs[0].driverName || 'Driver'
  } : null;

  // Extract PA info if available
  const hasPa = allJobs.length > 0 && allJobs[0].isPANeeded;
  const paPrice = allJobs.length > 0 ? allJobs[0].paPrice || 0 : 0;

  // Calculate quantity as the number of days with at least one attending student
  // Determine effective dates from jobsByDate where any student's AM or PM attendance is true
  const effectiveDates = Array.isArray(filteredDates) && jobsByDate ?
    filteredDates.filter(date => {
      const jobsForDate = jobsByDate[date] || [];
      return jobsForDate.some(j => (j.morningAttended === true) || (j.eveningAttended === true));
    }) : filteredDates;

  const numberOfDays = effectiveDates.length;

  // Calculate total amount - if all jobs have the same price, use that 
  // Otherwise calculate a sum
  let pricePerDay = 0;
  if (allJobs.length > 0) {
    // Try to get a price from the first job
    pricePerDay = allJobs[0].price || 0;

    // Get route ID from the first job if available
    if (allJobs[0].route) {
      routeId = allJobs[0].route;
    }

    // If all jobs don't have the same price, calculate a different way
    const allSamePrice = allJobs.every(job => job.price === pricePerDay);
    if (!allSamePrice) {
      // Group by date and take the sum of unique prices per day
      const pricesByDate = {};
      allJobs.forEach(job => {
        const dateStr = format(new Date(job.date), 'yyyy-MM-dd');
        if (!pricesByDate[dateStr]) {
          pricesByDate[dateStr] = new Set();
        }
        if (job.price) {
          pricesByDate[dateStr].add(job.price);
        }
      });

      // Calculate average price per day
      let totalPrices = 0;
      let daysWithPrices = 0;
      Object.values(pricesByDate).forEach(priceSet => {
        if (priceSet.size > 0) {
          // Sum the unique prices for this day
          const dayTotal = Array.from(priceSet).reduce((sum, price) => sum + price, 0);
          totalPrices += dayTotal;
          daysWithPrices++;
        }
      });

      pricePerDay = daysWithPrices > 0 ? totalPrices / daysWithPrices : 0;
    }
  }

  // Get route daily price (should be used as unit price for driver)
  let routeDailyPrice = 0;


  let specialServiceAmount = 0;
  const specialServicesByDay = {};


  if (allJobs.length > 0) {
    // Use contractPrice as the route daily price
    routeDailyPrice = allJobs[0].contractPrice || 0;

    // If contractPrice is not available, try to get from route object or use calculated price
    if (routeDailyPrice === 0) {
      routeDailyPrice = allJobs[0].route?.dailyPrice || pricePerDay;
    }
  }

  if (allJobs.length > 0 && allJobs[0].originalSpecialServices && allJobs[0].originalSpecialServices.length > 0) {
    const specialServices = allJobs[0].originalSpecialServices;
    // group by day
    specialServices.forEach(s=>{
      if(!specialServicesByDay[s.dayOfWeek]) specialServicesByDay[s.dayOfWeek]=[];
      specialServicesByDay[s.dayOfWeek].push(s);
    });
    effectiveDates.forEach(ds=>{
      const d=new Date(ds);
      const dayNames=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const dayName=dayNames[d.getDay()];
      dayOccurrences[dayName]++;
    });

    Object.keys(specialServicesByDay).forEach(day=>{
      const services=specialServicesByDay[day];
      services.forEach(service=>{
        let presentDays=0;
        effectiveDates.forEach(ds=>{
          const d=new Date(ds);
          const dayName=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][d.getDay()];
          if(dayName!==day) return;
          const absent=isStudentAbsentForSpecialService(allJobs[0],d,service.studentId,service.serviceType,service.specialTime);
          if(!absent) presentDays++;
        });
        specialServiceAmount += service.additionalCharge*presentDays;
      });
    });
  }


  // Calculate total amount for route service
  const routeAmount = routeDailyPrice * numberOfDays;

  // Calculate PA amount if applicable
  const paAmount = hasPa ? paPrice * numberOfDays : 0;

  // Calculate total amount
  totalAmount = routeAmount + paAmount + specialServiceAmount;

  // Get route name and ID from route options if available
  if (allJobs.length > 0) {
    routeName = `Route ${allJobs[0].routeNo}`;

    // Find the selected route from options to get the full name and ID
    const routeOption = routeOptions.find(option => option.routeNo === allJobs[0].routeNo);
    if (routeOption) {
      routeName = routeOption.name;
      routeId = routeOption.id;
    }
  }

  let invoiceData;

  try {
    // Get invoice details from the API if we have a route ID
    const invoiceDetails = routeId ? await getInvoiceDetails(routeId) : null;

    // Extract company and vendor data if available
    const companyData = invoiceDetails?.company;
    const vendorData = invoiceDetails?.vendor;
    const routeData = invoiceDetails?.route;

    // Format vendor address if available
    const formattedVendorAddress = vendorData?.address?.formatted || [
      'P.O BOX 212-1',
      'FAVERDALE, V.gj',
      'Chelsea',
      'DL98 IAD'
    ];


    const invoiceItems = [
      {
        description: routeData?.invoiceTemplate ? routeData.invoiceTemplate : "",
        quantity: numberOfDays.toFixed(1),
        unitPrice: routeDailyPrice.toFixed(2),
        amount: routeAmount.toFixed(2)
      }
    ];

    if (specialServiceAmount > 0) {
      let specialServicesDesc = "Special Services";
      let dayCount = 0;
      Object.keys(specialServicesByDay).forEach(day => {
        const services = specialServicesByDay[day];
        services.forEach(service => {
          dayCount = dayOccurrences[day];
        });
      });

      invoiceItems.push({
        description: specialServicesDesc,
        quantity: dayCount.toFixed(1),
        unitPrice: (specialServiceAmount / dayCount).toFixed(2),
        amount: specialServiceAmount.toFixed(2)
      });
    }

    if (hasPa) {
      invoiceItems.push({
        description: `PA`,
        quantity: numberOfDays.toFixed(1),
        unitPrice: paPrice.toFixed(2),
        amount: paAmount.toFixed(2)
      });
    }

    // Create invoice data using API details or fallback to defaults
      invoiceData = {
      invoiceNumber: invoiceNumberData.fullNumber,
      invoiceNumberComponents: invoiceNumberData.components,
      invoiceDate: format(new Date(), 'yyyy-MM-dd'), // Default to today's date
      dateRange: `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
      // Client data (Vendor)
      clientName: vendorData?.name || 'CAPITA AP CO',
      clientAddress: formattedVendorAddress,
      // Company data (Supplier)
      supplierName: companyData?.name || 'ABC Cars',
      supplierAddress: companyData?.address || '1, Victorian way, Sussex, RH18QA',
      supplierPhone: companyData?.phoneNumber || '01444 xxxxxx',
      supplierEmail: companyData?.email || 'email@email.com',
      // Invoice items
      items: invoiceItems,
      // Totals
      netTotal: totalAmount.toFixed(2),
      vatRate: companyData?.tax || 20,
      vatAmount: (totalAmount * (companyData?.tax || 20) / 100).toFixed(2),
      totalAmount: (totalAmount * (1 + (companyData?.tax || 20) / 100)).toFixed(2),
        // Additional details
        driverPoNumber: routeData?.poNumber || '4100######',
        paPoNumber: routeData?.paPoNumber || (hasPa ? '4100######' : ''),
      vendorNumber: companyData?.vendorNumber || '10####',
      accountNumber: companyData?.accountNumber || '######',
      sortCode: companyData?.sortCode || '######',
      vatRegistrationNumber: companyData?.vatRegistrationNumber || '123456789',
      paymentMethod: companyData?.paymentMethod || 'Bank Transfer'
    };
  } catch (error) {
    console.error('Error fetching invoice details:', error);

    const invoiceItems = [
      {
        description: ``,
        quantity: numberOfDays.toFixed(1),
        unitPrice: routeDailyPrice.toFixed(2),
        amount: routeAmount.toFixed(2)
      }
    ];

    if (specialServiceAmount > 0) {
      invoiceItems.push({
        description: "Special Services",
        quantity: "1.0",
        unitPrice: specialServiceAmount.toFixed(2),
        amount: specialServiceAmount.toFixed(2)
      });
    }

    if (hasPa) {
      invoiceItems.push({
        description: `PA`,
        quantity: numberOfDays.toFixed(1),
        unitPrice: paPrice.toFixed(2),
        amount: paAmount.toFixed(2)
      });
    }

    // Fallback to basic data if API call fails
    invoiceData = {
      invoiceNumber: invoiceNumberData.fullNumber,
      invoiceNumberComponents: invoiceNumberData.components,
      invoiceDate: format(new Date(), 'yyyy-MM-dd'), // Default to today's date
      dateRange: `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
      clientName: 'CAPITA AP CO',
      clientAddress: [
        'P.O BOX 212-1',
        'FAVERDALE, V.gj',
        'Chelsea',
        'DL98 IAD'
      ],
      supplierName: 'ABC Cars',
      supplierAddress: '1, Victorian way, Sussex, RH18QA',
      supplierPhone: '01444 xxxxxx',
      supplierEmail: 'email@email.com',
      items: invoiceItems,
      netTotal: totalAmount.toFixed(2),
      vatRate: 20,
      vatAmount: (totalAmount * 0.2).toFixed(2),
      totalAmount: (totalAmount * 1.2).toFixed(2),
      driverPoNumber: '4100######',
      paPoNumber: hasPa ? '4100######' : '',
      vendorNumber: '10####',
      accountNumber: '######',
      sortCode: '######',
      vatRegistrationNumber: '123456789',
      paymentMethod: 'Bank Transfer'
    };
  }

  return invoiceData;
};

/**
 * Renders the invoice HTML in a new browser window
 * @param {Object} invoiceData - The data for the invoice
 */
export const renderInvoiceInNewWindow = (invoiceData) => {
  // Finalize the invoice number if components are available
  if (invoiceData.invoiceNumberComponents) {
    invoiceData.invoiceNumber = invoiceSequenceGenerator.finalizeCustomInvoiceNumber(
      invoiceData.invoiceNumberComponents
    );
  } else {
    invoiceSequenceGenerator.finalizeInvoiceNumber();
  }

  const invoiceWindow = window.open('', '_blank');

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
            }
            .invoice {
                width: 210mm;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 20px;
            }
            .header {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 30px;
            }
            .info-section {
                display: grid;
                grid-template-columns: 2fr 1fr;
                border: 1px solid #ddd;
            }
            .info-left {
                padding: 10px;
                border-right: 1px solid #ddd;
            }
            .info-right {
                padding: 10px;
            }
            .client-info, .supplier-info {
                margin-bottom: 10px;
            }
            .contact-info {
                display: flex;
                flex-direction: column;
                margin-top: 10px;
            }
            .contact-info > div {
                margin-bottom: 5px;
            }
            .invoice-details {
                display: flex;
                flex-direction: column;
                border-left: 1px solid #ddd;
                border-right: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                padding: 10px;
            }
            .detail-item {
                display: flex;
                margin-bottom: 10px;
                align-items: baseline;
            }
            .detail-item:last-child {
                margin-bottom: 0;
            }
            .detail-label {
                font-weight: bold;
                width: 220px;
                min-width: 220px;
                white-space: nowrap;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 30px;
            }
            .items-table th, .items-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            .items-table th {
                background-color: #f2f2f2;
            }
            .totals-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            .totals-table td {
                border: 1px solid #ddd;
                padding: 8px;
            }
            .payment-info {
                margin-top: 30px;
                border: 1px solid #ddd;
                padding: 10px;
            }
            .payment-table {
                width: 100%;
                margin-top: 10px;
            }
            .payment-table td {
                padding: 5px 0;
                border-bottom: 1px solid #ddd;
            }
            .payment-table tr:last-child td {
                border-bottom: none;
            }
            .bold {
                font-weight: bold;
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
        </style>
    </head>
    <body>
        <button class="print-button" onclick="window.print(); return false;">Print Invoice</button>
        
        <div class="invoice">
            <div class="header">INVOICE</div>
            
            <div class="info-section">
                <div class="info-left">
                    <div class="client-info">
                        <div class="bold">To: ${invoiceData.clientName}</div>
                                                ${invoiceData.clientAddress
      .filter(line => line !== null && line !== 'null')
      .map(line => `<div>${line}</div>`)
      .join('')}
                    </div>
                    
                    <div style="margin-top: 20px;"></div>
                    
                    <div class="supplier-info">
                        <div class="bold">From: ${invoiceData.supplierName}</div>
                        <div>${invoiceData.supplierAddress}</div>
                        <div class="contact-info">
                            <div>Phone: ${invoiceData.supplierPhone}</div>
                            <div>Email: ${invoiceData.supplierEmail}</div>
                        </div>
                    </div>
                </div>
                <div class="info-right">
                    <div class="bold">Date</div>
                    <div>${format(new Date(invoiceData.invoiceDate), 'dd/MM/yyyy')}</div>
                </div>
            </div>
            
            <div class="invoice-details">
                <div class="detail-item">
                    <div class="detail-label">Invoice Number</div>
                    <div>${invoiceData.invoiceNumberComponents.sequenceNumber}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Vendor Number</div>
                    <div>${invoiceData.vendorNumber}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Purchase Order Number</div>
                    <div>
                      ${[invoiceData.driverPoNumber, invoiceData.paPoNumber]
                        .filter(n => n && String(n).trim().length > 0)
                        .map(n => `<div>${n}</div>`)
                        .join('')}
                    </div>
                </div>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 50%;">Description</th>
                        <th>Quantity</th>
                        <th>Unit Pr.</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceData.items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>${item.unitPrice}</td>
                            <td>£${item.amount}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td colspan="3"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="3"></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            
            <table class="totals-table">
                <tr>
                    <td class="bold" style="width: 75%;">Net Total</td>
                    <td>£${invoiceData.netTotal}</td>
                </tr>
                <tr>
                    <td class="bold">VAT (${invoiceData.vatRate}%)</td>
                    <td>£${invoiceData.vatAmount}</td>
                </tr>
                <tr>
                    <td class="bold">Total</td>
                    <td class="bold">£${invoiceData.totalAmount}</td>
                </tr>
            </table>
            
            <div class="payment-info">
                <div class="bold">Payment Method ${invoiceData.paymentMethod}</div>
                <div class="bold" style="margin-top: 10px;">Vat registration number ${invoiceData.vatRegistrationNumber}</div>
                
                <table class="payment-table">
                    <tr>
                        <td class="bold" style="width: 150px;">Name</td>
                        <td>${invoiceData.supplierName}</td>
                    </tr>
                    <tr>
                        <td class="bold">AC No</td>
                        <td>${invoiceData.accountNumber}</td>
                    </tr>
                    <tr>
                        <td class="bold">Sort Code</td>
                        <td>${invoiceData.sortCode}</td>
                    </tr>
                </table>
            </div>
        </div>
    </body>
    </html>
  `;

  // Write the invoice HTML to the new window
  invoiceWindow.document.write(invoiceHtml);
  invoiceWindow.document.close();
};