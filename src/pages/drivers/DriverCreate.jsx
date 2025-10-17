import React, { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '@/context/ThemeContext';
import DriverForm from '@/components/forms/driver-form/DriverForm';
import { createDriver } from '@/services/drivers';
import { driverValidationSchema } from '@/utils/validations';

const DriverCreate = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      navigate('/drivers');
    },
    onError: (error) => {
      console.error("Error creating driver:", error);
    }
  });

  // Extract API error message from the error object
  const errorMessage = error?.response?.data?.message || error?.message;

  const handleSubmit = (values) => {
    mutate(values);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200" 
             id="page-heading">
          Add New Driver
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Create a new driver profile with personal information and documents.
        </p>
      </div>

      {/* {isError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md transition-colors duration-200">
          <h2 className="text-sm font-medium text-red-800 dark:text-red-400 transition-colors duration-200">
            Error
          </h2>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300 transition-colors duration-200">
            {errorMessage || 'An error occurred while creating the driver.'}
          </p>
        </div>
      )} */}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-200">
        <DriverForm
          onSubmit={handleSubmit}
          validationSchema={driverValidationSchema}
          isError={isError}
          error={{ message: errorMessage }}
          isPending={isPending}
          onCancel={() => navigate('/drivers')}
        />
      </div>
    </div>
  );
};

export default DriverCreate;