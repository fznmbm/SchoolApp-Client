import React from 'react';
import Input from '@components/common/input/Input';

const PaymentDetailsSection = ({ values, handleChange }) => {
  return (
    <div className="transition-colors duration-200">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Payment Details</h3>
      
      <Input
        label="Payment Method"
        name="paymentMethod"
        value={values.paymentMethod}
        onChange={handleChange}
        className="mb-3"
      />
      
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Account Number"
          name="accountNumber"
          value={values.accountNumber}
          onChange={handleChange}
          aria-label="Bank account number"
        />
        
        <Input
          label="Sort Code"
          name="sortCode"
          value={values.sortCode}
          onChange={handleChange}
          aria-label="Bank sort code"
        />
      </div>
    </div>
  );
};

export default PaymentDetailsSection;