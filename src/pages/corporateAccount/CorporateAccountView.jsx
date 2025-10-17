import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCorporateAccount } from '@services/corporateAccount';
import { Button } from '@components/common/Button';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  IdentificationIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark transition-colors duration-200">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mb-4 transition-colors duration-200" />
      <p className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Loading corporate account details...
      </p>
    </div>
  </div>
);

const ErrorState = ({ error, onBack }) => (
  <div className="min-h-screen bg-red-50 dark:bg-red-900/10 flex items-center justify-center p-6 transition-colors duration-200">
    <div className="bg-surface dark:bg-surface-dark shadow-md rounded-lg p-8 max-w-md w-full text-center transition-colors duration-200">
      <ExclamationTriangleIcon className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4 transition-colors duration-200" />
      <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2 transition-colors duration-200">
        Error Loading Details
      </h2>
      <p className="text-text-secondary dark:text-text-dark-secondary mb-6 transition-colors duration-200">
        {error?.message || 'Unable to fetch corporate account information'}
      </p>
      <Button onClick={onBack} className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors duration-200">
        Go Back
      </Button>
    </div>
  </div>
);

const DetailRow = ({ label, icon, value, isAlternate = false }) => {
  const Icon = icon;
  return (
    <div className={`${isAlternate ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-surface dark:bg-surface-dark'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200`}>
      <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 flex items-center transition-colors duration-200">
        {Icon && <Icon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />}
        {value}
      </dd>
    </div>
  );
};

const ContactInfo = ({ contact }) => (
  <div className="space-y-2">
    <div className="flex items-center">
      <PhoneIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
      <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        {contact?.phone || 'No phone number'}
      </span>
    </div>
    <div className="flex items-center">
      <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
      <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        {contact?.email || 'No email address'}
      </span>
    </div>
  </div>
);

const CorporateAccountDetailsCard = ({ account }) => {
  const formatAddress = useCallback(() => {
    const { address } = account?.contact || {};
    if (!address) return 'No address provided';

    const addressParts = [
      address.street,
      address.city,
      address.county,
      address.postCode,
      address.country
    ].filter(Boolean);

    return addressParts.join(', ');
  }, [account]);

  return (
    <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark transition-colors duration-200">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          Corporate Account Details
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
          Comprehensive information about the corporate account
        </p>
      </div>
      <div className="border-t border-border-light dark:border-border-dark transition-colors duration-200">
        <dl>
          <DetailRow label="Account ID" icon={IdentificationIcon} value={account?.corporateAccountID || 'N/A'} isAlternate={true} />
          <DetailRow label="Company Name" icon={BuildingOfficeIcon} value={account?.companyName || 'N/A'} />
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
              Contact Information
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <ContactInfo contact={account?.contact} />
            </dd>
          </div>
          <DetailRow label="Address" icon={MapPinIcon} value={formatAddress()} />
          <DetailRow label="Created" icon={CalendarIcon} value={formatDistanceToNow(new Date(account?.createdAt), { addSuffix: true })} isAlternate={true} />
        </dl>
      </div>
    </div>
  );
};

const CorporateAccountView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: account, isLoading, isError, error } = useQuery({
    queryKey: ["corporateAccount", id],
    queryFn: () => getCorporateAccount(id),
    enabled: !!id,
  });

  const handleBack = useCallback(() => { navigate(-1); }, [navigate]);
  const handleEdit = useCallback(() => { navigate(`/corporate-accounts/${id}/edit`); }, [navigate, id]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} onBack={handleBack} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200">
      <div className="mb-6 flex justify-between items-center">
        <Button onClick={handleBack} className="flex items-center transition-colors duration-200">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Corporate Accounts
        </Button>
        <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-200">
          Edit Account
        </Button>
      </div>
      <div className="grid gap-6">
        <CorporateAccountDetailsCard account={account} />
      </div>
    </motion.div>
  );
};

export default CorporateAccountView;


