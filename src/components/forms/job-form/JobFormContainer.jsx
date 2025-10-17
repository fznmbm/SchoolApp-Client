import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { getJob, createJob, updateJob } from "@services/jobs";
import JobFormStep1 from "./JobFormStep1";
import JobFormStep2 from "./JobFormStep2";
import StepIndicator from "./StepIndicator";
import LoadingSpinner from "@components/common/Spinner";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

const JobFormContainer = ({ hideTitle = false, editInitialValues = null }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id || !!editInitialValues;
  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    route: "",
    startDate: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
    endDate: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
    status: "ACTIVE",
    operatingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    routeInfo: null,
    isActive: true,
    isPANeeded: false,
  });
  
  useEffect(() => {
    if (editInitialValues) {
      setFormData(prevData => ({
        ...prevData,
        ...editInitialValues,
        startDate: editInitialValues.startDate instanceof Date 
          ? editInitialValues.startDate 
          : new Date(editInitialValues.startDate),
        endDate: editInitialValues.endDate instanceof Date 
          ? editInitialValues.endDate 
          : new Date(editInitialValues.endDate),
      }));
    }
  }, [editInitialValues]);

  const step1ValidationSchema = Yup.object({
    title: Yup.string().required("Job title is required"),
    route: Yup.string().required("Route is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
  });

  const step2ValidationSchema = Yup.object({});

  const { isLoading, error: fetchError } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    enabled: isEditMode && !editInitialValues, 
    onSuccess: (response) => {
      if (response && response.data) {
        const data = response.data;
        
        const operatingDays = Array.isArray(data.operatingDays) 
          ? data.operatingDays 
          : ["monday", "tuesday", "wednesday", "thursday", "friday"];
        
        const startDate = data.startDate ? new Date(data.startDate) : new Date();
        const endDate = data.endDate ? new Date(data.endDate) : new Date();
        
        setFormData({
          ...data,
          startDate,
          endDate,
          operatingDays,
          routeInfo: data.route,
          route: data.route?._id || data.route 
        });
      }
    },
    onError: (error) => {
      console.error("Error fetching job:", error);
      setFormError(error?.message || "Failed to load job data. Please try again.");
    }
  });

  useEffect(() => {
    if (fetchError) {
      setFormError(fetchError?.message || "Failed to load job data");
    }
  }, [fetchError]);

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      navigate("/jobs-list");
    },
    onError: (error) => {
      console.error("Error creating job:", error);
      setFormError(error?.message || "Failed to create job. Please check your input and try again.");
    }
  });

  const updateJobMutation = useMutation({
    mutationFn: (data) => updateJob({ id, data }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      navigate("/jobs-list");
    },
    onError: (error) => {
      console.error("Error updating job:", error);
      setFormError(error?.message || "Failed to update job. Please check your input and try again.");
    }
  });

  const isPending = createJobMutation.isPending || updateJobMutation.isPending;
  const isError = !!formError || createJobMutation.isError || updateJobMutation.isError;
  const error = formError || createJobMutation.error || updateJobMutation.error;

  useEffect(() => {
    setFormError(null);
  }, [currentStep]);

  const handleNextStep = useCallback((values) => {
    setFormData(prevData => ({
      ...prevData,
      ...values
    }));
    setCurrentStep(2);
  }, []);

  const handleSubmit = useCallback((values) => {
    const finalData = {
      title: values.title,
      route: values.route,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status || "ACTIVE",
      operatingDays: values.operatingDays || ["monday", "tuesday", "wednesday", "thursday", "friday"],
    };

    if (values.isPANeeded) {
      finalData.isPANeeded = true;
      if (values.pa) {
        finalData.pa = values.pa;
      }
    }

    if (values.permanentDriver) {
      finalData.permanentDriver = values.permanentDriver;
    }
    
    if (values.temporaryDriver && values.temporaryDriver.driver) {
      finalData.temporaryDriver = values.temporaryDriver;
    }

    if (isEditMode) {
      updateJobMutation.mutate(finalData);
    } else {
      createJobMutation.mutate(finalData);
    }
  }, [isEditMode, updateJobMutation, createJobMutation]);

  const handleBackStep = useCallback((values) => {
    setFormData(prevData => ({
      ...prevData,
      ...values,
    }));
    setCurrentStep(1);
  }, []);

  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 transition-colors duration-300" role="status">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading job data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-800/50 rounded-lg p-6 transition-colors duration-300">
      <div className="mb-8">
        {!hideTitle && (
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {isEditMode ? "Edit Job" : "Create New Job"}
          </h1>
        )}
        
        <StepIndicator 
          currentStep={currentStep} 
          steps={['Basic Details', 'Preview & Confirm']} 
        />
      </div>

      {isError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-300" role="alert">
          <div className="flex">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-300"
              aria-hidden="true"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-300">
                {error?.message || "An error occurred while processing your request"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-colors duration-300 rounded-lg p-4">
        {currentStep === 1 && (
          <JobFormStep1
            onNext={handleNextStep}
            validationSchema={step1ValidationSchema}
            isError={isError}
            error={error}
            isPending={isPending}
            editInitialValues={formData}
            isEditMode={isEditMode}
          />
        )}

        {currentStep === 2 && (
          <JobFormStep2
            onSubmit={handleSubmit}
            onBack={handleBackStep}
            validationSchema={step2ValidationSchema}
            isPending={isPending}
            formData={formData}
            isEditMode={isEditMode}
          />
        )}
      </div>
    </div>
  );
};

export default JobFormContainer;