import { useCallback } from 'react';

/**
 * Custom hook for invoice calculations
 * 
 * @param {Object} values - The invoice values
 * @param {Function} setFieldValue - Formik's setFieldValue function
 * @returns {Object} - Object containing calculation functions
 */
const useInvoiceCalculations = (values, setFieldValue) => {
  /**
   * Recalculate all totals based on line items
   */
  const recalculateTotals = useCallback(() => {
    let newNetTotal = 0;
    values.items.forEach((item) => {
      newNetTotal += parseFloat(item.amount || 0);
    });
    
    setFieldValue('netTotal', newNetTotal.toFixed(2));
    const newVatAmount = (newNetTotal * (parseFloat(values.vatRate) || 0) / 100).toFixed(2);
    setFieldValue('vatAmount', newVatAmount);
    setFieldValue('totalAmount', (newNetTotal + parseFloat(newVatAmount)).toFixed(2));
  }, [values.items, values.vatRate, setFieldValue]);
  
  /**
   * Handle item quantity change
   * 
   * @param {number} index - Item index
   * @param {Event} e - Change event
   */
  const handleQuantityChange = useCallback((index, e) => {
    const qty = parseFloat(e.target.value) || 0;
    setFieldValue(`items.${index}.quantity`, qty.toFixed(1));
    
    // Recalculate amount
    const unitPrice = parseFloat(values.items[index].unitPrice || 0);
    const newAmount = (qty * unitPrice).toFixed(2);
    setFieldValue(`items.${index}.amount`, newAmount);
    
    // Schedule recalculation of totals
    setTimeout(recalculateTotals, 0);
  }, [values.items, setFieldValue, recalculateTotals]);
  
  /**
   * Handle unit price change
   * 
   * @param {number} index - Item index
   * @param {Event} e - Change event
   */
  const handleUnitPriceChange = useCallback((index, e) => {
    const price = parseFloat(e.target.value) || 0;
    setFieldValue(`items.${index}.unitPrice`, price.toFixed(2));
    
    // Recalculate amount
    const qty = parseFloat(values.items[index].quantity || 0);
    const newAmount = (qty * price).toFixed(2);
    setFieldValue(`items.${index}.amount`, newAmount);
    
    // Schedule recalculation of totals
    setTimeout(recalculateTotals, 0);
  }, [values.items, setFieldValue, recalculateTotals]);
  
  /**
   * Handle VAT rate change
   * 
   * @param {Event} e - Change event
   */
  const handleVatRateChange = useCallback((e) => {
    const newRate = parseFloat(e.target.value) || 0;
    setFieldValue('vatRate', newRate);
    
    // Recalculate VAT amount and total
    const netTotal = parseFloat(values.netTotal || 0);
    const newVatAmount = (netTotal * newRate / 100).toFixed(2);
    setFieldValue('vatAmount', newVatAmount);
    setFieldValue('totalAmount', (netTotal + parseFloat(newVatAmount)).toFixed(2));
  }, [values.netTotal, setFieldValue]);
  
  /**
   * Update invoice number from components
   */
  const updateInvoiceNumber = useCallback(() => {
    const components = values.invoiceNumberComponents;
    if (!components) return;
    
    setFieldValue(
      'invoiceNumber', 
      `route${components.routeNumber}_${components.month}_${components.shortYear}_${components.sequenceNumber}`
    );
  }, [values.invoiceNumberComponents, setFieldValue]);

  return {
    recalculateTotals,
    handleQuantityChange,
    handleUnitPriceChange,
    handleVatRateChange,
    updateInvoiceNumber
  };
};

export default useInvoiceCalculations;