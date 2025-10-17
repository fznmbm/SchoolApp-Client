import React, { useState, useEffect, useContext, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  XMarkIcon, 
  CheckIcon, 
  ArrowPathIcon,
  ReceiptPercentIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { ThemeContext } from '@/context/ThemeContext';
import { Button } from '@/components/common/Button';
import RegularAssignmentsTab from './RegularAssignmentsTab';
import TemporaryAssignmentsTab from './TemporaryAssignmentsTab';
import SpecialServicesTab from './SpecialServicesTab';
import useDriverInvoiceCalculation from '@/hooks/useDriverInvoiceCalculation';

const InvoiceConfirmationModal = ({ 
  isOpen, 
  onClose, 
  invoiceData, 
  onConfirm, 
  isLoading 
}) => {
  const [editedInvoiceData, setEditedInvoiceData] = useState(null);
  const [activeTab, setActiveTab] = useState('regular');
  const { isDarkMode } = useContext(ThemeContext);
  const { recalculateTotals } = useDriverInvoiceCalculation();

  useEffect(() => {
    if (invoiceData) {
      setEditedInvoiceData(JSON.parse(JSON.stringify(invoiceData)));
    }
  }, [invoiceData]);

  const handleTabChange = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(editedInvoiceData);
  }, [onConfirm, editedInvoiceData]);

  if (!isOpen || !editedInvoiceData) return null;

  const TabButton = ({ name, label, count }) => (
    <Button
      variant="link"
      onClick={() => handleTabChange(name)}
      className={`py-2 px-1 border-b-2 rounded-none font-medium text-sm transition-colors duration-200 ${
        activeTab === name 
          ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      aria-selected={activeTab === name}
      role="tab"
    >
      {label} (£{count.toFixed(2)})
    </Button>
  );

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 dark:bg-opacity-80 transition-colors duration-200" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full transition-colors duration-200">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 transition-colors duration-200">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 transition-colors duration-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-200">
                <ReceiptPercentIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
                Invoice Details Confirmation
              </h3>
              <Button
                variant="link"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </Button>
            </div>

            <div className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-200">
                    <UserIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">Driver:</span> 
                    <span className="ml-1">{editedInvoiceData.driver.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">Period:</span> 
                    <span className="ml-1">{editedInvoiceData.originalDateRange.startDate} to {editedInvoiceData.originalDateRange.endDate}</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg transition-colors duration-200">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Total Amount</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center transition-colors duration-200">
                    <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                    £{editedInvoiceData.totalPay.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Tab navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-4 transition-colors duration-200" role="tablist">
                <nav className="flex -mb-px space-x-8">
                  <TabButton 
                    name="regular" 
                    label="Regular Assignments" 
                    count={editedInvoiceData.regularAssignments.totalPay} 
                  />
                  <TabButton 
                    name="temporary" 
                    label="Temporary Assignments" 
                    count={editedInvoiceData.temporaryAssignments.totalPay} 
                  />
                  <TabButton 
                    name="special" 
                    label="Special Services" 
                    count={editedInvoiceData.specialServices.totalPay} 
                  />
                </nav>
              </div>

              {/* Tab content */}
              <div role="tabpanel">
                {activeTab === 'regular' && (
                  <RegularAssignmentsTab 
                    data={editedInvoiceData.regularAssignments} 
                    updateData={(updatedData) => {
                      const newData = { ...editedInvoiceData, regularAssignments: updatedData };
                      recalculateTotals(newData);
                      setEditedInvoiceData(newData);
                    }}
                  />
                )}
                
                {activeTab === 'temporary' && (
                  <TemporaryAssignmentsTab 
                    data={editedInvoiceData.temporaryAssignments} 
                    updateData={(updatedData) => {
                      const newData = { ...editedInvoiceData, temporaryAssignments: updatedData };
                      recalculateTotals(newData);
                      setEditedInvoiceData(newData);
                    }}
                  />
                )}
                
                {activeTab === 'special' && (
                  <SpecialServicesTab 
                    data={editedInvoiceData.specialServices} 
                    updateData={(updatedData) => {
                      const newData = { ...editedInvoiceData, specialServices: updatedData };
                      recalculateTotals(newData);
                      setEditedInvoiceData(newData);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse transition-colors duration-200">
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={isLoading}
              className="sm:ml-3"
              aria-label="Generate invoice"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Generate Invoice
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              className="mt-3 sm:mt-0 sm:ml-3"
              aria-label="Cancel"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceConfirmationModal;