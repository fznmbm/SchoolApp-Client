import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteStudentById, getStudentsWithLabels, getStudentLabels } from '@services/student';
import { getAllSchools } from '@services/school';
import StudentTable from '@components/tables/StudentTable';
import { Button } from '@components/common/Button';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  XCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
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
          {message || "An error occurred while fetching students"}
        </p>
      </div>
    </div>
  </div>
);

// Page Header Component
const PageHeader = ({ onAddClick }) => (
  <div className="flex justify-between mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        Students
      </h1>
      <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Manage student information
      </p>
    </div>
    <Button
      onClick={onAddClick}
      className="flex items-center transition-colors duration-200"
    >
      <PlusIcon className="w-5 h-5 mr-2" />
      Add Student
    </Button>
  </div>
);

const StudentList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    school: '',
    hasSpecialCareNeeds: '',
    labelIds: [],
    assignedRoute: ''
  });
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGroupedByLabel, setIsGroupedByLabel] = useState(false);
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);

  // Fetch students with searchParams
  const { data, isLoading, error } = useQuery({
    queryKey: ['students', searchParams],
    queryFn: () => getStudentsWithLabels(searchParams),
  });

  // Fetch schools for filtering
  const { data: schoolsData } = useQuery({
    queryKey: ['schools'],
    queryFn: () => getAllSchools({ limit: 100 }),
  });

  // Fetch labels for filtering - only route-based labels
  const { data: labelsData } = useQuery({
    queryKey: ['student-labels'],
    queryFn: () => getStudentLabels().then(res => res.data),
  });

  const queryClient = useQueryClient();
  const { 
    mutate: deleteStudent,
    isError: isDeleteError,
    error: deleteError
  } = useMutation({
    mutationFn: (id) => deleteStudentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      setIsDeletePopupOpen(false);
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleDelete = useCallback((student) => {
    setStudentToDelete(student);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (studentToDelete) {
      deleteStudent(studentToDelete._id); 
    }
  }, [deleteStudent, studentToDelete]);

  const handleSearchChange = useCallback((e) => {
    setSearchParams(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchParams({
      page: 1,
      limit: 10,
      search: '',
      school: '',
      hasSpecialCareNeeds: '',
      labelIds: [],
      assignedRoute: ''
    });
    setSelectedLabelIds([]);
    setIsGroupedByLabel(false);
  }, []);

  // Process students for grouping and filtering
  const processedStudents = useMemo(() => {
    if (!data?.data) return [];
    
    let filtered = [...data.data];
    
    // Apply label filters if any are selected
    if (selectedLabelIds.length > 0) {
      filtered = filtered.filter(student => 
        student.labels?.some(label => selectedLabelIds.includes(label._id))
      );
    }
    
    // Group by labels if enabled
    if (isGroupedByLabel) {
      const groups = {};
      filtered.forEach(student => {
        if (!student.labels?.length) {
          groups['Unlabeled'] = groups['Unlabeled'] || [];
          groups['Unlabeled'].push(student);
        } else {
          student.labels.forEach(label => {
            groups[label.name] = groups[label.name] || [];
            groups[label.name].push(student);
          });
        }
      });
      return groups;
    }
    
    return filtered;
  }, [data?.data, selectedLabelIds, isGroupedByLabel]);

  const handleLabelSelect = useCallback((labelId) => {
    setSelectedLabelIds(prev => {
      const newSelection = prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId];
      
      setSearchParams(prevParams => ({
        ...prevParams,
        labelIds: newSelection,
        page: 1
      }));
      
      return newSelection;
    });
  }, []);

  const toggleGroupByLabel = useCallback(() => {
    setIsGroupedByLabel(prev => !prev);
  }, []);

  const navigateToCreate = useCallback(() => {
    navigate('/students/create');
  }, [navigate]);

  const toggleFilterSection = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  const renderFilterSection = () => {
    if (!isFilterOpen) return null;

    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg p-4 mb-4 transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1 transition-colors duration-200">
              School
            </label>
            <select
              value={searchParams.school}
              onChange={(e) => setSearchParams(prev => ({
                ...prev, 
                school: e.target.value,
                page: 1
              }))}
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md 
                         bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary 
                         focus:outline-none focus:ring-primary focus:border-primary 
                         transition-colors duration-200"
            >
              <option value="">All Schools</option>
              {(Array.isArray(schoolsData) ? schoolsData : schoolsData?.data)?.map(school => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1 transition-colors duration-200">
              Special Care Needs
            </label>
            <select
              value={searchParams.hasSpecialCareNeeds}
              onChange={(e) => setSearchParams(prev => ({
                ...prev, 
                hasSpecialCareNeeds: e.target.value,
                page: 1
              }))}
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md 
                         bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary 
                         focus:outline-none focus:ring-primary focus:border-primary 
                         transition-colors duration-200"
            >
              <option value="">All Students</option>
              <option value="true">With Special Needs</option>
              <option value="false">Without Special Needs</option>
            </select>
          </div>
        </div>

        {/* Label Filter Section */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2 transition-colors duration-200">
            Filter by Route Labels
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {labelsData?.map(label => (
              <button
                key={label._id}
                onClick={() => handleLabelSelect(label._id)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedLabelIds.includes(label._id)
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300 bg-opacity-10 hover:bg-opacity-20'
                }`}
                style={{
                  backgroundColor: selectedLabelIds.includes(label._id) ? label.color : 'transparent',
                  borderColor: label.color,
                  borderWidth: '1px'
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={isGroupedByLabel ? 'primary' : 'outline'}
              size="sm"
              onClick={toggleGroupByLabel}
              className="flex items-center"
            >
              <TagIcon className="h-4 w-4 mr-1" />
              {isGroupedByLabel ? 'Ungroup' : 'Group by Label'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200"
    >
      <PageHeader onAddClick={navigateToCreate} />

      {error && <ErrorAlert message={error?.message} />}
      {isDeleteError && <ErrorAlert message={deleteError?.message} />}

      {/* Search and Filter Section */}
      <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors duration-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchParams.search}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-border-light dark:border-border-dark-mode 
                       rounded-md bg-white dark:bg-surface-dark placeholder-text-secondary 
                       dark:placeholder-text-dark-secondary text-text-primary dark:text-text-dark-primary 
                       focus:outline-none focus:ring-primary focus:border-primary 
                       transition-colors duration-200"
            />
          </div>
          
          <button
            onClick={toggleFilterSection}
            className={`p-2 rounded-md transition-colors duration-200 ${
              isFilterOpen 
                ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark' 
                : 'text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Toggle Filters"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>

          {(searchParams.hasSpecialCareNeeds || 
            searchParams.school || 
            selectedLabelIds.length > 0 ||
            isGroupedByLabel) && (
            <button
              onClick={clearFilters}
              className="text-error dark:text-error-dark hover:text-error/80 dark:hover:text-error-dark/80 flex items-center transition-colors duration-200"
              title="Clear Filters"
            >
              <XCircleIcon className="h-5 w-5 mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Section */}
        {renderFilterSection()}
      </div>

      {/* The StudentTable component */}
      {isGroupedByLabel ? (
        <div className="space-y-6">
          {Object.entries(processedStudents).map(([labelName, students]) => (
            <div key={labelName} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors duration-200">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {labelName} ({students.length} students)
                </h3>
              </div>
              <StudentTable
                data={students}
                isLoading={false}
                pagination={null}
                onView={(student) => navigate(`/students/${student._id}`)}
                onEdit={(student) => navigate(`/students/${student._id}/edit`)}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        <StudentTable
          data={processedStudents}
          isLoading={isLoading}
          pagination={{
            currentPage: parseInt(searchParams.page),
            totalPages: data?.totalPages || 1,
            total: data?.total || 0,
            onPageChange: handlePageChange,
          }}
          onView={(student) => navigate(`/students/${student._id}`)}
          onEdit={(student) => navigate(`/students/${student._id}/edit`)}
          onDelete={handleDelete}
        />
      )}

      {/* Delete Confirmation Popup */}
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this student? This action cannot be undone."
        title="Delete Student"
        confirmButtonProps={{
          className: "bg-error hover:bg-error/80 transition-colors duration-200"
        }}
      />
    </motion.div>
  );
};

export default StudentList;