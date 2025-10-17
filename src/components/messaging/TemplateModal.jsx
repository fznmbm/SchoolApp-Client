import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import WhatsAppService from '@services/whatsapp';
import Input from '@components/common/input/Input';

const validationSchema = Yup.object({
  name: Yup.string().required('Template name is required'),
  content: Yup.string().required('Template content is required')
});

const TemplateModal = ({ isOpen, onClose, onSave, template = null }) => {
  const isEditMode = !!template;
  
  const initialValues = {
    name: template?.name || '',
    content: template?.content || ''
  };
  
  const saveTemplateMutation = useMutation({
    mutationFn: (values) => {
      if (isEditMode) {
        return WhatsAppService.updateTemplate(template._id, values);
      }
      return WhatsAppService.saveTemplate(values);
    },
    onSuccess: () => {
      if (onSave) onSave();
      onClose();
    },
    onError: (error) => {
      console.error('Error saving template:', error);
      alert(`Failed to save template: ${error.response?.data?.message || error.message}`);
    }
  });
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <Dialog.Title
              className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {isEditMode ? 'Edit Template' : 'Create New Template'}
            </Dialog.Title>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-4">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                saveTemplateMutation.mutate(values, {
                  onSettled: () => setSubmitting(false)
                });
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {/* Template Name */}
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    label="Template Name"
                    placeholder="Enter template name"
                    required
                    disabled={isEditMode} 
                  />

                  {/* Template Content */}
                  <Input
                    multiline
                    name="content"
                    id="content"
                    label="Template Content"
                    rows="6"
                    placeholder="Enter template content..."
                    required
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      className="mr-2 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || saveTemplateMutation.isPending}
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isSubmitting || saveTemplateMutation.isPending
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSubmitting || saveTemplateMutation.isPending ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TemplateModal;