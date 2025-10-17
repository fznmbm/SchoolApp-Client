import React, { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import AdminForm from "@components/forms/AdminForm";
import { createAdmin } from "@services/admin";
import { adminValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";

const AdminCreate = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      navigate("/admins");
    },
    onError: (error) => {
      console.error("Error creating admin:", error);
    }
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const { confirmPassword, isNewAdmin, ...adminData } = values;
    mutate(adminData);
    setSubmitting(false);
  };

  // Extract API error message from the error object
  const errorMessage = error?.response?.data?.message || error?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-colors duration-300">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Add New Administrator
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Create a new administrator with system access.
              </p>
            </div>

            <AdminForm
              onSubmit={handleSubmit}
              validationSchema={adminValidationSchema}
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

export default AdminCreate;