import React, { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import LicensingAuthorityForm from "@components/forms/LicensingAuthorityForm";
import { createLicensingAuthority } from "@services/licensingAuthority";
import { licensingAuthorityValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";

const LicensingAuthorityCreate = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createLicensingAuthority,
    onSuccess: () => {
      navigate("/licensing-authority");
    }
  });

  const handleSubmit = (values, { setSubmitting }) => {
    mutate(values);
    setSubmitting(false);
  };

  const errorMessage = error?.response?.data?.message || error?.message;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-colors duration-200">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                Add New Licensing Authority
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Create a new licensing authority in the system.
              </p>
            </div>

            <LicensingAuthorityForm
              onSubmit={handleSubmit}
              validationSchema={licensingAuthorityValidationSchema}
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

export default LicensingAuthorityCreate;