import React, { useContext } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Formik, Form } from 'formik';
import { format } from 'date-fns';

import { ThemeContext } from '@context/ThemeContext';
import InvoiceNumberEditor from './InvoiceNumberEditor';
import ClientDetailsSection from './ClientDetailsSection';
import CompanyDetailsSection from './CompanyDetailsSection';
import InvoiceItemsTable from './InvoiceItemsTable';
import PaymentDetailsSection from './PaymentDetailsSection';
import InvoiceTotalsSection from './InvoiceTotalsSection';
import { Button } from '@components/common/Button';
import Input from '@components/common/input/Input';

const InvoiceConfirmationModal = ({ 
  isOpen, 
  onClose, 
  initialInvoiceData, 
  onConfirm 
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  if (!isOpen || !initialInvoiceData) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="relative z-50"
      aria-labelledby="invoice-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 dark:bg-gray-900/50 transition-opacity duration-200" aria-hidden="true" />
      
      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-200">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title 
              id="invoice-modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-gray-100"
            >
              Confirm Invoice Details
            </Dialog.Title>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
              aria-label="Close dialog"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <Formik
            initialValues={initialInvoiceData}
            onSubmit={(values) => {
              onConfirm(values);
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-200">
                {/* Invoice Number Editor */}
                {values.invoiceNumberComponents && (
                  <InvoiceNumberEditor 
                    values={values} 
                    handleChange={handleChange} 
                    setFieldValue={setFieldValue} 
                  />
                )}
                
                {/* Invoice Date */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Invoice Date</h3>
                  <Input
                    label="Invoice Date"
                    name="invoiceDate"
                    type="date"
                    value={values.invoiceDate || format(new Date(), 'yyyy-MM-dd')}
                    onChange={handleChange}
                    className="max-w-xs"
                    aria-label="Invoice date"
                  />
                </div>
                
                {/* Client and Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <ClientDetailsSection 
                    values={values} 
                    handleChange={handleChange} 
                  />
                  
                  <CompanyDetailsSection 
                    values={values} 
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </div>
                
                {/* Invoice Items */}
                <InvoiceItemsTable 
                  values={values}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
                
                {/* Payment Details and Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <PaymentDetailsSection 
                    values={values} 
                    handleChange={handleChange} 
                  />
                  
                  <InvoiceTotalsSection values={values} />
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    aria-label="Cancel invoice confirmation"
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    type="submit" 
                    variant="primary"
                    aria-label="Generate invoice"
                  >
                    Generate Invoice
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default InvoiceConfirmationModal;