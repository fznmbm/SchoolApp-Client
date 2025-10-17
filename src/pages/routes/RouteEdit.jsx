import React, { useCallback, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import RouteForm from "@/components/forms/route-form/RouteForm";
import { getRoute, updateRoute } from "@/services/route";
import { routeValidationSchema } from "@/utils/validations";
import { ThemeContext } from "@context/ThemeContext";

// Loading spinner component
const LoadingSpinner = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-secondary dark:bg-surface-dark-secondary transition-colors duration-200">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-primary dark:text-primary-light mb-4 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">Loading route details...</p>
      </div>
    </div>
  );
};

// Error display component
const ErrorDisplay = ({ message, onBackClick }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark-secondary flex items-center justify-center transition-colors duration-200">
      <div className="bg-surface dark:bg-surface-dark p-8 rounded-lg shadow-md max-w-md w-full transition-colors duration-200">
        <div className="flex items-center justify-center text-error dark:text-error-light mb-4 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-text-primary dark:text-text-dark-primary mb-4 transition-colors duration-200">Error Loading Route</h2>
        <p className="text-text-secondary dark:text-text-dark-secondary text-center mb-6 transition-colors duration-200">
          {message || "Unable to load route details. Please try again."}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onBackClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200"
          >
            Back to Routes
          </button>
        </div>
      </div>
    </div>
  );
};

const RouteEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Fetch the route details using the ID
  const {
    data: routeData,
    isLoading,
    isError: isFetchError,
    error: fetchError,
  } = useQuery({
    queryKey: ["route", id],
    queryFn: () => getRoute(id),
    enabled: !!id,
  });

  // Mutation for updating the route
  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (updatedData) => updateRoute({ id, ...updatedData }),
    onSuccess: () => {
      navigate("/routes");
    },
  });

  // Handle form submission - only called when Update Route button is clicked
  const handleSubmit = useCallback((values, { setSubmitting }) => {
    // Ensure we send IDs for refs, not populated objects
    const normalized = {
      ...values,
      permanentDriver: values?.permanentDriver && typeof values.permanentDriver === 'object' ? values.permanentDriver._id : values.permanentDriver,
      pa: values?.pa && typeof values.pa === 'object' ? values.pa._id : values.pa,
      vendor: values?.vendor && typeof values.vendor === 'object' ? values.vendor._id : values.vendor,
    };

    // Only send fields that the form actually edits (omit staff assignment fields)
    const allowedPayload = {
      routeNo: normalized.routeNo,
      name: normalized.name,
      poNumber: normalized.poNumber,
      paPoNumber: normalized.paPoNumber,
      invoiceTemplate: normalized.invoiceTemplate,
      description: normalized.description,
      vendor: normalized.vendor,
      routePlanner: normalized.routePlanner,
      operatingDays: normalized.operatingDays,
      stops: normalized.stops,
      dayWiseStudents: normalized.dayWiseStudents,
      capacity: normalized.capacity,
      pricePerMile: normalized.pricePerMile,
      dailyPrice: normalized.dailyPrice,
      dailyMiles: normalized.dailyMiles,
      documents: normalized.documents,
      documentsToRemove: normalized.documentsToRemove,
      documentMetadata: normalized.documentMetadata,
      trackChanges: true,
      reason: 'Basic details update',
    };
    // Check if we need to handle document uploads
    const hasDocumentsToUpload = values.documents && 
      Array.isArray(values.documents) && 
      values.documents.length > 0 && 
      values.documents.some(doc => doc instanceof File);
    
    // Check if there are documents to remove
    const hasDocumentsToRemove = values.documentsToRemove && 
      Array.isArray(values.documentsToRemove) && 
      values.documentsToRemove.length > 0;
    
    // Prepare the data to send to the updateRoute service
    if (hasDocumentsToUpload || hasDocumentsToRemove) {
      // Make sure to prepare any data transformations (like in the student edit)
      // before passing to the mutation
      const updatedData = {
        ...allowedPayload,
        // Any additional data transformations needed
      };
      
      mutate(updatedData);
    } else {
      // No document changes, just send regular data
      mutate(allowedPayload);
    }
    
    setSubmitting(false);
  }, [mutate]);

  const handleBackToRoutes = useCallback(() => {
    navigate("/routes");
  }, [navigate]);

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (isFetchError) {
    return <ErrorDisplay message={fetchError?.message} onBackClick={handleBackToRoutes} />;
  }

  const errorMessage = updateError?.response?.data?.message || updateError?.message;

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark-secondary py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface dark:bg-surface-dark shadow-sm ring-1 ring-border-light dark:ring-border-dark-mode sm:rounded-xl transition-colors duration-200">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                Edit Route
              </h1>
              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                Update the route details, including the stops and driver assignment.
              </p>
            </div>

            {routeData && (
              <RouteForm
                editInitialValues={routeData}
                onSubmit={handleSubmit}
                validationSchema={routeValidationSchema}
                isError={isUpdateError}
                error={{ message: errorMessage }}
                isPending={isUpdating}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorDisplay.propTypes = {
  message: PropTypes.string,
  onBackClick: PropTypes.func.isRequired
};

export default RouteEdit;