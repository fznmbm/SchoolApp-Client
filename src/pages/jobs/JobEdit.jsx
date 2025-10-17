import React, { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import JobFormContainer from "@components/forms/job-form/JobFormContainer";
import { getJob, updateJob } from "@services/jobs";
import { ThemeContext } from "@context/ThemeContext";
import LoadingSpinner from "@components/common/Spinner";

const JobEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const queryClient = useQueryClient();
  const [processedJobData, setProcessedJobData] = useState(null);

  // Fetch job data
  const { 
    data: jobData, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });

  // Process the job data to match the form's expected format
  useEffect(() => {
    if (jobData) {
      // Process the data to match the form structure
      const formattedData = {
        _id: jobData._id,
        title: jobData.title,
        route: jobData.route._id, // Extract just the ID for the form select
        routeInfo: {
          ...jobData.route,
          // Ensure stops are included in the routeInfo for preview generation
          stops: jobData.stops
        },
        startDate: new Date(jobData.startDate),
        endDate: new Date(jobData.endDate),
        status: jobData.status,
        operatingDays: jobData.operatingDays || ["monday", "tuesday", "wednesday", "thursday", "friday"],
        isPANeeded: jobData.isPANeeded,
        isActive: jobData.isActive,
        // Include stops at top level as well for compatibility
        stops: jobData.stops,
      };

      // Add optional fields if they exist
      if (jobData.permanentDriver) {
        formattedData.permanentDriver = jobData.permanentDriver;
      }

      if (jobData.temporaryDriver) {
        formattedData.temporaryDriver = jobData.temporaryDriver;
      }

      if (jobData.pa) {
        formattedData.pa = jobData.pa;
      }

      setProcessedJobData(formattedData);
    }
  }, [jobData]);

  // Update job mutation
  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (data) => updateJob({ id, data }),
    onSuccess: () => {
      // Invalidate relevant queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      navigate("/jobs");
    }
  });

  // Loading state
  if (isLoading || (jobData && !processedJobData)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300" aria-live="polite" aria-busy="true">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400" />
          <p className="mt-3 text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isFetchError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300" aria-live="assertive">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-300">
          <div className="text-red-500 dark:text-red-400 font-medium text-lg mb-2 transition-colors duration-300">
            Error Loading Job
          </div>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            {fetchError?.message || "Unable to load job details. Please try again later."}
          </p>
          <button 
            onClick={() => navigate("/jobs")}
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-300"
            aria-label="Return to jobs list"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-all duration-300">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300" id="edit-job-heading">
                Edit Job
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Update job details and assignments.
              </p>
            </div>

            <JobFormContainer 
              hideTitle={true}  
              editInitialValues={processedJobData}
              aria-labelledby="edit-job-heading"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobEdit;