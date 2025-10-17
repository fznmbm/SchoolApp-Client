import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdmin } from '@/services/admin';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const StatusBadge = ({ isActive }) => (
  <span 
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
      isActive 
        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    }`}
    role="status"
    aria-label={isActive ? 'Active status' : 'Inactive status'}
  >
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

const DetailRow = ({ label, icon: Icon, value, isAlternate = false }) => (
  <div className={`${isAlternate ? 'bg-gray-50 dark:bg-gray-800' : 'bg-surface dark:bg-surface-dark'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200`}>
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
      {label}
    </dt>
    <dd className="mt-1 text-sm text-text-primary dark:text-white sm:mt-0 sm:col-span-2 transition-colors duration-200">
      {Icon && value !== 'N/A' ? (
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
          {value}
        </div>
      ) : value}
    </dd>
  </div>
);

const AdminView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: admin, isLoading, isError, error } = useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdmin(id),
    enabled: !!id,
  });

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    navigate(`/admins/${id}/edit`);
  }, [navigate, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-500 rounded-full transition-colors duration-200"
          role="status"
          aria-label="Loading administrator details"
        />
        <span className="sr-only">Loading administrator details...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="text-center p-6"
        role="alert"
      >
        <div className="inline-block p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 transition-colors duration-200">
          <p className="text-lg font-medium mb-2">Error loading administrator details</p>
          <p className="text-sm">{error?.message || 'An unexpected error occurred'}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-6 transition-colors duration-200"
    >
      <div className="mb-6 flex justify-between items-center">
        <Button 
          onClick={handleBack} 
          className="flex items-center"
          aria-label="Back to administrators list"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Administrators
        </Button>

        <Button
          onClick={handleEdit}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-200"
          aria-label={`Edit administrator ${admin?.firstName || ''} ${admin?.lastName || ''}`}
        >
          Edit Administrator
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Main Admin Information */}
        <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg transition-colors duration-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-white transition-colors duration-200">
              Administrator Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              General information about the administrator
            </p>
          </div>
          
          <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
            <dl>
              <DetailRow 
                label="Name" 
                value={`${admin?.firstName || ''} ${admin?.lastName || ''}`}
                isAlternate={true}
              />
              
              <DetailRow 
                label="Role" 
                icon={ShieldCheckIcon} 
                value="Administrator" 
              />

              <DetailRow 
                label="Contact Information" 
                value={
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <PhoneIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                      {admin?.phone || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                      {admin?.email || 'N/A'}
                    </div>
                  </div>
                }
                isAlternate={true}
              />

              <DetailRow 
                label="Status" 
                value={<StatusBadge isActive={admin?.isActive} />} 
              />

              <DetailRow 
                label="Last Login" 
                icon={CalendarIcon} 
                value={admin?.lastLogin 
                  ? formatDistanceToNow(new Date(admin.lastLogin), { addSuffix: true })
                  : 'Never'
                }
                isAlternate={true}
              />

              <DetailRow 
                label="Created" 
                icon={CalendarIcon} 
                value={admin?.createdAt 
                  ? formatDistanceToNow(new Date(admin.createdAt), { addSuffix: true })
                  : 'N/A'
                }
              />
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminView;