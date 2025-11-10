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
// Twilio-based sending is intentionally not used here; we deep-link to WhatsApp instead
import { getDrivers } from '@services/drivers';
import TemplateModal from '@components/messaging/TemplateModal';
import TemplateSelector from '@components/messaging/TemplateSelector';
import RecipientSelector from '@components/messaging/RecipientSelector';
import { Dialog } from '@headlessui/react';
import WhatsAppService from '@services/whatsapp';

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
  const [useCustomMessage, setUseCustomMessage] = useState(false);
  const [showManualUrls, setShowManualUrls] = useState(false);
  const [manualUrls, setManualUrls] = useState([]);
  const [filters, setFilters] = useState({
    status: 'ACTIVE',
    limit: 1000, // Fetch all drivers for selector
  });

  const { data: drivers,
    isLoading: driversLoading,
    error: driversError } = useQuery({
      queryKey: ['drivers', filters],
      queryFn: () => getDrivers(filters),
    });


  // Fetch templates
  // Templates from DB
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['whatsAppTemplates'],
    queryFn: () => WhatsAppService.getTemplates(),
    select: (response) => response.data.data,
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

  // Helper: open WhatsApp for each recipient using web/app deep link
  const cleanPhone = (p) => (p || '').replace(/\D/g, '');
  const openWhatsAppForRecipients = async (list, text) => {
    const encoded = encodeURIComponent(text || '');
    const cleanedList = list
      .map(cleanPhone)
      .filter(Boolean);
    if (cleanedList.length === 0) {
      setStatusMessage({ type: 'error', text: 'No valid phone numbers to send to.' });
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }
    
    // If many recipients, confirm before opening many tabs
    if (cleanedList.length > 5) {
      const proceed = window.confirm(`This will open ${cleanedList.length} WhatsApp tabs. Continue?`);
      if (!proceed) return;
    }
    
    // Store URLs for manual opening
    const urls = cleanedList.map(num => ({
      phone: num,
      url: `https://wa.me/${num}?text=${encoded}`
    }));
    setManualUrls(urls);
    
    // For multiple recipients, show manual links popup directly
    if (cleanedList.length > 1) {
      setStatusMessage({ 
        type: 'info', 
        text: `Opening manual links for ${cleanedList.length} recipients.` 
      });
      setShowManualUrls(true);
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      // For single recipient, open directly
      const url = `https://wa.me/${cleanedList[0]}?text=${encoded}`;
      window.open(url, '_blank');
      setStatusMessage({ 
        type: 'success', 
        text: `Opened WhatsApp for ${cleanedList[0]}` 
      });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Handle recipient selection
  const handleRecipientsChange = (selected) => {
    setRecipients(selected);
  };

  // Handle template selection from interactive templates
  const handleTemplateSelect = (message) => {
    setSelectedTemplate({ content: message });
    setUseCustomMessage(false);
  };

  // Handle staff selection from template
  const handleStaffSelect = (staff) => {
    // Auto-fill recipients with selected staff's phone number
    if (staff.phoneNumber) {
      setRecipients([staff.phoneNumber]);
    }
  };

  // Handle custom message mode
  const handleCustomMessage = () => {
    setUseCustomMessage(true);
    setSelectedTemplate(null);
  };

  // Clear template selection
  const clearSelectedTemplate = () => {
    setSelectedTemplate(null);
    setUseCustomMessage(false);
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
              <li>When you send, we open WhatsApp Web/app with your message and recipients</li>
            </ul>
          </div>
        )}


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

            openWhatsAppForRecipients(recipients, values.message);
            resetForm();
            setSelectedTemplate(null);
            setSubmitting(false);
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
                {/* Interactive Templates Panel */}
                <div className="md:col-span-1">
                  <TemplateSelector
                    onTemplateSelect={handleTemplateSelect}
                    onCustomMessage={handleCustomMessage}
                    onStaffSelect={handleStaffSelect}
                    showCustom={true}
                  />
                </div>

                {/* Message Input */}
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message {useCustomMessage && '(Custom Message)'}
                    </label>
                    <div className="relative">
                      <Field
                        as="textarea"
                        id="message"
                        name="message"
                        rows="8"
                        placeholder={useCustomMessage ? "Type your custom message here..." : "Select a template or type your message here..."}
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
                      disabled={recipients.length === 0}
                      className={`flex items-center px-4 py-2 rounded-md ${recipients.length === 0
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

      {/* Manual URLs Modal */}
      <Dialog
        open={showManualUrls}
        onClose={() => setShowManualUrls(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              WhatsApp Links for {manualUrls.length} Recipients
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click "Open WhatsApp" to send the message or "Copy Link" to share the link:
              </p>
            </div>

            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
{manualUrls.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.phone}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          WhatsApp message ready
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(item.url)}
                      className="px-3 py-2 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Copy Link
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(item.url, '_blank')}
                      className="px-3 py-2 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      Open WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => setShowManualUrls(false)}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default WhatsAppMessaging;