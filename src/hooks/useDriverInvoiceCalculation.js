import { useCallback } from 'react';

/**
 * Custom hook for invoice calculation operations
 */
const useDriverInvoiceCalculation = () => {
  /**
   * Recalculates all totals for the invoice data
   * @param {Object} data - The invoice data object
   * @returns {Object} The updated invoice data object with recalculated totals
   */
  const recalculateTotals = useCallback((data) => {
    // Recalculate regular assignments total
    let regularTotal = 0;
    data.regularAssignments.weeks.forEach(week => {
      week.days.forEach(day => {
        if (day.route1) regularTotal += day.route1.fare || 0;
        if (day.route2) regularTotal += day.route2.fare || 0;
        if (day.extraRoutes) {
          day.extraRoutes.forEach(route => {
            regularTotal += route.fare || 0;
          });
        }
      });
    });
    
    // Recalculate temporary assignments total
    let tempTotal = 0;
    data.temporaryAssignments.days.forEach(day => {
      day.routes.forEach(route => {
        tempTotal += route.fare || 0;
      });
    });
    
    // Recalculate special services total
    let specialTotal = 0;
    if (data.specialServices.services) {
      data.specialServices.services.forEach(service => {
        specialTotal += service.additionalCharge || 0;
      });
    }
    
    // Update subtotals
    data.regularAssignments.totalPay = regularTotal;
    data.temporaryAssignments.totalPay = tempTotal;
    data.specialServices.totalPay = specialTotal;
    
    // Update grand total
    data.totalPay = regularTotal + tempTotal + specialTotal;
    
    return data;
  }, []);

  return {
    recalculateTotals
  };
};

export default useDriverInvoiceCalculation;