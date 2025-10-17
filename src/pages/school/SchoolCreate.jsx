import React, { useCallback, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import SchoolForm from "@components/forms/SchoolForm";
import { createSchool } from "@services/school";
import { schoolValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";

const SchoolCreate = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      navigate("/schools");
    }
  });

  const handleSubmit = useCallback((values, { setSubmitting }) => {
    mutate(values);
    setSubmitting(false);
  }, [mutate]);

  const errorMessage = error?.response?.data?.message || error?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-all duration-300">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Add New School
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Create a new school in the system.
              </p>
            </div>

            <SchoolForm
              onSubmit={handleSubmit}
              validationSchema={schoolValidationSchema}
              isError={isError}
              error={{ message: errorMessage }}
              isPending={isPending}
              aria-labelledby="create-school-heading"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolCreate;