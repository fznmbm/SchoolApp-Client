import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteJob, getJobs } from '@services/jobs';
import JobTable, { getJobStatus } from '@components/tables/JobTable';
import { Button } from '@components/common/Button';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import Popup from '@components/common/modal/Popup';

// Error Alert Component
const ErrorAlert = ({ message }) => (
  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-200">
    <div className="flex">
      <ExclamationCircleIcon
        className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-200"
        aria-hidden="true"
      />
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800 dark:text-red-300 transition-colors duration-200">
          {message || "An error occurred while fetching jobs"}
        </p>
      </div>
    </div>
  </div>
);

const JobList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for search params with default values - now includes status
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    route: "",
    status: "",
    search: "",
    startDateFrom: "",
    startDateTo: "",
    driver: "",
  });

  // State for delete modal
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Fetch jobs data from API - exclude status param since it's not a backend filter
  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ['jobs', { 
      page: searchParams.page, 
      limit: searchParams.limit,
      route: searchParams.route,
      search: searchParams.search,
      startDateFrom: searchParams.startDateFrom,
      startDateTo: searchParams.startDateTo,
      driver: searchParams.driver
    }],
    queryFn: () => {
      // Exclude client-only status from API call
      const { status, ...apiParams } = searchParams;
      return getJobs(apiParams);
    }
  });
  
  // Apply status filtering client-side
  const data = useMemo(() => {
    if (!rawData || !searchParams.status) return rawData;
    
    // Extract jobs array based on data structure
    let jobs = [];
    let dataStructure = '';
    
    if (Array.isArray(rawData)) {
      jobs = [...rawData];
      dataStructure = 'array';
    } else if (rawData.jobs && Array.isArray(rawData.jobs)) {
      jobs = [...rawData.jobs];
      dataStructure = 'jobs';
    } else if (rawData.data && Array.isArray(rawData.data)) {
      jobs = [...rawData.data];
      dataStructure = 'data';
    } else if (rawData.items && Array.isArray(rawData.items)) {
      jobs = [...rawData.items];
      dataStructure = 'items';
    }
    
    // Filter by status
    const filteredJobs = jobs.filter(job => {
      const jobStatus = getJobStatus(job.startDate, job.endDate);
      return jobStatus === searchParams.status;
    });
    
    // Return the filtered data with the same structure
    if (dataStructure === 'array') {
      return filteredJobs;
    } else if (dataStructure === 'jobs') {
      return { ...rawData, jobs: filteredJobs, totalCount: filteredJobs.length };
    } else if (dataStructure === 'data') {
      return { ...rawData, data: filteredJobs, totalCount: filteredJobs.length };
    } else if (dataStructure === 'items') {
      return { ...rawData, items: filteredJobs, totalCount: filteredJobs.length };
    }
    
    return rawData;
  }, [rawData, searchParams.status]);
  
  // Delete job mutation
  const {
    mutate: deleteJobHandler,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: (id) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      setIsDeletePopupOpen(false);
      setSelectedJob(null);
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setSearchParams(newFilters);
  }, []);

  const handleDelete = useCallback((job) => {
    setSelectedJob(job);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedJob) {
      deleteJobHandler(selectedJob._id);
    }
  }, [selectedJob, deleteJobHandler]);

  const navigateToCreate = useCallback(() => {
    navigate("/jobs/create");
  }, [navigate]);

  // Extract jobs array and pagination info
  const jobsData = useMemo(() => {
    if (!data) return { jobs: [], totalPages: 1, currentPage: 1 };
    if (Array.isArray(data)) return { jobs: data, totalPages: 1, currentPage: 1 };
    return {
      jobs: data.data || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || searchParams.page
    };
  }, [data, searchParams.page]);

  // Pagination object with memoization
  const paginationProps = useMemo(() => ({
    currentPage: Number(jobsData.currentPage) || searchParams.page,
    totalPages: jobsData.totalPages || 1,
    onPageChange: handlePageChange,
  }), [searchParams.page, jobsData.totalPages, jobsData.currentPage, handlePageChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200"
    >
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Jobs Management
          </h1>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
            Create, view, and manage transport jobs and assignments
          </p>
        </div>
        <Button
          onClick={navigateToCreate}
          className="flex items-center transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Job
        </Button>
      </div>

      {error && <ErrorAlert message={error?.message} />}
      {isDeleteError && <ErrorAlert message={deleteError?.message} />}

      <JobTable
        data={jobsData.jobs}
        isLoading={isLoading}
        filters={searchParams}
        onFilterChange={handleFilterChange}
        pagination={paginationProps}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Popup */}
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${selectedJob?.title || 'this job'}? This action cannot be undone.`}
        title="Delete Job"
        confirmButtonText="Delete Job"
        confirmButtonVariant="danger"
      />
    </motion.div>
  );
};

export default JobList;