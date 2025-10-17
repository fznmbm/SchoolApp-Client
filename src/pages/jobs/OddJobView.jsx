import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOddJob, deleteOddJob, updateOddJobStatus } from '@/services/oddJobs';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyPoundIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const OddJobView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: oddJob, isLoading, isError, error } = useQuery({
    queryKey: ['oddJob', id],
    queryFn: () => getOddJob(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOddJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['oddJobs']);
      navigate('/odd-jobs');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOddJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['oddJob', id]);
      queryClient.invalidateQueries(['oddJobs']);
    },
  });

  const handleNavigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleNavigateToEdit = useCallback(() => {
    navigate(`/odd-jobs/${id}/edit`);
  }, [navigate, id]);

  const handleDelete = useCallback(() => {
    if (oddJob) {
      deleteMutation.mutate(oddJob._id);
    }
  }, [oddJob, deleteMutation]);

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return [address.line1, address.line2, address.city, address.county, address.postCode]
      .filter(Boolean)
      .join(', ');
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const getStatusConfig = (status) => {
    const configs = {
      'BOOKED': { 
        label: 'Booked', 
        class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        icon: CheckCircleIcon
      },
      'IN_PROGRESS': { 
        label: 'In Progress', 
        class: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        icon: ClockIcon
      },
      'COMPLETED': { 
        label: 'Completed', 
        class: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300',
        icon: CheckCircleIcon
      },
      'CANCELLED': { 
        label: 'Cancelled', 
        class: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        icon: XCircleIcon
      }
    };
    return configs[status] || { label: status, class: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300', icon: ExclamationTriangleIcon };
  };

  if (isLoading) {
    return (
      <p className="text-center text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Loading odd job details...
      </p>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 transition-colors duration-200">
        <p>Error loading odd job details: {error.message}</p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(oddJob?.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="mb-6 flex justify-between items-center">
        <Button 
          onClick={handleNavigateBack} 
          className="flex items-center"
          aria-label="Go back to odd jobs list"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Odd Jobs
        </Button>
        
        <div className="space-x-2">
          <Button
            onClick={handleNavigateToEdit}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-200"
            aria-label={`Edit odd job ${oddJob?.title}`}
          >
            Edit Odd Job
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors duration-200"
            aria-label={`Delete odd job ${oddJob?.title}`}
          >
            Delete Odd Job
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Main Odd Job Information */}
        <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-900 overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark transition-colors duration-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
              Odd Job Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
              Details about the odd job booking
            </p>
          </div>
          <div className="border-t border-border-light dark:border-border-dark transition-colors duration-200">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Title
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  {oddJob?.title}
                </dd>
              </div>
              
              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Booking Source
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {oddJob?.bookingSource}
                  </div>
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Status
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${statusConfig.class}`}
                    aria-label={`Status: ${statusConfig.label}`}
                  >
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {statusConfig.label}
                  </span>
                </dd>
              </div>

              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Quoted Price
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <CurrencyPoundIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    £{oddJob?.quotedPrice}
                  </div>
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Passenger Name
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {oddJob?.passenger?.name}
                  </div>
                </dd>
              </div>

              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {oddJob?.passenger?.phone}
                  </div>
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {oddJob?.passenger?.email}
                  </div>
                </dd>
              </div>

              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Schedule Type
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {oddJob?.pickup?.whenType}
                  </div>
                </dd>
              </div>

              {oddJob?.pickup?.whenType === 'ONE_OFF' ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                  <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Date & Time
                  </dt>
                  <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                      {formatDateTime(oddJob?.pickup?.dateTime)}
                    </div>
                  </dd>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                    <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                      Start Date
                    </dt>
                    <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                        {formatDate(oddJob?.pickup?.startDate)}
                      </div>
                    </dd>
                  </div>
                  <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                    <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                      End Date
                    </dt>
                    <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                        {formatDate(oddJob?.pickup?.endDate)}
                      </div>
                    </dd>
                  </div>
                                     <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                     <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                       Pickup Time
                     </dt>
                     <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                       <div className="flex items-center">
                         <ClockIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                         {oddJob?.pickup?.time || 'N/A'}
                       </div>
                     </dd>
                   </div>
                   <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                     <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                       Operating Days
                     </dt>
                     <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                       {oddJob?.pickup?.operatingDays?.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ') || 'N/A'}
                     </dd>
                   </div>
                </>
              )}

              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Pickup Address
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {formatAddress(oddJob?.pickupAddress)}
                  </div>
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Dropoff Address
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {formatAddress(oddJob?.dropoffAddress)}
                  </div>
                </dd>
              </div>

              {oddJob?.notes && (
                <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                  <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Notes
                  </dt>
                  <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                    {oddJob.notes}
                  </dd>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {formatDistanceToNow(new Date(oddJob?.createdAt), { addSuffix: true })}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OddJobView;
