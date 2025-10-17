import React, { useContext, useMemo } from 'react';
import { ThemeContext } from '@context/ThemeContext';
import { FieldArray } from 'formik';
import Input from '@components/common/input/Input';
import Select from '@components/common/input/Select';

const InvoiceNumberEditor = ({ values, handleChange, setFieldValue }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const monthOptions = useMemo(() => 
    window.invoiceSequenceGenerator ? 
      window.invoiceSequenceGenerator.getMonthOptions().map(month => ({ id: month, name: month })) : 
      [],
    []
  );
  
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      options.push({ id: year.toString(), name: year.toString() });
    }
    return options;
  }, []);

  const updateInvoiceNumber = () => {
    const components = values.invoiceNumberComponents;
    setFieldValue(
      'invoiceNumber', 
      `${components.sequenceNumber}_invoice_${components.routeNumber}_${components.month}${components.shortYear}_crown`
    );
  };

  const handleSequenceNumberChange = (e) => {
    const sequenceNumber = e.target.value;
    setFieldValue('invoiceNumberComponents.sequenceNumber', sequenceNumber);
    
    // Update the invoice number immediately
    setTimeout(updateInvoiceNumber, 0);
  };

  return (
    <div className="mb-6 p-4 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-200">
      <h3 className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-300">Invoice Number</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Sequence Number */}
        <div>
          <Input
            label="Sequence Number"
            name="invoiceNumberComponents.sequenceNumber"
            value={values.invoiceNumberComponents.sequenceNumber}
            onChange={handleSequenceNumberChange}
            onBlur={() => {
              // Ensure sequence number is padded to 2 digits
              const seqNum = values.invoiceNumberComponents.sequenceNumber;
              const paddedSeqNum = String(parseInt(seqNum) || 0).padStart(2, '0');
              
              setFieldValue('invoiceNumberComponents.sequenceNumber', paddedSeqNum);
              updateInvoiceNumber();
            }}
          />
        </div>
        
        {/* Route Number */}
        <div>
          <Input
            label="Route Number"
            name="invoiceNumberComponents.routeNumber"
            value={values.invoiceNumberComponents.routeNumber}
            onChange={handleChange}
            onBlur={updateInvoiceNumber}
          />
        </div>
        
        {/* Month */}
        <div>
          <Select
            label="Month"
            name="invoiceNumberComponents.month"
            options={monthOptions}
            value={values.invoiceNumberComponents.month}
            onChange={(option) => {
              setFieldValue('invoiceNumberComponents.month', option?.id || '');
              setTimeout(updateInvoiceNumber, 0);
            }}
          />
        </div>
        
        {/* Year (2-digit) */}
        <div>
          <Input
            label="Year (2-digit)"
            name="invoiceNumberComponents.shortYear"
            value={values.invoiceNumberComponents.shortYear}
            onChange={(e) => {
              const shortYear = e.target.value;
              setFieldValue('invoiceNumberComponents.shortYear', shortYear);
              
              if (shortYear.length === 2) {
                const fullYear = parseInt('20' + shortYear);
                setFieldValue('invoiceNumberComponents.fullYear', fullYear);
              }
              
              setTimeout(updateInvoiceNumber, 0);
            }}
            maxLength={2}
          />
        </div>
      </div>
      
      <div className="mt-3">
        <Input
          label="Full Invoice Number"
          name="invoiceNumber"
          value={values.invoiceNumber}
          readOnly
          className="font-medium text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 transition-colors duration-200"
        />
      </div>
    </div>
  );
};

export default InvoiceNumberEditor;