import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import { getDrivers } from '@services/drivers';
import { getAllPAs } from '@services/pa';
import { getDriverInvoices, getPAInvoices, getInvoice, updateInvoiceStatus } from '@/services/user-invoice';
import { getLabels } from '@/services/labels';
import { EyeIcon, TagIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Select from '@/components/common/input/Select';
import { Table } from '@/components/common/table/Table';
import { Button } from '@/components/common/Button';
import StatusCell from '@components/driver-invoice-history/StatusCell';
import PeriodCell from '@components/driver-invoice-history/PeriodCell';
import StatusUpdateDialog from '@components/driver-invoice-history/StatusUpdateDialog';
import Notification from '@components/driver-invoice-history/Notification';
import InvoiceDetailsView from '@components/driver-invoice-history/InvoiceDetailsView';
import AdminInvoiceEditModal from '@components/driver-invoice-history/AdminInvoiceEditModal';
import LabelManager from '@components/driver-invoice-history/LabelManager';
import QuickLabelPopup from '@components/driver-invoice-history/QuickLabelPopup';
import LabelFilterModal from '@components/driver-invoice-history/LabelFilterModal';
import { updateInvoice, markInvoiceAsRead } from '@/services/user-invoice';
import { format } from 'date-fns';
import { useInvoiceDownload } from '@/hooks/useInvoiceDownload';

// Actions Cell Component
const ActionsCell = ({ row, onView, onDownload }) => (
  <div className="px-2 flex items-center space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onView(row._id)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      title="View details"
      aria-label={`View invoice details`}
    >
      <EyeIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDownload(row)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
      title="View invoice in new tab"
      aria-label={`View invoice in new tab`}
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
    </Button>
  </div>
);

// Page component for viewing driver invoices
const InvoiceList = () => {
  const [userType, setUserType] = useState('DRIVER');
  const [selectedUser, setSelectedUser] = useState('');
  const [page, setPage] = useState(1);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLabelManagerOpen, setIsLabelManagerOpen] = useState(false);
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);
  const [isGroupedByLabel, setIsGroupedByLabel] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLabelFilters, setShowLabelFilters] = useState(false);

  // Initialize download hook
  const { isDownloading, handleDownloadInvoice } = useInvoiceDownload();

  // Fetch all drivers
  const {
    data: usersResponse = { data: [] },
    isLoading: usersLoading,
    error: usersError
  } = useQuery({
    queryKey: ['users', userType],
    queryFn: () => userType === 'DRIVER'
      ? getDrivers({ limit: 100 })
      : getAllPAs({ limit: 100 }),
  });

  const usersData = userType === 'DRIVER'
    ? (Array.isArray(usersResponse) ? usersResponse : [])
    : (usersResponse?.data || []);

  // Fetch all labels for filtering
  const {
    data: labelsData = [],
    isLoading: labelsLoading,
    error: labelsError
  } = useQuery({
    queryKey: ['labels'],
    queryFn: getLabels,
  });


  // Format users for Select component
  const userOptions = usersData.map(user => ({
    id: userType === 'DRIVER' ? user.driverNumber : user.paNumber,
    name: `${user.name} (${userType === 'DRIVER' ? user.driverNumber : user.paNumber})`,
  }));
  // Fetch invoices for selected user - support both driver and PA
  const {
    data: invoicesData,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices
  } = useQuery({
    queryKey: ['invoices', userType, selectedUser, page],
    queryFn: () => {
      if (!selectedUser) return null;

      return userType === 'DRIVER'
        ? getDriverInvoices(selectedUser, { page, limit: 10 })
        : getPAInvoices(selectedUser, { page, limit: 10 });
    },
    enabled: !!selectedUser,
  });

  // Fetch detailed invoice when viewing
  const {
    data: invoiceDetail,
    isLoading: invoiceDetailLoading,
    refetch: refetchInvoiceDetail
  } = useQuery({
    queryKey: ['invoice', viewInvoice],
    queryFn: () => {
      return viewInvoice ? getInvoice(viewInvoice) : null;
    },
    enabled: !!viewInvoice,
  });

  // Mutation for updating invoice status
  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, status, reason }) => updateInvoiceStatus(id, { status, reason }),
    onSuccess: (data) => {
      setNotification({
        message: `Invoice ${data.data.status.toLowerCase()} successfully`,
        type: 'success'
      });

      setIsApproveDialogOpen(false);
      setIsRejectDialogOpen(false);

      refetchInvoiceDetail();
      refetchInvoices();
    },
    onError: (error) => {
      setNotification({
        message: `Error: ${error.message || 'Failed to update invoice status'}`,
        type: 'error'
      });
    }
  });

  const updateInvoiceDataMutation = useMutation({
    mutationFn: ({ id, data }) => updateInvoice(id, data),
    onSuccess: () => {
      setNotification({ message: 'Invoice updated successfully', type: 'success' });
      setIsEditModalOpen(false);
      refetchInvoiceDetail();
    },
    onError: (error) => setNotification({ message: error.message || 'Error updating invoice', type: 'error' })
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setSelectedUser(''); // Reset selection when changing type
    setPage(1);
  };

  const handleUserChange = (selectedOption) => {
    const userNumber = selectedOption?.id || '';
    setSelectedUser(userNumber);
    setPage(1);
  };

  // View invoice details
  const handleViewInvoice = async (invoiceId) => {
    setViewInvoice(invoiceId);
    
    // Mark invoice as read when viewed
    try {
      await markInvoiceAsRead(invoiceId);
    } catch (error) {
      console.error('Error marking invoice as read:', error);
      // Don't show error to user, just log it
    }
  };

  // Close invoice detail view
  const handleCloseInvoiceView = () => {
    setViewInvoice(null);
  };

  // Open approve dialog
  const handleOpenApproveDialog = () => {
    setIsApproveDialogOpen(true);
  };

  // Open reject dialog
  const handleOpenRejectDialog = () => {
    setIsRejectDialogOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleSaveEdits = (updatedData) => {
    if(viewInvoice){
      updateInvoiceDataMutation.mutate({ id: viewInvoice, data: updatedData });
    }
  };

  // Handle approve submission
  const handleApproveInvoice = (reason) => {
    if (viewInvoice) {
      updateInvoiceMutation.mutate({
        id: viewInvoice,
        status: 'APPROVED',
        reason
      });
    }
  };

  // Handle reject submission
  const handleRejectInvoice = (reason) => {
    if (viewInvoice) {
      updateInvoiceMutation.mutate({
        id: viewInvoice,
        status: 'REJECTED',
        reason
      });
    }
  };

  // Dismiss notification
  const handleDismissNotification = () => {
    setNotification(null);
  };

  // Filter and group invoices by labels
  const processedInvoices = useMemo(() => {
    if (!invoicesData?.data) return [];
    
    let filtered = [...invoicesData.data];
    
    // Apply label filters if any are selected
    if (selectedLabelIds.length > 0) {
      filtered = filtered.filter(invoice => 
        invoice.labels?.some(label => selectedLabelIds.includes(label._id))
      );
    }
    
    // Group by labels if enabled
    if (isGroupedByLabel) {
      const groups = {};
      filtered.forEach(invoice => {
        if (!invoice.labels?.length) {
          groups['Unlabeled'] = groups['Unlabeled'] || [];
          groups['Unlabeled'].push(invoice);
        } else {
          invoice.labels.forEach(label => {
            groups[label.name] = groups[label.name] || [];
            groups[label.name].push(invoice);
          });
        }
      });
      return groups;
    }
    
    return filtered;
  }, [invoicesData?.data, selectedLabelIds, isGroupedByLabel]);

  // Table columns configuration
  const columns = [
    {
      header: "Period",
      accessor: "period",
      cell: (row) => <PeriodCell periodFrom={row.periodFrom} periodTo={row.periodTo} />
    },
    {
      header: "Submitted Date",
      accessor: "submittedAt",
      cell: (row) => (
        <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          {formatDate(row.submittedAt)}
        </span>
      )
    },
    {
      header: "Total",
      accessor: "totalPay",
      cell: (row) => (
        <span className="font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          £{(Number(row.totalPay) || 0).toFixed(2)}
        </span>
      )
    },
    {
      header: "Labels",
      accessor: "labels",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.labels && row.labels.length > 0 ? (
            row.labels.map(label => (
              <span
                key={label._id}
                className="px-2 py-1 text-xs rounded-full text-white"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">No labels</span>
          )}
        </div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <StatusCell status={row.status} />
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => <ActionsCell row={row} onView={handleViewInvoice} onDownload={handleDownloadInvoice} />
    }
  ];

  // Configure pagination
  const pagination = invoicesData ? {
    currentPage: parseInt(page),
    totalPages: invoicesData.totalPages || 1,
    onPageChange: (newPage) => setPage(newPage)
  } : null;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
              {userType === 'DRIVER' ? 'Driver' : 'Personal Assistant'} Invoices
            </h1>
            <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
              View and manage invoices submitted by {userType === 'DRIVER' ? 'drivers' : 'personal assistants'}
            </p>
          </div>
          
          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsLabelManagerOpen(true)}
              className="flex items-center"
            >
              <TagIcon className="h-5 w-5 mr-2" />
              Manage Labels
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowLabelFilters(!showLabelFilters)}
              className="flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* User Type Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => handleUserTypeChange('DRIVER')}
            className={`px-4 py-2 rounded-md ${userType === 'DRIVER'
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              } transition-colors duration-200`}
          >
            Drivers
          </button>
          <button
            onClick={() => handleUserTypeChange('PA')}
            className={`px-4 py-2 rounded-md ${userType === 'PA'
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              } transition-colors duration-200`}
          >
            Personal Assistants
          </button>
        </div>

        <Formik
          initialValues={{ userNumber: '' }}
          onSubmit={() => { }}
        >
          {() => (
            <Form>
              <Select
                name="userNumber"
                label={`Select ${userType === 'DRIVER' ? 'Driver' : 'Personal Assistant'}`}
                options={userOptions}
                placeholder={`-- Select a ${userType === 'DRIVER' ? 'driver' : 'personal assistant'} --`}
                disabled={usersLoading}
                onChange={handleUserChange}
              />
              {selectedUser && (
                <div className="flex justify-end mt-4 mb-4">
                  <div className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light border border-primary/20 dark:border-primary/30 shadow-sm">
                    <span className="mr-1">{userType === 'DRIVER' ? 'Driver:' : 'PA:'}</span>
                    <span>{userOptions.find(option => option.id === selectedUser)?.name || selectedUser}</span>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
        {usersError && (
          <p className="mt-2 text-sm text-error dark:text-error-light">
            Error loading {userType === 'DRIVER' ? 'drivers' : 'personal assistants'}: {usersError.message}
          </p>
        )}
      </div>

      {/* Active Filters Display */}
      {selectedUser && selectedLabelIds.length > 0 && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Filtered by:
          </span>
          <div className="flex flex-wrap gap-1">
            {selectedLabelIds.map(labelId => {
              const label = labelsData.find(l => l._id === labelId);
              return label ? (
                <span
                  key={labelId}
                  className="px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ) : null;
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLabelIds([])}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Label Filter Modal */}
      <LabelFilterModal
        isOpen={showLabelFilters}
        onClose={() => setShowLabelFilters(false)}
        labels={labelsData}
        selectedLabelIds={selectedLabelIds}
        onLabelToggle={(labelId) => {
          setSelectedLabelIds(prev => 
            prev.includes(labelId)
              ? prev.filter(id => id !== labelId)
              : [...prev, labelId]
          );
        }}
        onClearAll={() => setSelectedLabelIds([])}
        isLoading={labelsLoading}
        error={labelsError?.message}
      />

      {/* Invoice Listing */}
      {selectedUser && (
        <div className="space-y-4">

          {/* Invoice List */}
          <div className="bg-surface dark:bg-surface-dark rounded-lg shadow overflow-hidden border border-border-light dark:border-border-dark transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                Invoices
              </h2>
              {invoicesData && invoicesData.data && (
                <span className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Showing {
                    isGroupedByLabel 
                      ? Object.values(processedInvoices).reduce((sum, group) => sum + group.length, 0)
                      : processedInvoices.length
                  } of {invoicesData.count || 0} invoices
                </span>
              )}
            </div>

            {isGroupedByLabel ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(processedInvoices).map(([groupName, invoices]) => (
                  <div key={groupName}>
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {groupName} ({invoices.length})
                      </h3>
                    </div>
                    <Table
                      columns={columns}
                      data={invoices}
                      isLoading={invoicesLoading}
                      error={invoicesError ? invoicesError.message : null}
                      emptyMessage={`No invoices in this group.`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Table
                columns={columns}
                data={processedInvoices}
                isLoading={invoicesLoading}
                pagination={pagination}
                error={invoicesError ? invoicesError.message : null}
                emptyMessage={`No invoices found for this ${userType === 'DRIVER' ? 'driver' : 'personal assistant'}.`}
              />
            )}
          </div>
        </div>
      )}

      {/* Label Manager Modal */}
      <LabelManager
        isOpen={isLabelManagerOpen}
        onClose={() => setIsLabelManagerOpen(false)}
      />

      {/* Invoice Detail Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
            <div className="p-6 border-b border-border-light dark:border-border-dark sticky top-0 bg-surface dark:bg-surface-dark z-10 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  Invoice Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseInvoiceView}
                  className="text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary transition-colors duration-200"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>

            <InvoiceDetailsView
              invoice={invoiceDetail}
              isLoading={invoiceDetailLoading}
              onClose={handleCloseInvoiceView}
              onApprove={handleOpenApproveDialog}
              onReject={handleOpenRejectDialog}
              onEdit={handleOpenEditModal}
              onOpenLabelManager={() => setIsLabelManagerOpen(true)}
              isProcessing={updateInvoiceMutation.isPending}
              refetchInvoiceDetail={refetchInvoiceDetail}
            />
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {isEditModalOpen && invoiceDetail && (
        <AdminInvoiceEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          invoice={invoiceDetail}
          onSave={handleSaveEdits}
          isSaving={updateInvoiceDataMutation.isPending}
        />
      )}

      {/* Status Update Dialogs */}
      <StatusUpdateDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onSubmit={handleApproveInvoice}
        title="Approve Invoice"
        actionType="Approve"
        actionColor="success"
      />

      <StatusUpdateDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onSubmit={handleRejectInvoice}
        title="Reject Invoice"
        actionType="Reject"
        actionColor="danger"
      />

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={handleDismissNotification}
        />
      )}
    </div>
  );
};

export default InvoiceList;