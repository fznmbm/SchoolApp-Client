import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCorporateAccount, getAllCorporateAccounts } from '@services/corporateAccount';
import CorporateAccountTable from '@components/tables/CorporateAccountTable';
import { Button } from '@components/common/Button';
import { ExclamationCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import Popup from '@components/common/modal/Popup';

const ErrorAlert = ({ message }) => (
  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-200">
    <div className="flex">
      <ExclamationCircleIcon className="h-5 w-5 text-red-400 dark:text-red-300" aria-hidden="true" />
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800 dark:text-red-300 transition-colors duration-200">
          {message || 'An error occurred while deleting the corporate account'}
        </p>
      </div>
    </div>
  </div>
);

const SearchInput = ({ value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
    </div>
    <input
      type="text"
      placeholder="Search corporate accounts by ID, name, or email"
      value={value}
      onChange={onChange}
      className="block w-full pl-10 pr-3 py-2 border border-border-light dark:border-border-dark rounded-md leading-5 
                bg-surface dark:bg-surface-dark 
                text-text-primary dark:text-text-dark-primary
                placeholder-gray-500 dark:placeholder-gray-400 
                focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 
                transition-colors duration-200 sm:text-sm"
      aria-label="Search corporate accounts"
    />
  </div>
);

const PageHeader = ({ onAddClick }) => (
  <div className="flex justify-between mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        Corporate Accounts
      </h1>
      <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Manage corporate accounts and their information
      </p>
    </div>
    <Button onClick={onAddClick} className="flex items-center transition-colors duration-200">
      <PlusIcon className="w-5 h-5 mr-2" />
      Add Corporate Account
    </Button>
  </div>
);

const CorporateAccountList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10, search: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['corporateAccounts', searchParams],
    queryFn: () => getAllCorporateAccounts(searchParams),
  });

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const queryClient = useQueryClient();
  const { mutate: deleteAccountHandler, isError: isDeleteError, error: deleteError } = useMutation({
    mutationFn: (id) => deleteCorporateAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['corporateAccounts']);
      setIsDeletePopupOpen(false);
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((e) => {
    const searchTerm = e.target.value;
    setSearchParams((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const handleDelete = useCallback((account) => {
    setAccountToDelete(account);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (accountToDelete) {
      deleteAccountHandler(accountToDelete._id);
    }
  }, [accountToDelete, deleteAccountHandler]);

  const navigateToCreate = useCallback(() => {
    navigate('/corporate-accounts/create');
  }, [navigate]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      <PageHeader onAddClick={navigateToCreate} />

      <div className="mb-4">
        <SearchInput value={searchParams.search} onChange={handleSearch} />
      </div>

      {isDeleteError && <ErrorAlert message={deleteError?.message} />}

      <CorporateAccountTable
        data={data?.data}
        isLoading={isLoading}
        pagination={{
          currentPage: searchParams.page,
          totalPages: data?.totalPages || 1,
          totalItems: data?.total || 0,
          onPageChange: handlePageChange,
        }}
        onDelete={handleDelete}
      />

      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this corporate account? This action cannot be undone."
        title="Delete Corporate Account"
      />
    </motion.div>
  );
};

export default CorporateAccountList;


