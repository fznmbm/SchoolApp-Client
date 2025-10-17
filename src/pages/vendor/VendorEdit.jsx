import React, { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";

import VendorForm from "@/components/forms/VendorForm";
import { getVendor, updateVendor } from "@/services/vendor";
import { vendorValidationSchema } from "@/utils/validations";

const VendorEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const { 
    data: vendorData, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => getVendor(id),
    enabled: !!id,
  });

  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (data) => updateVendor({ id, data }),
    onSuccess: () => {
      navigate("/vendors");
    }
  });

  const handleSubmit = (values, { setSubmitting }) => {
    mutate(values);
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
          Error loading vendor: {fetchError.message}
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
                Edit Vendor
              </h1>
              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                Update the vendor's details.
              </p>
            </div>

            <VendorForm
              editInitialValues={vendorData}
              onSubmit={handleSubmit}
              validationSchema={vendorValidationSchema}
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

export default VendorEdit;