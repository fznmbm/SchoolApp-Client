import React, { useState, useEffect } from 'react';
import { DocumentTextIcon, PlusIcon, UserIcon, TruckIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDrivers } from '@services/drivers';
import { getAllPAs } from '@services/pa';
import WhatsAppService from '@services/whatsapp';
import TemplateModal from './TemplateModal';

const defaultTemplates = [
  {
    id: 'shift_reminder',
    name: 'Shift Reminder',
    template: (data) =>
      `Hi ${data.staffName},\n\nThis is a reminder about your upcoming shift:\n📅 Date: ${data.date}\n⏰ Time: ${data.time}\n📍 Location: ${data.location}\n\nPlease confirm your availability.\n\nThank you!`,
    fields: [
      { name: 'staffName', label: 'Staff Name', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true }
    ]
  },
  {
    id: 'schedule_change',
    name: 'Schedule Change',
    template: (data) =>
      `Hi ${data.staffName},\n\nYour schedule has been updated:\n📅 New Date: ${data.date}\n⏰ New Time: ${data.time}\n📍 Location: ${data.location}\n\nPlease acknowledge this change.\n\nThanks!`,
    fields: [
      { name: 'staffName', label: 'Staff Name', type: 'text', required: true },
      { name: 'date', label: 'New Date', type: 'date', required: true },
      { name: 'time', label: 'New Time', type: 'time', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true }
    ]
  },
  {
    id: 'general_announcement',
    name: 'General Announcement',
    template: (data) =>
      `Hi ${data.staffName},\n\n${data.customMessage}\n\nBest regards,\nManagement`,
    fields: [
      { name: 'staffName', label: 'Staff Name', type: 'text', required: true },
      { name: 'customMessage', label: 'Your Message', type: 'textarea', required: true }
    ]
  }
];

const TemplateSelector = ({ onTemplateSelect, onCustomMessage, onStaffSelect, showCustom = true }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [showCustomTemplateModal, setShowCustomTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch drivers and PAs
  const { data: drivers } = useQuery({
    queryKey: ['drivers', { status: 'ACTIVE' }],
    queryFn: () => getDrivers({ status: 'ACTIVE', limit: 1000 }), // Fetch all drivers for selector
  });

  const { data: pas } = useQuery({
    queryKey: ['pas'],
    queryFn: () => getAllPAs({ limit: 1000 }), // Fetch all PAs for selector
  });

  // Fetch custom templates from DB
  const { data: customTemplates, isLoading: customTemplatesLoading } = useQuery({
    queryKey: ['whatsAppTemplates'],
    queryFn: () => WhatsAppService.getTemplates(),
    select: (response) => response.data.data,
  });

  // Combine drivers and PAs into staff list
  useEffect(() => {
    const combinedStaff = [];
    
    const driversList = Array.isArray(drivers) ? drivers : (drivers?.data || []);
    if (driversList && driversList.length > 0) {
      driversList.forEach(driver => {
        if (driver.name && driver.phoneNumber) {
          combinedStaff.push({
            id: driver._id,
            name: driver.name,
            phoneNumber: driver.phoneNumber,
            type: 'Driver',
            typeIcon: TruckIcon
          });
        }
      });
    }
    
    const pasList = Array.isArray(pas) ? pas : (pas?.data || []);
    if (pasList && pasList.length > 0) {
      pasList.forEach(pa => {
        if (pa.name && pa.contact?.phone) {
          combinedStaff.push({
            id: pa._id,
            name: pa.name,
            phoneNumber: pa.contact.phone,
            type: 'PA',
            typeIcon: UserIcon
          });
        }
      });
    }
    
    setStaffList(combinedStaff);
  }, [drivers, pas]);

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (id) => WhatsAppService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsAppTemplates'] });
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      alert(`Failed to delete template: ${error.response?.data?.message || error.message}`);
    }
  });

  // Handle custom template selection (non-interactive)
  const handleCustomTemplateSelect = (template) => {
    onTemplateSelect(template.content);
  };

  // Handle edit custom template
  const handleEditTemplate = (e, template) => {
    e.stopPropagation();
    setEditingTemplate(template);
    setShowCustomTemplateModal(true);
  };

  // Handle delete custom template
  const handleDeleteClick = (e, template) => {
    e.stopPropagation();
    setDeletingTemplate(template);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deletingTemplate) {
      deleteTemplateMutation.mutate(deletingTemplate._id);
      setShowDeleteConfirm(false);
      setDeletingTemplate(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingTemplate(null);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If staff name is selected, auto-fill phone and notify parent
    if (name === 'staffName' && value) {
      const selectedStaff = staffList.find(staff => staff.name === value);
      if (selectedStaff) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          phoneNumber: selectedStaff.phoneNumber
        }));
        
        // Notify parent component about staff selection
        if (onStaffSelect) {
          onStaffSelect(selectedStaff);
        }
      }
    }
  };

  const generateMessage = () => {
    if (!selectedTemplate) return;
    
    const message = selectedTemplate.template(formData);
    setGeneratedMessage(message);
    onTemplateSelect(message);
  };

  const handleCustomMessage = () => {
    onCustomMessage();
  };

  // Close interactive template form
  const closeInteractiveTemplate = () => {
    setSelectedTemplate(null);
    setFormData({});
    setGeneratedMessage('');
  };

  const isFormValid = () => {
    if (!selectedTemplate) return false;
    return selectedTemplate.fields.every(field => 
      !field.required || (formData[field.name] && formData[field.name].trim())
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Message Templates
        </h3>
        {showCustom && (
          <button
            type="button"
            onClick={handleCustomMessage}
            className="p-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
            title="Write custom message"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Interactive Default Templates */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Interactive Templates</h4>
          {defaultTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-3 rounded border cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  {template.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Templates from DB */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Templates</h4>
            <button
              type="button"
              onClick={() => {
                setEditingTemplate(null);
                setShowCustomTemplateModal(true);
              }}
              className="p-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
              title="Create custom template"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          {customTemplatesLoading ? (
            <div className="py-2 text-center text-gray-500 dark:text-gray-400 text-sm">
              Loading custom templates...
            </div>
          ) : customTemplates && customTemplates.length > 0 ? (
            <div className="space-y-2">
              {customTemplates.map((template) => (
                <div
                  key={template._id}
                  onClick={() => handleCustomTemplateSelect(template)}
                  className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition duration-150 group"
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
                        <PencilIcon className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, template)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete template"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {template.content.substring(0, 40)}
                    {template.content.length > 40 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="mb-1">No custom templates yet.</p>
              <button
                type="button"
                onClick={() => {
                  setEditingTemplate(null);
                  setShowCustomTemplateModal(true);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Create your first custom template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Template Form */}
      {selectedTemplate && (
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              Fill in the details for {selectedTemplate.name}
            </h4>
            <button
              type="button"
              onClick={closeInteractiveTemplate}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Close template form"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {selectedTemplate.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.name === 'staffName' ? (
                  <div className="space-y-2">
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select staff member...</option>
                      {staffList.map((staff) => {
                        const IconComponent = staff.typeIcon;
                        return (
                          <option key={staff.id} value={staff.name}>
                            {staff.name} ({staff.type}) - {staff.phoneNumber}
                          </option>
                        );
                      })}
                    </select>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Or type a custom name below:
                    </div>
                    <input
                      type="text"
                      name={`${field.name}_custom`}
                      value={formData[`${field.name}_custom`] || ''}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          [name]: value,
                          staffName: value // Also update the main field
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Or type custom name..."
                    />
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={generateMessage}
            disabled={!isFormValid()}
            className={`mt-4 w-full px-4 py-2 rounded-md text-sm font-medium ${
              isFormValid()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Generate Message
          </button>
        </div>
      )}

      {/* Generated Message Preview */}
      {generatedMessage && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded border">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Generated Message:
          </h5>
          <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
            {generatedMessage}
          </pre>
        </div>
      )}

      {/* Custom Template Modal */}
      {showCustomTemplateModal && (
        <TemplateModal
          isOpen={showCustomTemplateModal}
          onClose={() => {
            setShowCustomTemplateModal(false);
            setEditingTemplate(null);
          }}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ['whatsAppTemplates'] });
          }}
          template={editingTemplate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Delete Template
            </h3>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
