import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDrivers, deleteDriverById } from '@services/drivers';
import DriverTable from '@components/tables/DriverTable';
import { Button } from '@components/common/Button';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import Popup from '@components/common/modal/Popup';
import Select from '@components/common/input/Select';
import { Formik, Form } from 'formik';

const STATUS_OPTIONS = [
  { id: 'ALL', name: 'All Statuses' },
  { id: 'ACTIVE', name: 'Active' },
  { id: 'INACTIVE', name: 'Inactive' },
  { id: 'ON_LEAVE', name: 'On Leave' }
];

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
          {message || "An error occurred while fetching drivers"}
        </p>
      </div>
    </div>
  </div>
);

// Page Header Component
const PageHeader = ({ onAddClick }) => (
  <div className="flex justify-between mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        Drivers
      </h1>
      <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Manage your drivers and their assignments
      </p>
    </div>
    <Button
      onClick={onAddClick}
      className="flex items-center transition-colors duration-200"
    >
      <PlusIcon className="w-5 h-5 mr-2" />
      Add Driver
    </Button>
  </div>
);

const DriverList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'ACTIVE',
    search: '',
  });

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['drivers', filters],
    queryFn: () => getDrivers(filters),
  });

  const queryClient = useQueryClient();
  const { 
    mutate: deleteDriver, 
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError 
  } = useMutation({
    mutationFn: (id) => deleteDriverById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['drivers']);
      setIsDeletePopupOpen(false);
      setDriverToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting driver:", error);
    },
  });

  const handleDelete = useCallback((driver) => {
    if (!driver || !driver._id) {
      console.error("Invalid driver for deletion:", driver);
      return;
    }
    setDriverToDelete(driver);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (driverToDelete) {
      deleteDriver(driverToDelete._id);
    }
  }, [driverToDelete, deleteDriver]);

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Handle status change
  const handleStatusChange = useCallback((value) => {
    setFilters(prev => ({
      ...prev,
      status: value === 'ALL' ? '' : value, // If ALL is selected, send empty string
      page: 1
    }));
  }, []);

  const navigateToCreate = useCallback(() => {
    navigate('/drivers/create');
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200"
    >
      <PageHeader onAddClick={navigateToCreate} />
      
      {error && <ErrorAlert message={error?.message} />}
      {isDeleteError && <ErrorAlert message={deleteError?.message} />}

      {/* Filters Section */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors duration-200">
        <h2 className="text-sm font-medium mb-3 text-text-primary dark:text-text-dark-primary transition-colors duration-200">Filters</h2>
        <Formik
          initialValues={{ status: filters.status }}
          onSubmit={() => {}}
        >
          {({ setFieldValue }) => (
            <Form className="flex items-center gap-4">
              <div className="w-48">
                <Select
                  label="Status"
                  name="status"
                  options={STATUS_OPTIONS}
                  placeholder="Select Status"
                  onChange={async (option) => {
                    await setFieldValue('status', option.id);
                    handleStatusChange(option.id);
                  }}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <DriverTable
        data={data?.data}
        isLoading={isLoading}
        filters={filters}
        onFilterChange={setFilters}
        pagination={{
          currentPage: Number(data?.currentPage) || filters.page,
          totalPages: data?.totalPages || 1,
          onPageChange: handlePageChange,
        }}
        onDelete={handleDelete}
      />
      
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to deactivate this driver? This action cannot be undone."
        title="Deactivate Driver"
        confirmText={isDeleting ? "Deactivating..." : "Deactivate"}
        confirmButtonProps={{
          disabled: isDeleting,
          className: "bg-red-600 hover:bg-red-700 transition-colors duration-200"
        }}
      />
    </motion.div>
  );
};

export default DriverList;