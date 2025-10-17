import React, { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";

import TrainingForm from "@/components/forms/TrainingForm";
import { createTraining } from "@/services/training";
import { trainingValidationSchema } from "@/utils/validations";

const TrainingCreate = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createTraining,
    onSuccess: () => {
      navigate("/training");
    }
  });

  const handleSubmit = (values, { setSubmitting }) => {
    mutate(values);
    setSubmitting(false);
  };

  const errorMessage = error?.response?.data?.message || error?.message;

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark-secondary py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface dark:bg-surface-dark shadow-sm ring-1 ring-border-light/20 dark:ring-border-dark-mode/20 sm:rounded-xl transition-all duration-200">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                Add New Training
              </h1>
              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                Create a new training record in the system.
              </p>
            </div>

            <TrainingForm
              onSubmit={handleSubmit}
              validationSchema={trainingValidationSchema}
              isError={isError}
              error={{ message: errorMessage }}
              isPending={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCreate;