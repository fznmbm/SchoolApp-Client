import React, { useCallback, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import RouteForm from "@/components/forms/route-form/RouteForm";
import { createRoute } from "@services/route";
import { routeValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";

const RouteCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Setup mutation for creating a new route
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      // Invalidate and refetch routes queries
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      navigate("/routes");
    },
    onError: (error) => {
      console.error("Error creating route:", error);
    }
  });

  // Extract API error message from the error object
  const errorMessage = error?.response?.data?.message || error?.message;

  // Handle form submission
  const handleSubmit = useCallback((values, { setSubmitting }) => {
    // Format the data for submission
    const formattedData = {
      routeNo: values.routeNo,
      name: values.name,
      poNumber: values.poNumber,
      paPoNumber: values.paPoNumber,
      description: values.description,
      invoiceTemplate: values.invoiceTemplate,
      vendor: values.vendor,
      routePlanner: {
        name: values.routePlanner.name,
        phone: values.routePlanner.phone,
        email: values.routePlanner.email,
      },
      operatingDays: values.operatingDays,
      permanentDriver: values.permanentDriver,
      isPANeeded: values.isPANeeded,
      pa: values.pa,
      stops: {
        startingStop: values.stops.startingStop,
        intermediateStops: values.stops.intermediateStops.filter(stop => stop.location.trim() !== ''),
        endingStop: values.stops.endingStop
      },
      pricePerMile: values.pricePerMile,
      dailyPrice: values.dailyPrice,
      driverPrice: values.driverPrice,
      paPrice: values.paPrice,
      dailyMiles: values.dailyMiles,
      dayWiseStudents: values.dayWiseStudents,
      capacity: values.capacity,
    };
    
    // Only include document fields if a document is provided
    if (values.documents) {
      formattedData.documents = values.documents;
      formattedData.documentMetadata = [
        { type: 'ROUTE_MAP', description: 'Document' }
      ];
    }
  
    mutate(formattedData, {
      onSettled: () => {
        setSubmitting(false);
      }
    });
  }, [mutate]);

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark-secondary py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface dark:bg-surface-dark shadow-sm ring-1 ring-border-light dark:ring-border-dark-mode sm:rounded-xl md:col-span-2 transition-colors duration-200">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                Create New Route
              </h1>
              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                Add a new transportation route with stops and assignments.
              </p>
            </div>
            
            <RouteForm
              onSubmit={handleSubmit}
              validationSchema={routeValidationSchema}
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

RouteCreate.propTypes = {};

export default RouteCreate;