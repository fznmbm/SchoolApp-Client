import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '@components/common/input/Input';
import Button from '@components/common/Button';
import { validateDriverNumber, validatePANumber } from '@/services/user-invoice';
import { Card } from '@pages/InvoiceWizard';

const UserNumberSchema = Yup.object().shape({
  userType: Yup.string().required('Please select user type'),
  userNumber: Yup.string()
    .required('Number is required')
    .when('userType', {
      is: 'DRIVER',
      then: () => Yup.string()
        .matches(/^\d{4}$/, 'Driver number must be a 4-digit number')
        .required('Driver number is required'),
      otherwise: () => Yup.string()
        .matches(/^\d{4}$/, 'PA number must be a 4-digit number')
        .required('PA number is required')
    })
});

const UserNumberForm = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let response;
      
      if (values.userType === 'DRIVER') {
        response = await validateDriverNumber(values.userNumber);
      } else {
        response = await validatePANumber(values.userNumber);
      }
      
      if (response.success && response.data) {
        onSuccess({
          ...response.data,
          userType: values.userType,
          [values.userType === 'DRIVER' ? 'driverNumber' : 'paNumber']: values.userNumber
        });
      } else {
        setError(`Unable to validate ${values.userType === 'DRIVER' ? 'driver' : 'PA'} number. Please try again.`);
      }
    } catch (error) {
      console.error(`Error validating ${values.userType} number:`, error);
      setError(error.response?.data?.message || `${values.userType === 'DRIVER' ? 'Driver' : 'PA'} not found or inactive. Please check your number.`);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6 text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        User Verification
      </h2>
      
      <p className="mb-6 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Please select your user type and enter your number to proceed. This will be used to pre-fill some of your information.
      </p>
      
      {error && (
        <div className="mb-6 bg-error-light/20 dark:bg-error/20 text-error dark:text-error-light p-4 rounded-md">
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      <Formik
        initialValues={{ userType: 'DRIVER', userNumber: '' }}
        validationSchema={UserNumberSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2 transition-colors duration-200">
                Select User Type <span className="text-error">*</span>
              </label>
              
              <div className="flex space-x-6 mb-4">
                <label className="inline-flex items-center cursor-pointer">
                  <Field
                    type="radio"
                    name="userType"
                    value="DRIVER"
                    className="form-radio h-5 w-5 text-primary focus:ring-primary dark:bg-surface-dark-tertiary transition-colors duration-200"
                  />
                  <span className="ml-2 text-text-primary dark:text-text-dark-primary transition-colors duration-200">Driver</span>
                </label>
                
                <label className="inline-flex items-center cursor-pointer">
                  <Field
                    type="radio"
                    name="userType"
                    value="PA"
                    className="form-radio h-5 w-5 text-primary focus:ring-primary dark:bg-surface-dark-tertiary transition-colors duration-200"
                  />
                  <span className="ml-2 text-text-primary dark:text-text-dark-primary transition-colors duration-200">Personal Assistant (PA)</span>
                </label>
              </div>
              
              <Input
                name="userNumber"
                label={values.userType === 'DRIVER' ? 'Driver Number' : 'PA Number'}
                placeholder={`Enter your 4-digit ${values.userType === 'DRIVER' ? 'driver' : 'PA'} number`}
                required
                autoFocus
              />
              <p className="mt-2 text-sm text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Your {values.userType === 'DRIVER' ? 'driver' : 'PA'} number is the 4-digit number assigned to you when you were onboarded.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || isLoading}
                className="min-w-24"
              >
                {(isSubmitting || isLoading) ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default UserNumberForm;