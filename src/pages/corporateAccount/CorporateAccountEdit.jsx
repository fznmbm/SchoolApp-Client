import React, { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import CorporateAccountForm from "@components/forms/CorporateAccountForm";
import { 
  getCorporateAccount, 
  updateCorporateAccount 
} from "@services/corporateAccount";
import { corporateAccountValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";

const CorporateAccountEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);

  const { 
    data: corporateAccountData, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useQuery({
    queryKey: ["corporate-account", id],
    queryFn: () => getCorporateAccount(id),
    enabled: !!id,
  });

  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (data) => updateCorporateAccount({ id, data }),
    onSuccess: () => {
      navigate("/corporate-accounts");
    }
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const { 
      corporateAccountID, 
      companyName, 
      contact 
    } = values;
    
    mutate({
      corporateAccountID, 
      companyName, 
      contact
    });
    
    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400" />
      </div>
    );
  }

  if (isFetchError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-red-500 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-md shadow transition-colors duration-200">
          Error loading corporate account: {fetchError.message}
        </div>
      </div>
    );
  }

  const errorMessage = updateError?.response?.data?.message || updateError?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-colors duration-200">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                Edit Corporate Account
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Update the corporate account details.
              </p>
            </div>

            <CorporateAccountForm
              editInitialValues={corporateAccountData}
              onSubmit={handleSubmit}
              validationSchema={corporateAccountValidationSchema}
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

export default CorporateAccountEdit;


