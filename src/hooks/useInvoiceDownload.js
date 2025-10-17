import { useState, useCallback } from 'react';
import { renderReceivedDriverInvoice } from '@services/invoiceDownload';

export const useInvoiceDownload = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    // Handle the invoice view/download
    const handleDownloadInvoice = useCallback(async (invoiceData) => {
        setIsDownloading(true);

        try {
            console.log('Opening invoice in new tab:', invoiceData);
            // Render the invoice in a new window for viewing and printing
            renderReceivedDriverInvoice(invoiceData);
        } catch (error) {
            console.error('Error opening invoice:', error);
            // Show an error notification (you could use a toast component here)
            alert('Failed to open invoice. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    }, []);

    return {
        isDownloading,
        handleDownloadInvoice
    };
};
