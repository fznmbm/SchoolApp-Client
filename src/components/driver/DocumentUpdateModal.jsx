import React, { useState, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '@components/common/input/Input';
import DatePicker from '@components/common/input/DatePicker';
import FileUpload from '@components/common/input/FileUpload';
import { Button } from '@components/common/Button';

const validationSchema = Yup.object().shape({
  number: Yup.string().required('Document number is required'),
  issuedDate: Yup.date().required('Issue date is required'),
  expiryDate: Yup.date()
    .min(Yup.ref('issuedDate'), 'Expiry date must be after issue date')
    .required('Expiry date is required'),
  document: Yup.mixed().required('Document file is required')
});

const DocumentUpdateModal = ({ 
  isOpen, 
  onClose, 
  documentType, 
  documentData, 
  onSubmit,
  isVehicleDocument = false 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (values) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, onClose]);

  const getDocumentTypeLabel = useCallback((type) => {
    if (isVehicleDocument) {
      switch (type) {
        case 'LICENSE': return 'Vehicle License';
        case 'INSURANCE': return 'Insurance';
        case 'INSPECTION': return 'Vehicle Inspection';
        case 'MOT': return 'MOT Certificate';
        default: return type;
      }
    } else {
      switch (type) {
        case 'DBS': return 'DBS Certificate';
        case 'LICENSE': return 'Driver License';
        case 'TAXI_LICENSE': return 'Taxi License';
        case 'MEDICAL_CERTIFICATE': return 'Medical Certificate';
        default: return type;
      }
    }
  }, [isVehicleDocument]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">

        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              Update {getDocumentTypeLabel(documentType)}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <Formik
            initialValues={{
              number: documentData?.number || '',
              issuedDate: documentData?.issuedDate ? new Date(documentData.issuedDate).toISOString().split('T')[0] : '',
              expiryDate: documentData?.expiryDate ? new Date(documentData.expiryDate).toISOString().split('T')[0] : '',
              document: null
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Document Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={values.number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.number && touched.number && (
                    <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issuedDate"
                    value={values.issuedDate || ''}
                    onChange={(e) => {
                      setFieldValue('issuedDate', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.issuedDate && touched.issuedDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.issuedDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={values.expiryDate || ''}
                    onChange={(e) => {
                      setFieldValue('expiryDate', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.expiryDate && touched.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Document File
                  </label>
                  <input
                    type="file"
                    name="document"
                    onChange={(event) => {
                      setFieldValue("document", event.currentTarget.files[0]);
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.document && touched.document && (
                    <p className="text-red-500 text-sm mt-1">{errors.document}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Document'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Dialog>
  );
};

export default DocumentUpdateModal;