import React, { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";

import TrainingForm from "@/components/forms/TrainingForm";
import { getTraining, updateTraining } from "@/services/training";
import { trainingValidationSchema } from "@/utils/validations";

const TrainingEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const { 
    data: trainingData, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useQuery({
    queryKey: ["training", id],
    queryFn: () => getTraining(id),
    enabled: !!id,
  });

  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (data) => updateTraining({ id, data }),
    onSuccess: () => {
      navigate("/training");
    }
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const { trainingID, trainingName, candidateType, description, status } = values;
    
    mutate({
      trainingID, 
      trainingName, 
      candidateType, 
      description, 
      status
    });
    
    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark-secondary flex items-center justify-center transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-primary-light" />
      </div>
    );
  }

  if (isFetchError) {
    return (
      <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark-secondary flex items-center justify-center transition-colors duration-200">
        <div className="text-error dark:text-error-light transition-colors duration-200">
          Error loading training: {fetchError.message}
        </div>
      </div>
    );
  }

  const errorMessage = updateError?.response?.data?.message || updateError?.message;

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark-secondary py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface dark:bg-surface-dark shadow-sm ring-1 ring-border-light/20 dark:ring-border-dark-mode/20 sm:rounded-xl transition-all duration-200">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                Edit Training
              </h1>
              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                Update the training details.
              </p>
            </div>

            <TrainingForm
              editInitialValues={trainingData}
              onSubmit={handleSubmit}
              validationSchema={trainingValidationSchema}
              isError={isUpdateError}
              error={{ message: errorMessage }}
              isPending={isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingEdit;