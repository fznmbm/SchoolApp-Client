import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listOddJobs, deleteOddJob } from '@services/oddJobs';
import { Button } from '@components/common/Button';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Popup from '@components/common/modal/Popup';
import { Table } from '@components/common/table/Table';

// Error Alert Component
const ErrorAlert = ({ message }) => (
  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-200">
    <div className="flex">
      <ExclamationCircleIcon
        className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-200"
        aria-hidden="true"
      />
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800 dark:text-red-300 transition-colors duration-200">
          {message || "An error occurred while fetching odd jobs"}
        </p>
      </div>
    </div>
  </div>
);

const OddJobTitleCell = ({ row, navigate }) => (
  <button
    onClick={() => navigate(`/odd-jobs/${row._id}`)}
    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
    aria-label={`View details for ${row.title}`}
  >
    <div className="font-medium">{row.title}</div>
    <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      {row.passenger?.name}
    </div>
  </button>
);

const StatusCell = ({ status }) => {
  const statusConfig = {
    'BOOKED': { 
      label: 'Booked', 
      class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
    },
    'IN_PROGRESS': { 
      label: 'In Progress', 
      class: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
    },
    'COMPLETED': { 
      label: 'Completed', 
      class: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300' 
    },
    'CANCELLED': { 
      label: 'Cancelled', 
      class: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
    }
  };

  const config = statusConfig[status] || { label: status, class: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${config.class}`}>
      {config.label}
    </span>
  );
};

const ActionsCell = ({ row, navigate, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/odd-jobs/${row._id}`)}
        className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        title="View odd job"
        aria-label={`View ${row.title}`}
      >
        <EyeIcon className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/odd-jobs/${row._id}/edit`)}
        className="text-text-secondary dark:text-text-dark-secondary hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
        title="Edit odd job"
        aria-label={`Edit ${row.title}`}
      >
        <PencilIcon className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(row)}
        className="text-text-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
        title="Delete odd job"
        aria-label={`Delete ${row.title}`}
      >
        <TrashIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

const OddJobList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    bookingSource: "",
  });

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ['odd-jobs', searchParams],
    queryFn: () => listOddJobs(searchParams),
  });

  const {
    mutate: deleteJobHandler,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: (id) => deleteOddJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['odd-jobs']);
      setIsDeletePopupOpen(false);
      setSelectedJob(null);
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setSearchParams(newFilters);
  }, []);

  const handleDelete = useCallback((job) => {
    setSelectedJob(job);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedJob) {
      deleteJobHandler(selectedJob._id);
    }
  }, [selectedJob, deleteJobHandler]);

  const navigateToCreate = useCallback(() => {
    navigate("/odd-jobs/create");
  }, [navigate]);

  const paginationProps = useMemo(() => ({
    currentPage: Number(rawData?.currentPage) || searchParams.page,
    totalPages: rawData?.totalPages || 1,
    onPageChange: handlePageChange,
  }), [searchParams.page, rawData?.totalPages, rawData?.currentPage, handlePageChange]);

  const items = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
    if (rawData.items && Array.isArray(rawData.items)) return rawData.items;
    return [];
  }, [rawData]);

  const columns = useMemo(() => [
    {
      header: "Title",
      accessor: "title",
      cell: (row) => <OddJobTitleCell row={row} navigate={navigate} />
    },
    {
      header: "Passenger",
      accessor: "passenger",
      cell: (row) => `${row.passenger?.name || ''} (${row.passenger?.phone || ''})`
    },
    {
      header: "Source",
      accessor: "bookingSource",
      cell: (row) => row.corporateAccount ? `${row.bookingSource} - ${row.corporateAccount?.companyName}` : row.bookingSource
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <StatusCell status={row.status} />
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <ActionsCell
          row={row}
          navigate={navigate}
          onDelete={handleDelete}
        />
      )
    }
  ], [navigate, handleDelete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200"
    >
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Odd Jobs
          </h1>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
            Manage one-off and recurring external bookings
          </p>
        </div>
        <Button
          onClick={navigateToCreate}
          className="flex items-center transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Odd Job
        </Button>
      </div>

      {error && <ErrorAlert message={error?.message} />}
      {isDeleteError && <ErrorAlert message={deleteError?.message} />}

      <div className="bg-surface dark:bg-surface-dark rounded-lg shadow overflow-hidden border border-border-light dark:border-border-dark transition-colors duration-200">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              value={searchParams.search}
              onChange={(e) => handleFilterChange({ ...searchParams, search: e.target.value, page: 1 })}
              placeholder="Search title or passenger"
              className="px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
            />
            <select
              value={searchParams.status}
              onChange={(e) => handleFilterChange({ ...searchParams, status: e.target.value, page: 1 })}
              className="px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
            >
              <option value="">All Statuses</option>
              <option value="BOOKED">Booked</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={searchParams.bookingSource}
              onChange={(e) => handleFilterChange({ ...searchParams, bookingSource: e.target.value, page: 1 })}
              className="px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
            >
              <option value="">All Sources</option>
              <option value="EXTERNAL">External</option>
              <option value="CORPORATE">Corporate</option>
            </select>
            <Button
              variant="outline"
              onClick={() => handleFilterChange({ ...searchParams, search: "", status: "", bookingSource: "", page: 1 })}
              className="ml-auto"
              title="Reset filters"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={items}
          isLoading={isLoading}
          pagination={paginationProps}
        />

        {/* Show info message if no data */}
        {items.length === 0 && !isLoading && (
          <div className="p-4 text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-t border-yellow-200 dark:border-yellow-900/50">
            <div className="mb-2">No odd jobs found. Try changing your filter or refreshing the page.</div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${selectedJob?.title || 'this odd job'}? This action cannot be undone.`}
        title="Delete Odd Job"
        confirmButtonText="Delete Odd Job"
        confirmButtonVariant="danger"
      />
    </motion.div>
  );
};

export default OddJobList;


