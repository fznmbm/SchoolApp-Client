import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/common/Button';
import StatusCell from './StatusCell';
import HistoryDetailsCell from './HistoryDetailsCell';
import QuickLabelPopup from './QuickLabelPopup';
import { useInvoiceDownload } from '@/hooks/useInvoiceDownload';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const InvoiceDetailsView = ({
  invoice,
  isLoading,
  onClose,
  onApprove,
  onReject,
  isProcessing,
  onEdit,
  onOpenLabelManager,
  refetchInvoiceDetail
}) => {
  const { isDownloading, handleDownloadInvoice } = useInvoiceDownload();
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-light mx-auto"></div>
        <p className="mt-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <p className="text-error dark:text-error-light transition-colors duration-200">Could not load invoice details.</p>
      </div>
    );
  }

  const isDriverType = invoice.userType === 'DRIVER';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2 transition-colors duration-200">
            {isDriverType ? 'Driver Information' : 'Personal Assistant Information'}
          </h4>
          <div className="bg-surface-secondary dark:bg-surface-dark-secondary p-4 rounded-lg transition-colors duration-200">
            <p className="text-text-primary dark:text-text-dark-primary font-medium transition-colors duration-200">{invoice.name}</p>
            <p className="text-text-secondary dark:text-text-dark-secondary mt-1 transition-colors duration-200">
              {isDriverType ? `Driver #: ${invoice.driverNumber}` : `PA #: ${invoice.paNumber}`}
            </p>
            <p className="text-text-secondary dark:text-text-dark-secondary mt-1 transition-colors duration-200">Phone: {invoice.mobile}</p>
            <p className="text-text-secondary dark:text-text-dark-secondary mt-1 transition-colors duration-200">Email: {invoice.email}</p>
            <p className="text-text-secondary dark:text-text-dark-secondary mt-1 transition-colors duration-200">Address: {invoice.address}</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2 transition-colors duration-200">Invoice Summary</h4>
          <div className="bg-surface-secondary dark:bg-surface-dark-secondary p-4 rounded-lg transition-colors duration-200">
            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">Status:</span>
              <span><StatusCell status={invoice.status} /></span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">Period:</span>
              <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formatDate(invoice.periodFrom)} - {formatDate(invoice.periodTo)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">Submitted:</span>
              <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">{formatDate(invoice.submittedAt)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">Signature Date:</span>
              <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">{formatDate(invoice.signatureDate)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">Total:</span>
              <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">£{(Number(invoice.totalPay) || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Labels Section */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2 transition-colors duration-200">Labels</h4>
        <div className="bg-surface-secondary dark:bg-surface-dark-secondary p-4 rounded-lg transition-colors duration-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {invoice.labels && invoice.labels.length > 0 ? (
              invoice.labels.map(label => {
                // Handle both populated label objects and label IDs
                const labelData = typeof label === 'string' ? { _id: label, name: 'Loading...', color: '#3B82F6' } : label;
                return (
                  <span
                    key={labelData._id}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: labelData.color, color: '#fff' }}
                  >
                    {labelData.name}
                  </span>
                );
              })
            ) : (
              <span className="text-gray-500 dark:text-gray-400">No labels assigned</span>
            )}
          </div>
          <QuickLabelPopup
            invoiceId={invoice._id}
            currentLabelIds={invoice.labels?.map(l => l._id) || []}
            onLabelChange={refetchInvoiceDetail}
          />
        </div>
      </div>

      {/* Weekly Routes Section */}
      {invoice.weeks && invoice.weeks.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2 transition-colors duration-200">Weekly Routes</h4>
          <div className="bg-surface-secondary dark:bg-surface-dark-secondary rounded-lg overflow-hidden border border-border-light dark:border-border-dark transition-colors duration-200">
            {invoice.weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="border-b border-border-light dark:border-border-dark last:border-b-0 transition-colors duration-200">
                <div className="p-4 bg-surface-tertiary dark:bg-surface-dark-tertiary transition-colors duration-200">
                  <h5 className="font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">Week {week.weekNumber}</h5>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border-light dark:divide-border-dark transition-colors duration-200">
                    <thead className="bg-surface-secondary dark:bg-surface-dark-secondary transition-colors duration-200">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                          Day
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                          Routes
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                          Fare
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark transition-colors duration-200">
                      {week.days && week.days.map((day, dayIndex) => {
                        // Filter routes to only include those with a fare
                        const validRoutes = day.routes?.filter(route => route.name && (Number(route.fare) > 0)) || [];

                        // If no valid routes for this day, still show the day but with empty route/fare
                        if (validRoutes.length === 0) {
                          return (
                            <tr key={`day-${weekIndex}-${dayIndex}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                                {day.day}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                                {formatDate(day.date)}
                              </td>
                              <td className="px-6 py-4 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                                -
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                                £0.00
                              </td>
                            </tr>
                          );
                        }

                        // Otherwise, create a row for each valid route on this day
                        return validRoutes.map((route, routeIndex) => (
                          <tr key={`route-${weekIndex}-${dayIndex}-${routeIndex}`}>
                            {/* Only show day & date in the first row for this day */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                              {routeIndex === 0 ? day.day : ''}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                              {routeIndex === 0 ? formatDate(day.date) : ''}
                            </td>
                            <td className="px-6 py-4 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                              {route.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                              £{(Number(route.fare) || 0).toFixed(2)}
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extra Jobs Section */}
      {invoice.extraJobs && invoice.extraJobs.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2 transition-colors duration-200">Extra Jobs</h4>
          <div className="bg-surface-secondary dark:bg-surface-dark-secondary rounded-lg overflow-hidden border border-border-light dark:border-border-dark transition-colors duration-200">
            <table className="min-w-full divide-y divide-border-light dark:divide-border-dark transition-colors duration-200">
              <thead className="bg-surface-secondary dark:bg-surface-dark-secondary transition-colors duration-200">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                    Fare
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark transition-colors duration-200">
                {invoice.extraJobs.map((job, index) => (
                  <tr key={`extra-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                      {formatDate(job.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                      {job.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                      £{(Number(job.fare) || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-surface-secondary dark:bg-surface-dark-secondary transition-colors duration-200">
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-sm font-medium text-right text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Extra Jobs Total:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    £{invoice.extraJobs.reduce((sum, job) => sum + (Number(job.fare) || 0), 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Invoice History Section */}
      {invoice.history && invoice.history.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2 transition-colors duration-200">Invoice History</h4>
          <div className="bg-surface-secondary dark:bg-surface-dark-secondary rounded-lg overflow-hidden border border-border-light dark:border-border-dark transition-colors duration-200">
            <table className="min-w-full divide-y divide-border-light dark:divide-border-dark transition-colors duration-200">
              <thead className="bg-surface-secondary dark:bg-surface-dark-secondary transition-colors duration-200">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark transition-colors duration-200">
                {invoice.history.map((historyItem, index) => (
                  <tr key={`history-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                      {historyItem.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                      {formatDate(historyItem.performedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                      <HistoryDetailsCell details={historyItem.details} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDownloadInvoice(invoice)}
          disabled={isDownloading}
          className="flex items-center"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          {isDownloading ? 'Opening...' : 'View Invoice'}
        </Button>
        {invoice.status === 'PENDING' && (
          <>
            <Button
              variant="primary"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant="success"
              onClick={onApprove}
              disabled={isProcessing}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              onClick={onReject}
              disabled={isProcessing}
            >
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailsView;