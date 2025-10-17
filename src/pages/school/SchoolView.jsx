import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSchool } from '@/services/school';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { SchoolDetails } from '@components/school/SchoolDetails';
import { SchoolHolidays } from '@components/school/SchoolHolidays';
import { HistoryTracker } from '@components/common/HistoryTracker';

const SchoolView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: school,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["school", id],
    queryFn: () => getSchool(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-900/20 flex items-center justify-center p-6 transition-colors duration-200">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full text-center transition-colors duration-200">
          <p className="text-red-500 dark:text-red-400 text-lg mb-4 transition-colors duration-200">
            Error loading school details: {error.message}
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary transition-colors duration-200"
    >
      <div className="mb-6 flex justify-between items-center">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center"
          aria-label="Back to Schools"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Schools
        </Button>
        <Button
          onClick={() => navigate(`/schools/${id}/edit`)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white h-10 px-4 py-2 transition-colors duration-200"
          aria-label="Edit School"
        >
          Edit School
        </Button>
      </div>

      <div className="grid gap-6">
        {/* School components */}
        <SchoolDetails school={school} />
        <SchoolHolidays school={school} id={id} queryClient={queryClient} />
        {school?.history?.length > 0 && (
          <HistoryTracker
            history={school.history}
            title="School History"
            subtitle="Record of school modifications"
            entityType="school"
          />
        )}
      </div>
    </motion.div>
  );
};

export default SchoolView;