import React, { useCallback, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import SchoolForm from "@components/forms/SchoolForm";
import { getSchool, updateSchool } from "@services/school";
import { schoolValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";
import LoadingSpinner from "@components/common/Spinner";

const SchoolEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);

  const { 
    data: schoolData, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useQuery({
    queryKey: ["school", id],
    queryFn: () => getSchool(id),
    enabled: !!id,
  });

  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (data) => updateSchool({ id, data }),
    onSuccess: () => {
      navigate("/schools");
    }
  });

  
  const handleSubmit = useCallback((values, { setSubmitting }) => {
    mutate(values);
    setSubmitting(false);
  }, [mutate]);

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300" aria-live="polite" aria-busy="true">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400" />
          <p className="mt-3 text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading school details...</p>
        </div>
      </div>
    );
  }

  
  if (isFetchError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300" aria-live="assertive">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-300">
          <div className="text-red-500 dark:text-red-400 font-medium text-lg mb-2 transition-colors duration-300">
            Error Loading School
          </div>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            {fetchError?.message || "Unable to load school details. Please try again later."}
          </p>
          <button 
            onClick={() => navigate("/schools")}
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-300"
            aria-label="Return to schools list"
          >
            Back to Schools
          </button>
        </div>
      </div>
    );
  }

  const errorMessage = updateError?.response?.data?.message || updateError?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-all duration-300">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Edit School
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Update the school's details.
              </p>
            </div>

            <SchoolForm
              editInitialValues={schoolData}
              onSubmit={handleSubmit}
              validationSchema={schoolValidationSchema}
              isError={isUpdateError}
              error={{ message: errorMessage }}
              isPending={isUpdating}
              hideHolidays={true}
              aria-labelledby="edit-school-heading"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolEdit;