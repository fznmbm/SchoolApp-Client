import React, { useState, useContext, useCallback } from "react";
import { getDriverInvoice } from "@/services/drivers";
import { renderDriverInvoice } from "@/services/driverInvoiceGenerator";
import { Button } from "@/components/common/Button";
import {
  XMarkIcon,
  ArrowPathIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/outline";
import { ThemeContext } from "@/context/ThemeContext";
import InvoiceConfirmationModal from "@components/forms/driver-invoice-form/InvoiceConfirmationModal";

const InvoiceGenerator = ({ driverId, isOpen, onClose }) => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { isDarkMode } = useContext(ThemeContext);

  const handleDateChange = useCallback((e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleFetchData = useCallback(async (e) => {
    e.preventDefault();
    const { startDate, endDate } = dateRange;
    
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getDriverInvoice(driverId, {
        startDate,
        endDate
      });

      setInvoiceData(data);
      setShowConfirmation(true);
    } catch (err) {
      console.error('Error fetching invoice data:', err);
      setError('Failed to fetch invoice data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, driverId]);
  
  const handleGenerateInvoice = useCallback((confirmedData) => {
    try {
      setIsLoading(true);
      
      renderDriverInvoice(confirmedData);
      
      setShowConfirmation(false);
      setInvoiceData(null);
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError('Failed to generate invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
    setInvoiceData(null);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mt-6 transition-colors duration-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-200">
            <ReceiptPercentIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
            Generate Driver Invoice
          </h3>
          <Button
            variant="link"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>

        <div className="px-4 py-5 transition-colors duration-200">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-4 transition-colors duration-200" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleFetchData} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
                  required
                  aria-label="Start date for invoice period"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
                  required
                  aria-label="End date for invoice period"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="md"
                onClick={onClose}
                className="mr-2"
                aria-label="Cancel invoice generation"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isLoading}
                aria-label="Fetch invoice data"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'Fetch Invoice Data'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            <p>Select a date range to generate an invoice for this driver.</p>
            <p>You'll have a chance to review and modify the invoice details before final generation.</p>
          </div>
        </div>
      </div>
      
      {/* Invoice Confirmation Modal */}
      {showConfirmation && (
        <InvoiceConfirmationModal
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          invoiceData={invoiceData}
          onConfirm={handleGenerateInvoice}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default InvoiceGenerator;