import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVendor } from '@/services/vendor';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  MapPinIcon, 
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const VendorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: vendor, isLoading, isError, error } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => getVendor(id),
    enabled: !!id,
  });

  const handleNavigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleNavigateToEdit = useCallback(() => {
    navigate(`/vendors/${id}/edit`);
  }, [navigate, id]);

  if (isLoading) {
    return (
      <p className="text-center text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Loading vendor details...
      </p>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 transition-colors duration-200">
        <p>Error loading vendor details: {error.message}</p>
      </div>
    );
  }

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
          aria-label="Go back to vendors list"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Vendors
        </Button>
        
        <Button
          onClick={handleNavigateToEdit}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-200"
          aria-label={`Edit vendor ${vendor?.name}`}
        >
          Edit Vendor
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Main Vendor Information */}
        <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-900 overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark transition-colors duration-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
              Vendor Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
              General information about the vendor
            </p>
          </div>
          <div className="border-t border-border-light dark:border-border-dark transition-colors duration-200">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Name
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  {vendor?.name}
                </dd>
              </div>

              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Contact Information
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <PhoneIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                      {vendor?.contact?.phone || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                      {vendor?.contact?.email || 'N/A'}
                    </div>
                  </div>
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Address
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    <span>
                      {vendor?.address?.street}, {vendor?.address?.city}, {vendor?.address?.county}
                      {vendor?.address?.postCode && `, ${vendor.address.postCode}`}
                    </span>
                  </div>
                </dd>
              </div>

              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Status
                </dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 
                      ${vendor?.status === 'Active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}
                    aria-label={`Status: ${vendor?.status}`}
                  >
                    {vendor?.status === 'Active' ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 transition-colors duration-200" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 mr-1 text-red-500 dark:text-red-400 transition-colors duration-200" />
                    )}
                    {vendor?.status}
                  </span>
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                    {formatDistanceToNow(new Date(vendor?.createdAt), { addSuffix: true })}
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

export default VendorView;