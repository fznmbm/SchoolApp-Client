import React from 'react';
import OddJobForm from '@/components/forms/job-form/OddJobForm';

const OddJobCreate = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Create Odd Job</h1>
      <p className="text-sm text-gray-500 mb-6">Add a one-off or recurring external booking.</p>
      <OddJobForm />
    </div>
  );
};

export default OddJobCreate;



