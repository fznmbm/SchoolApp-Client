import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSchoolById, getAllSchools } from '@services/school';
import SchoolTable from '@components/tables/SchoolTable';
import { Button } from '@components/common/Button';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import Popup from '@components/common/modal/Popup';
import { ThemeContext } from '@context/ThemeContext';

const SchoolList = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const queryClient = useQueryClient();
  
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
  });

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['schools', searchParams],
    queryFn: () => getAllSchools(searchParams),
  });
  
  const { mutate: deleteSchool } = useMutation({
    mutationFn: (id) => deleteSchoolById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['schools']);
      setIsDeletePopupOpen(false);
      setSchoolToDelete(null);
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleDelete = useCallback((school) => {
    setSchoolToDelete(school);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (schoolToDelete) {
      deleteSchool(schoolToDelete._id); 
    }
  }, [deleteSchool, schoolToDelete]);

  const paginationProps = useMemo(() => ({
    currentPage: searchParams.page,
    totalPages: data?.totalPages || 1,
    onPageChange: handlePageChange,
  }), [searchParams.page, data?.totalPages, handlePageChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200"
    >
      <div className="flex justify-between mb-6">
        <div>
          <h1 
            className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200"
            id="page-heading"
          >
            Schools
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
            Manage schools and their information
          </p>
        </div>
        <Button
          onClick={() => navigate('/schools/create')}
          className="flex items-center transition-colors duration-200"
          aria-label="Add new school"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add School
        </Button>
      </div>

      <div 
        className="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark-mode rounded-lg overflow-hidden shadow-sm transition-colors duration-200"
        aria-labelledby="page-heading"
      >
        <SchoolTable
          data={data}
          isLoading={isLoading}
          pagination={paginationProps}
          onDelete={handleDelete}
        />
      </div>
      
      {/* Delete Confirmation Popup */}
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${schoolToDelete?.name || 'this school'}? This action cannot be undone.`}
        title="Delete School"
      />
    </motion.div>
  );
};

export default SchoolList;