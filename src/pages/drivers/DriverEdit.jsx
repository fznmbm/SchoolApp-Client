// pages/admin/DriverEdit.jsx
import React, { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";
import DriverForm from "@/components/forms/driver-form/DriverForm";
import { getDriver, updateDriver } from "@/services/drivers";
import { driverValidationSchema } from "@/utils/validations";
import LoadingSpinner from "@/components/common/Spinner";

const DriverEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);

  // Fetch the driver details using the ID
  const {
    data: driverData,
    isLoading,
    isError: isFetchError,
    error: fetchError,
  } = useQuery({
    queryKey: ["driver", id],
    queryFn: () => getDriver(id),
    enabled: !!id,
  });

  // Mutation for updating the driver
  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (updatedData) => updateDriver({ id, ...updatedData }),
    onSuccess: () => {
      navigate("/drivers");
    },
  });

  // Handle form submission
  const handleSubmit = (values) => {
    // values here are already transformed by DriverForm (transformFormData)
    // Forward the complete payload so trainings and their files are included
    mutate(values);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 flex justify-center items-center transition-colors duration-200">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Loading driver details...
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  if (isFetchError) {
    return (
      <div className="max-w-7xl mx-auto py-8 transition-colors duration-200">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 transition-colors duration-200">
          <h2 className="text-lg font-medium text-red-800 dark:text-red-400 transition-colors duration-200">
            Error Loading Driver
          </h2>
          <p className="mt-2 text-red-700 dark:text-red-300 transition-colors duration-200">
            {fetchError?.message || "An error occurred while loading the driver data."}
          </p>
          <div className="mt-4">
            <button
              onClick={() => navigate("/drivers")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-600 transition-colors duration-200"
            >
              Return to Drivers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const errorMessage = updateError?.response?.data?.message || updateError?.message;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
          id="page-heading"
        >
          Edit Driver
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Update the driver details, including personal information, contact details, and vehicle assignment.
        </p>
      </div>

      {isUpdateError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md transition-colors duration-200">
          <h2 className="text-sm font-medium text-red-800 dark:text-red-400 transition-colors duration-200">
            Error
          </h2>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300 transition-colors duration-200">
            {updateError?.message || 'An error occurred while updating the driver.'}
          </p>
        </div>
      )}

      {driverData && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-200">
          <DriverForm
            initialData={driverData}
            onSubmit={handleSubmit}
            validationSchema={driverValidationSchema}
            isPending={isUpdating}
            isError={isUpdateError}
            error={{ message: errorMessage }}
            onCancel={() => navigate('/drivers')}
          />
        </div>
      )}
    </div>
  );
};

export default DriverEdit;