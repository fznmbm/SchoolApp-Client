import React, { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import PAForm from "@components/forms/PACreateForm";
import { createPA } from "@services/pa";
import { paValidationSchema } from "@utils/validations";
import { ThemeContext } from "@/context/ThemeContext";

const PageHeader = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {title}
    </h1>
    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
      {description}
    </p>
  </div>
);

const PACreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createPA,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pas'] });
      navigate("/pa");
    },
    onError: (error) => {
      console.error('Error creating PA:', error);
    }
  });

  const handleSubmit = async (formData) => {
    // Log the FormData for debugging (only in development)
    
    try {
      await mutate(formData);
    } catch (err) {
      console.error('Mutation error:', err);
    }
  };

  const errorMessage = error?.response?.data?.message || error?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-colors duration-200">
          <div className="px-4 py-6 sm:p-8">
            <PageHeader 
              title="Add New Personal Assistant" 
              description="Create a new personal assistant in the system." 
            />

            <PAForm
              onSubmit={handleSubmit}
              validationSchema={paValidationSchema}
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

export default PACreate;