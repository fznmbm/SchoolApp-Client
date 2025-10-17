import React from 'react';
import { FieldArray } from 'formik';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Input from '@components/common/input/Input';

const ClientDetailsSection = ({ values, handleChange }) => {
  return (
    <div className="transition-colors duration-200">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Client Details</h3>
      
      <Input
        label="Client Name"
        name="clientName"
        value={values.clientName}
        onChange={handleChange}
        className="mb-3"
      />
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Client Address
        </label>
        <FieldArray name="clientAddress">
          {({ remove, push }) => (
            <div>
              {values.clientAddress.map((line, index) => (
                <div key={index} className="flex mb-2">
                  <Input
                    name={`clientAddress.${index}`}
                    value={line}
                    onChange={handleChange}
                    className="flex-grow"
                    aria-label={`Address line ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                    aria-label={`Remove address line ${index + 1}`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => push('')}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors duration-200"
                aria-label="Add new address line"
              >
                + Add address line
              </button>
            </div>
          )}
        </FieldArray>
      </div>
      
      <Input
        label="Driver PO Number"
        name="driverPoNumber"
        value={values.driverPoNumber}
        onChange={handleChange}
        className="mb-3"
      />
      <Input
        label="PA PO Number"
        name="paPoNumber"
        value={values.paPoNumber}
        onChange={handleChange}
        className="mb-3"
      />
      
      <Input
        label="Vendor Number"
        name="vendorNumber"
        value={values.vendorNumber}
        onChange={handleChange}
      />
    </div>
  );
};

export default ClientDetailsSection;