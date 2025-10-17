import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAdmin, getAllAdmins } from '@services/admin';
import AdminTable from '@components/tables/AdminTable';
import { Button } from '@components/common/Button';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import Popup from '@components/common/modal/Popup';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const AdminList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admins', searchParams],
    queryFn: () => getAllAdmins(searchParams),
  });

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const queryClient = useQueryClient();
  const { mutate: deleteAdminHandler, isError: isDeleteError, error: deleteError } = useMutation({
    mutationFn: (id) => deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admins']);
      setIsDeletePopupOpen(false);
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleDelete = useCallback((admin) => {
    setAdminToDelete(admin);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (adminToDelete) {
      deleteAdminHandler(adminToDelete._id);
    }
  }, [adminToDelete, deleteAdminHandler]);

  const closeDeletePopup = useCallback(() => {
    setIsDeletePopupOpen(false);
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-6 transition-colors duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary dark:text-white transition-colors duration-200">
            Administrators
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
            Manage system administrators and their access
          </p>
        </div>
        <Button
          onClick={() => navigate('/admins/create')}
          className="flex items-center justify-center"
          aria-label="Add new administrator"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Administrator
        </Button>
      </div>

      {isDeleteError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-6 transition-colors duration-200"
          role="alert"
        >
          <div className="flex">
            <ExclamationCircleIcon 
              className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-200" 
              aria-hidden="true" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-200">
                {deleteError?.message || 'An error occurred while deleting the administrator'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <AdminTable
        data={data}
        isLoading={isLoading}
        pagination={{
          currentPage: searchParams.page,
          totalPages: data?.totalPages || 1,
          onPageChange: handlePageChange,
        }}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Popup */}
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={closeDeletePopup}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this administrator? This action cannot be undone."
        title="Delete Administrator"
      />
    </motion.div>
  );
};

export default AdminList;