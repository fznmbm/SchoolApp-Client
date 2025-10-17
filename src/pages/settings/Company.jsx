import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getCompany, updateCompany, createCompany } from '@services/company';
import Input from '@components/common/input/Input';
import Select from '@components/common/input/Select';
import Button from '@components/common/Button';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { companySchema } from '@/utils/validations/schemas/company.schema';

const CompanyPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    vendorNumber: '',
    tax: 20,
    vatRegistrationNumber: '',
    paymentMethod: 'both',
    accountNumber: '',
    sortCode: ''
  });

  // Payment method options for Select component
  const paymentMethodOptions = [
    { id: 'BACS', name: 'BACS' },
    { id: 'bank', name: 'bank' },
  ];

  // Load company data on component mount
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        const data = await getCompany();
        // Populate form with existing data
        if (data) {
          setInitialValues(data);
        }
      } catch (err) {
        // It's okay if company data doesn't exist yet
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to load company information');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  // Scroll to the bottom when there's an error
  useEffect(() => {
    if (error) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [error]);

  const handleSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
    try {
      setError(null);
      setSaveSuccess(false);
      
      // If we're updating or creating new company info
      if (values._id) {
        await updateCompany(values);
      } else {
        await createCompany(values);
      }
      
      setSaveSuccess(true);
      // Reset success message after 5 seconds
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving company information');
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Company Information
          </h1>
          <p className="mt-2 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
            Manage your company details for billing and official documents.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md transition-colors duration-200">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 transition-colors duration-200" />
            <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{error}</p>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={companySchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, resetForm }) => (
          <Form className="mt-6 space-y-6">
            <div className="bg-surface dark:bg-surface-dark shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl md:col-span-2 border border-border-light dark:border-border-dark-mode transition-colors duration-200">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Company Name */}
                  <div className="sm:col-span-3">
                    <Input
                      label="Company Name"
                      name="name"
                      id="name"
                      type="text"
                      placeholder="Enter company name"
                      aria-label="Company name"
                    />
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-3">
                    <Input
                      label="Email"
                      name="email"
                      id="email"
                      type="email"
                      placeholder="company@example.com"
                      aria-label="Company email"
                    />
                  </div>

                  {/* Address */}
                  <div className="col-span-full">
                    <Input
                      label="Address"
                      name="address"
                      id="address"
                      multiline={true}
                      rows={3}
                      placeholder="Enter company address"
                      aria-label="Company address"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="sm:col-span-3">
                    <Input
                      label="Phone Number"
                      name="phoneNumber"
                      id="phoneNumber"
                      type="text"
                      placeholder="Enter phone number"
                      aria-label="Company phone number"
                    />
                  </div>

                  {/* Vendor Number */}
                  <div className="sm:col-span-3">
                    <Input
                      label="Vendor Number"
                      name="vendorNumber"
                      id="vendorNumber"
                      type="text"
                      placeholder="Enter vendor number"
                      aria-label="Vendor number"
                    />
                  </div>

                  {/* VAT Registration Number */}
                  <div className="sm:col-span-3">
                    <Input
                      label="VAT Registration Number"
                      name="vatRegistrationNumber"
                      id="vatRegistrationNumber"
                      type="text"
                      placeholder="Enter VAT registration number"
                      aria-label="VAT registration number"
                    />
                  </div>

                  {/* Tax Rate */}
                  <div className="sm:col-span-3">
                    <Input
                      label="Tax Rate (%)"
                      name="tax"
                      id="tax"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter tax rate"
                      aria-label="Tax rate percentage"
                    />
                  </div>
                  
                  {/* Payment Method */}
                  <div className="sm:col-span-3">
                    <Select
                      label="Payment Method"
                      name="paymentMethod"
                      id="paymentMethod"
                      options={paymentMethodOptions}
                      placeholder="Select payment method"
                      aria-label="Payment method"
                    />
                  </div>

                  {/* Account Number */}
                  <div className="sm:col-span-3">
                    <Input
                      label="Account Number"
                      name="accountNumber"
                      id="accountNumber"
                      type="text"
                      placeholder="Enter account number"
                      aria-label="Account number"
                    />
                  </div>

                  {/* Sort Code */}
                  <div className="sm:col-span-3">
                    <Input
                      label="Sort Code"
                      name="sortCode"
                      id="sortCode"
                      type="text"
                      placeholder="Enter sort code"
                      aria-label="Sort code"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-x-6 border-t border-border-light dark:border-border-dark-mode px-4 py-4 sm:px-8 transition-colors duration-200">
                {saveSuccess && (
                  <div className="flex-grow">
                    <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400 transition-colors duration-200">
                      <CheckCircleIcon className="h-5 w-5 mr-1.5 flex-shrink-0" />
                      Company information saved successfully!
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={() => resetForm()}
                  variant="outline"
                  size="md"
                  aria-label="Reset form to original values"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  variant={saveSuccess ? 'success' : 'primary'}
                  size="md"
                  aria-busy={isSubmitting}
                  aria-disabled={isSubmitting || loading}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CompanyPage;