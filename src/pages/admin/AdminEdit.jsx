import React, { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import AdminForm from "@components/forms/AdminForm";
import { getAdmin, updateAdmin } from "@services/admin";
import { adminValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";


const AdminEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);

  const {
    data: adminData,
    isLoading,
    isError: isFetchError,
    error: fetchError
  } = useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdmin(id),
    enabled: !!id,
  });

  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (data) => updateAdmin(id, data),
    onSuccess: () => {
      navigate("/admins");
    }
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const { confirmPassword, isNewAdmin, ...adminData } = values;
    if (!adminData.password) {
      delete adminData.password;
    }

    mutate(adminData);
    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400" />
      </div>
    );
  }

  if (isFetchError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-red-500 dark:text-red-400 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2 text-red-600 dark:text-red-400">Error Loading Data</h2>
          <p>Error loading administrator: {fetchError.message}</p>
        </div>
      </div>
    );
  }

  const updateErrorMessage = updateError?.response?.data?.message || updateError?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-colors duration-300">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Edit Administrator
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Update the administrator's details and access.
              </p>
            </div>

            <AdminForm
              editInitialValues={adminData}
              onSubmit={handleSubmit}
              validationSchema={adminValidationSchema}
              isError={isUpdateError}
              error={{ message: updateErrorMessage }}
              isPending={isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEdit;