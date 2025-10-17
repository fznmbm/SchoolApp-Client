import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRouteById, getRoutes } from '@services/route';
import RouteTable from '@components/tables/RouteTable';
import { Button } from '@components/common/Button';
import { motion } from 'framer-motion';
import Popup from '@components/common/modal/Popup';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

// Header Component
const PageHeader = ({ onAddClick }) => (
  <div className="flex justify-between mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        Routes
      </h1>
      <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Manage your transportation routes and assignments
      </p>
    </div>
    <Button
      onClick={onAddClick}
      className="flex items-center transition-colors duration-200"
    >
      <PlusIcon className="w-5 h-5 mr-2" />
      Add Route
    </Button>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-200">
    <div className="flex">
      <ExclamationCircleIcon 
        className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-200" 
        aria-hidden="true" 
      />
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800 dark:text-red-300 transition-colors duration-200">
          {message}
        </p>
      </div>
    </div>
  </div>
);

const RouteList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
  });
  
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  
  // Query routes
  const { data, isLoading, error: fetchError } = useQuery({
    queryKey: ['routes', searchParams],
    queryFn: () => getRoutes(searchParams),
  });
  
  // Setup mutation for deleting routes
  const queryClient = useQueryClient();
  const { mutate: deleteRoute } = useMutation({
    mutationFn: (id) => deleteRouteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['routes', searchParams]); // Refresh the list after deletion
      setIsDeletePopupOpen(false); // Close the popup
      setRouteToDelete(null); // Clear the selected route
      setDeleteError(null); // Clear any previous errors
    },
    onError: (error) => {
      setDeleteError(error?.message || "An error occurred while deleting the route");
      console.error("Error deleting route:", error);
    },
  });
  
  // Event handlers with useCallback
  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleDelete = useCallback((route) => {
    if (!route || !route._id) {
      setDeleteError("Invalid route selected for deletion");
      return;
    }
    setRouteToDelete(route);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (routeToDelete) {
      deleteRoute(routeToDelete._id); 
    }
  }, [routeToDelete, deleteRoute]);

  const navigateToCreate = useCallback(() => {
    navigate('/routes/create');
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200"
    >
      <PageHeader onAddClick={navigateToCreate} />

      {/* Error Handling */}
      {fetchError && (
        <ErrorMessage message={fetchError?.message || "Failed to load routes"} />
      )}
      
      {deleteError && (
        <ErrorMessage message={deleteError} />
      )}

      <RouteTable
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
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this route? This action cannot be undone."
        title="Delete Route"
      />
    </motion.div>
  );
};

export default RouteList;