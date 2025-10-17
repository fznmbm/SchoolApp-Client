import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTraining, getAllTrainings } from '@services/training';
import TrainingTable from '@components/tables/TrainingTable';
import { Button } from '@components/common/Button';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import Popup from '@components/common/modal/Popup';

const TrainingList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    candidateType: '',
    status: ''
  });

  const { data, isLoading } = useQuery({
    queryKey: ['trainings', searchParams],
    queryFn: () => getAllTrainings(searchParams),
  });

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  const queryClient = useQueryClient();
  const { 
    mutate: deleteTrainingHandler, 
    isError: isDeleteError, 
    error: deleteError 
  } = useMutation({
    mutationFn: (id) => deleteTraining(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['trainings']);
      setIsDeletePopupOpen(false);
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleDelete = useCallback((training) => {
    setTrainingToDelete(training);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (trainingToDelete) {
      deleteTrainingHandler(trainingToDelete._id);
    }
  }, [deleteTrainingHandler, trainingToDelete]);

  const handleFilterChange = useCallback((filterType, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [filterType]: value,
      page: 1  
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Trainings
          </h1>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
            Manage training records and certifications
          </p>
        </div>
        <Button
          onClick={() => navigate('/training/create')}
          className="flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Training
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        {/* Candidate Type Filter */}
        <select
          value={searchParams.candidateType}
          onChange={(e) => handleFilterChange('candidateType', e.target.value)}
          className="px-3 py-2 border border-border-light dark:border-border-dark rounded-md 
                    bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary
                    focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark
                    transition-colors duration-200"
          aria-label="Filter by candidate type"
        >
          <option value="">All Candidate Types</option>
          <option value="Driver">Driver</option>
          <option value="PA">Personal Assistant</option>
        </select>

        {/* Status Filter */}
        <select
          value={searchParams.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-border-light dark:border-border-dark rounded-md 
                    bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary
                    focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark
                    transition-colors duration-200"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
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
                {deleteError?.message || 'An error occurred while deleting the training'}
              </p>
            </div>
          </div>
        </div>
      )}

      <TrainingTable
        data={data}
        isLoading={isLoading}
        pagination={{
          currentPage: searchParams.page,
          totalPages: data?.totalPages || 1,
          onPageChange: handlePageChange,
        }}
        onDelete={handleDelete}
      />

      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this training record? This action cannot be undone."
        title="Delete Training"
      />
    </motion.div>
  );
};

export default TrainingList;