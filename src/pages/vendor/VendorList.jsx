import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteVendor, getAllVendors } from '@services/vendor';
import VendorTable from '@components/tables/VendorTable';
import { Button } from '@components/common/Button';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import Popup from '@components/common/modal/Popup';

const VendorList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    status: 'Active',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['vendors', searchParams],
    queryFn: () => getAllVendors(searchParams),
  });

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  const queryClient = useQueryClient();
  const { 
    mutate: deleteVendorHandler, 
    isError: isDeleteError, 
    error: deleteError 
  } = useMutation({
    mutationFn: (id) => deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
      setIsDeletePopupOpen(false);
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleDelete = useCallback((vendor) => {
    setVendorToDelete(vendor);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (vendorToDelete) {
      deleteVendorHandler(vendorToDelete._id);
    }
  }, [deleteVendorHandler, vendorToDelete]);

  const handleAddVendor = useCallback(() => {
    navigate('/vendors/create');
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Vendors
          </h1>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
            Manage vendors and their information
          </p>
        </div>
        <Button
          onClick={handleAddVendor}
          className="flex items-center"
          aria-label="Add new vendor"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Vendor
        </Button>
      </div>

      {isDeleteError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-200">
          <div className="flex">
            <ExclamationCircleIcon 
              className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-200" 
              aria-hidden="true" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 transition-colors duration-200">
                {deleteError?.message || 'An error occurred while deleting the vendor'}
              </p>
            </div>
          </div>
        </div>
      )}

      <VendorTable
        data={data?.data}
        isLoading={isLoading}
        pagination={{
          currentPage: Number(data?.currentPage) || searchParams.page,
          totalPages: data?.totalPages || 1,
          onPageChange: handlePageChange,
        }}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Popup */}
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this vendor? This action cannot be undone."
        title="Delete Vendor"
      />
    </motion.div>
  );
};

export default VendorList;