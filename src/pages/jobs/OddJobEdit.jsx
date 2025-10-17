import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOddJob, updateOddJob } from '@/services/oddJobs';
import OddJobForm from '@components/forms/job-form/OddJobForm';
import Spinner from '@components/common/Spinner';

const OddJobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: oddJob, isLoading, error } = useQuery({
    queryKey: ['oddJob', id],
    queryFn: () => getOddJob(id),
  });

  const updateMutation = useMutation({
    mutationFn: updateOddJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['oddJobs']);
      navigate('/odd-jobs');
    },
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading odd job</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Odd Job</h1>
        <OddJobForm oddJobId={id} />
      </div>
    </div>
  );
};

export default OddJobEdit;
