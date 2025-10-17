import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTraining } from '@/services/training';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  UserIcon,
  DocumentIcon,
  CalendarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const TrainingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: training, isLoading, isError, error } = useQuery({
    queryKey: ["training", id],
    queryFn: () => getTraining(id),
    enabled: !!id,
  });

  const handleNavigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleNavigateToEdit = useCallback(() => {
    navigate(`/training/${id}/edit`);
  }, [navigate, id]);

  if (isLoading) {
    return (
      <p className="text-center text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Loading training details...
      </p>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 transition-colors duration-200">
        <p>Error loading training details: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="mb-6 flex justify-between items-center">
        <Button 
          onClick={handleNavigateBack} 
          className="flex items-center"
          aria-label="Go back to trainings list"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Trainings
        </Button>
        
        <Button
          onClick={handleNavigateToEdit}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-200"
          aria-label={`Edit training ${training?.trainingName}`}
        >
          Edit Training
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Main Training Information */}
        <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-900 overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark transition-colors duration-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
              Training Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
              Details about the training
            </p>
          </div>
          <div className="border-t border-border-light dark:border-border-dark transition-colors duration-200">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Training ID
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  {training?.trainingID}
                </dd>
              </div>
              
              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Training Name
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {training?.trainingName}
                  </div>
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Candidate Type
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {training?.candidateType}
                  </div>
                </dd>
              </div>

              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  {training?.description || 'No description provided'}
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Status
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 
                      ${training?.status === 'Active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}
                    aria-label={`Status: ${training?.status}`}
                  >
                    {training?.status === 'Active' ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 transition-colors duration-200" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 mr-1 text-red-500 dark:text-red-400 transition-colors duration-200" />
                    )}
                    {training?.status}
                  </span>
                </dd>
              </div>

              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {formatDistanceToNow(new Date(training?.createdAt), { addSuffix: true })}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>


      </div>
    </motion.div>
  );
};

export default TrainingView;