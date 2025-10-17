import { useState, useCallback } from 'react';
import { prepareInvoiceData, renderInvoiceInNewWindow } from '@services/invoiceGenerator';

export const useInvoiceGeneration = (flattenedJobs, jobsByDate, filteredDates, startDate, endDate, routeOptions) => {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [isPreparingInvoice, setIsPreparingInvoice] = useState(false);

    // Handle the initial invoice generation request
    const handlePrepareInvoice = useCallback(async () => {
        setIsPreparingInvoice(true);

        try {
            const preparedInvoiceData = await prepareInvoiceData({
                jobs: flattenedJobs,
                filteredDates,
                jobsByDate,
                startDate,
                endDate,
                routeOptions
            });

            setInvoiceData(preparedInvoiceData);
            setIsInvoiceModalOpen(true);
        } catch (error) {
            console.error('Error preparing invoice data:', error);
            // Show an error notification (you could use a toast component here)
            alert('Failed to prepare invoice data. Please try again.');
        } finally {
            setIsPreparingInvoice(false);
        }
    }, [flattenedJobs, filteredDates, jobsByDate, startDate, endDate, routeOptions]);

    // Handle the invoice modal close action
    const handleCloseInvoiceModal = useCallback(() => {
        // Cancel the temporary invoice number when the modal is closed without finalizing
        if (window.invoiceSequenceGenerator) {
            window.invoiceSequenceGenerator.cancelTemporaryInvoiceNumber();
        }
        setIsInvoiceModalOpen(false);
    }, []);

    // Handle the final invoice generation after confirmation
    const handleFinalizeInvoice = useCallback((finalInvoiceData) => {
        // Close the modal
        setIsInvoiceModalOpen(false);

        // Render the invoice with the confirmed data
        renderInvoiceInNewWindow(finalInvoiceData);
    }, []);

    return {
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        invoiceData,
        setInvoiceData,
        isPreparingInvoice,
        setIsPreparingInvoice,
        handlePrepareInvoice,
        handleCloseInvoiceModal,
        handleFinalizeInvoice
    };
};