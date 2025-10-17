import React from 'react';

const InvoiceTotalsSection = ({ values }) => {
  return (
    <div className="transition-colors duration-200">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Totals</h3>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <div className="flex justify-between mb-2 text-gray-800 dark:text-gray-200">
          <span className="font-medium">Net Total:</span>
          <span>£{values.netTotal}</span>
        </div>
        
        <div className="flex justify-between mb-2 text-gray-800 dark:text-gray-200">
          <span className="font-medium">VAT ({values.vatRate}%):</span>
          <span>£{values.vatAmount}</span>
        </div>
        
        <div className="flex justify-between font-bold text-gray-900 dark:text-white">
          <span>Total:</span>
          <span>£{values.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotalsSection;