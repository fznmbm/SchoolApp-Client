import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/common/Button';

const StatusUpdateDialog = ({ isOpen, onClose, onSubmit, title, actionType, actionColor }) => {
  if (!isOpen) return null;
  
  const validationSchema = Yup.object({
    reason: Yup.string()
      .required('Reason is required')
      .min(5, 'Reason must be at least 5 characters')
      .max(500, 'Reason must be less than 500 characters')
  });
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="p-6 border-b border-border-light dark:border-border-dark transition-colors duration-200">
          <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            {title}
          </h3>
        </div>
        
        <Formik
          initialValues={{ reason: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values.reason);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="p-6">
                <div className="mb-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1 transition-colors duration-200">
                    Reason
                  </label>
                  <Field
                    as="textarea"
                    id="reason"
                    name="reason"
                    rows="4"
                    className={`w-full rounded-md border ${errors.reason && touched.reason ? 'border-red-500' : 'border-border-light dark:border-border-dark'} bg-surface dark:bg-surface-dark px-3 py-2 text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200`}
                    placeholder={`Enter reason for ${actionType.toLowerCase()}...`}
                  />
                  <ErrorMessage name="reason" component="div" className="mt-1 text-sm text-red-500" />
                </div>
              </div>
              
              <div className="px-6 py-4 flex justify-end space-x-4 border-t border-border-light dark:border-border-dark transition-colors duration-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={actionColor}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : actionType}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StatusUpdateDialog;