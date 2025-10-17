import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  PaperAirplaneIcon,
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
  TruckIcon,
  QuestionMarkCircleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import WhatsAppService from '@services/whatsapp';
import { getDrivers } from '@services/drivers';
import TemplateModal from '@components/messaging/TemplateModal';
import RecipientSelector from '@components/messaging/RecipientSelector';
import { Dialog } from '@headlessui/react';

const validationSchema = Yup.object({
  message: Yup.string().required('Message is required')
});

const WhatsAppMessaging = () => {
  const queryClient = useQueryClient();
  const [recipients, setRecipients] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [driversCount, setDriversCount] = useState(0);
  const [filters, setFilters] = useState({
    status: 'ACTIVE',
  });

  const { data: drivers,
    isLoading: driversLoading,
    error: driversError } = useQuery({
      queryKey: ['drivers', filters],
      queryFn: () => getDrivers(filters),
    });

  useEffect(() => {
    if (drivers && Array.isArray(drivers)) {
      setDriversCount(drivers.length)
    }
  }, [drivers])

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['whatsAppTemplates'],
    queryFn: () => WhatsAppService.getTemplates(),
    select: (response) => response.data.data,
    onError: (error) => {
      console.error('Error fetching templates:', error);
    }
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (id) => WhatsAppService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsAppTemplates'] });
      setStatusMessage({
        type: 'success',
        text: 'Template deleted successfully'
      });
      setTimeout(() => setStatusMessage(null), 5000);
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      setStatusMessage({
        type: 'error',
        text: `Failed to delete template: ${error.response?.data?.message || error.message}`
      });
      setTimeout(() => setStatusMessage(null), 5000);
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (values) => {
      return recipients.length === 1
        ? WhatsAppService.sendMessage(recipients[0], values.message)
        : WhatsAppService.sendBulkMessages(recipients, values.message);
    },
    onSuccess: (response) => {
      if (recipients.length === 1) {
        setStatusMessage({
          type: 'success',
          text: `Message sent successfully to ${recipients[0]}`
        });
      } else {
        const { summary } = response.data;
        setStatusMessage({
          type: 'success',
          text: `Messages sent: ${summary.successful} successful, ${summary.failed} failed out of ${summary.total}`
        });
      }
      setTimeout(() => setStatusMessage(null), 5000);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      setStatusMessage({
        type: 'error',
        text: `Failed to send message: ${error.response?.data?.message || error.message}`
      });

      setTimeout(() => setStatusMessage(null), 5000);
    }
  });

  // Handle recipient selection
  const handleRecipientsChange = (selected) => {
    setRecipients(selected);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  // Clear template selection
  const clearSelectedTemplate = () => {
    setSelectedTemplate(null);
  };

  // Open template modal for editing
  const handleEditTemplate = (e, template) => {
    e.stopPropagation();
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (e, template) => {
    e.stopPropagation(); 
    setDeletingTemplate(template);
    setShowDeleteConfirm(true);
  };

  // Confirm and execute template deletion
  const confirmDelete = () => {
    if (deletingTemplate) {
      deleteTemplateMutation.mutate(deletingTemplate._id);
      setShowDeleteConfirm(false);
      setDeletingTemplate(null);
    }
  };

  // Close delete confirmation
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingTemplate(null);
  };

  // Handle closing the template modal
  const handleTemplateModalClose = () => {
    setShowTemplateModal(false);
    setEditingTemplate(null);
  };

  // Filter all active drivers
  const handleFilterAllDrivers = async () => {
    try {
      const response = await getDrivers({
        status: 'ACTIVE'
      });

      if (response && Array.isArray(response)) {
        // Filter for drivers with phone numbers and extract them
        const driverPhoneNumbers = response
          .filter(driver => driver.phoneNumber)
          .map(driver => driver.phoneNumber);

        setRecipients(driverPhoneNumbers);
      }
    } catch (error) {
      console.error('Error fetching all drivers:', error);
      setStatusMessage({
        type: 'error',
        text: 'Failed to fetch all drivers'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            WhatsApp Messaging
          </h1>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
          >
            <QuestionMarkCircleIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Help section */}
        {showHelp && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <h3 className="font-semibold mb-2">How to use WhatsApp Messaging</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Select recipients by searching for drivers or entering custom phone numbers</li>
              <li>Select one or multiple recipients as needed</li>
              <li>Select a saved template or compose your own message</li>
              <li>Create, edit, and delete message templates for future use</li>
              <li>Messages will be sent through WhatsApp using Twilio integration</li>
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div></div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Quick Select:</span>
            <button
              type="button"
              onClick={handleFilterAllDrivers}
              className="flex items-center px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            >
              <TruckIcon className="w-4 h-4 mr-1" />
              All Drivers
              {driversCount > 0 && (
                <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-full">
                  {driversCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Recipients Selector */}
        <div className="mb-6">
          <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recipients {recipients.length > 0 ? `(${recipients.length} selected)` : ''}
          </label>
          <RecipientSelector
            selected={recipients}
            onChange={handleRecipientsChange}
            singleRecipient={false} // Always allow multiple selection
          />
        </div>

        {/* Message Form */}
        <Formik
          initialValues={{ message: selectedTemplate ? selectedTemplate.content : '' }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (recipients.length === 0) {
              setStatusMessage({
                type: 'error',
                text: 'Please select at least one recipient'
              });
              setSubmitting(false);
              return;
            }

            sendMessageMutation.mutate(values, {
              onSuccess: () => {
                resetForm();
                setSelectedTemplate(null);
              }
            });
          }}
        >
          {({ isSubmitting, values }) => (
            <Form>
              {/* Selected Template Display */}
              {selectedTemplate && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    <div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Template: {selectedTemplate.name}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedTemplate}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Templates and Message Input */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Templates Panel */}
                <div className="md:col-span-1">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Templates
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTemplate(null);
                          setShowTemplateModal(true);
                        }}
                        className="p-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                        title="Create new template"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {templatesLoading ? (
                      <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                        <p className="mt-2">Loading templates...</p>
                      </div>
                    ) : templates && templates.length > 0 ? (
                      <div className="overflow-y-auto max-h-72">
                        {templates.map((template) => (
                          <div
                            key={template._id}
                            onClick={() => handleTemplateSelect(template)}
                            className="p-3 mb-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition duration-150 group"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                                {template.name}
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => handleEditTemplate(e, template)}
                                  className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  title="Edit template"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteClick(e, template)}
                                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  title="Delete template"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {template.content.substring(0, 60)}
                              {template.content.length > 60 ? '...' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="mb-1">No templates available.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTemplate(null);
                            setShowTemplateModal(true);
                          }}
                          className="mt-2 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Create your first template
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <Field
                        as="textarea"
                        id="message"
                        name="message"
                        rows="8"
                        placeholder="Type your message here..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <ErrorMessage
                        name="message"
                        component="div"
                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                      />
                    </div>

                    {/* Message length counter */}
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                      {values.message.length} characters
                    </div>
                  </div>

                  {/* Status Message */}
                  {statusMessage && (
                    <div
                      className={`mb-4 p-3 rounded-md ${statusMessage.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                    >
                      <div className="flex items-center">
                        {statusMessage.type === 'success' ? (
                          <CheckIcon className="w-5 h-5 mr-2" />
                        ) : (
                          <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                        )}
                        {statusMessage.text}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || recipients.length === 0}
                      className={`flex items-center px-4 py-2 rounded-md ${isSubmitting || recipients.length === 0
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                      {recipients.length > 1
                        ? `Send to ${recipients.length} Recipients`
                        : 'Send Message'}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <TemplateModal
          isOpen={showTemplateModal}
          onClose={handleTemplateModalClose}
          onSave={() => {
            // Refresh templates after saving
            queryClient.invalidateQueries({ queryKey: ['whatsAppTemplates'] });
          }}
          template={editingTemplate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={cancelDelete}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Delete Template
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete the template "{deletingTemplate?.name}"? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none"
                onClick={confirmDelete}
                disabled={deleteTemplateMutation.isPending}
              >
                {deleteTemplateMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default WhatsAppMessaging;