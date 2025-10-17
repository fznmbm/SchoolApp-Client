import React from 'react';
import JobFormContainer from '@/components/forms/job-form/JobFormContainer';

const JobCreate = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300"
          aria-label="Create New Job Page"
        >
          Create New Job
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          Create a new job assignment with route and student details.
        </p>
      </div>

      <JobFormContainer hideTitle={true} />
    </div>
  );
};

export default JobCreate;