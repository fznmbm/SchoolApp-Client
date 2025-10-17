import React from 'react';
import Input from '@components/common/input/Input';

const CompanyDetailsSection = ({ values, handleChange, setFieldValue }) => {
  const handleVatRateChange = (e) => {
    const newRate = parseFloat(e.target.value) || 0;
    setFieldValue('vatRate', newRate);
    
    const netTotal = parseFloat(values.netTotal);
    const newVatAmount = (netTotal * newRate / 100).toFixed(2);
    setFieldValue('vatAmount', newVatAmount);
    setFieldValue('totalAmount', (netTotal + parseFloat(newVatAmount)).toFixed(2));
  };

  return (
    <div className="transition-colors duration-200">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Company Details</h3>
      
      <Input
        label="Company Name"
        name="supplierName"
        value={values.supplierName}
        onChange={handleChange}
        className="mb-3"
      />
      
      <Input
        label="Company Address"
        name="supplierAddress"
        value={values.supplierAddress}
        onChange={handleChange}
        className="mb-3"
      />
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Input
          label="Phone"
          name="supplierPhone"
          value={values.supplierPhone}
          onChange={handleChange}
        />
        
        <Input
          label="Email"
          name="supplierEmail"
          value={values.supplierEmail}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="VAT Registration"
          name="vatRegistrationNumber"
          value={values.vatRegistrationNumber}
          onChange={handleChange}
        />
        
        <Input
          label="VAT Rate (%)"
          name="vatRate"
          type="number"
          value={values.vatRate}
          onChange={handleVatRateChange}
          aria-label="VAT Rate percentage"
        />
      </div>
    </div>
  );
};

export default CompanyDetailsSection;