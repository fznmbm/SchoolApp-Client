import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@components/common/table/Table';
import { Button } from '@components/common/Button';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  HeartIcon 
} from '@heroicons/react/24/outline';

const Badge = ({ children, color = 'gray', className = '' }) => {
  const colorClasses = {
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    yellow: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100',
    red: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
};

const InitialsAvatar = ({ firstName, lastName, className = '' }) => (
  <div className={`h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center transition-colors duration-200 ${className}`}>
    <span className="text-sm font-medium text-blue-600 dark:text-blue-300 transition-colors duration-200">
      {firstName.charAt(0)}{lastName.charAt(0)}
    </span>
  </div>
);

const StudentTable = ({ 
  data, 
  isLoading, 
  pagination, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const columns = [
    {
      header: 'Name',
      accessor: 'fullName',
      cell: (row) => (
        <div className="flex items-center">
          <InitialsAvatar firstName={row.firstName} lastName={row.lastName} />
          <div className="ml-2">
            <div className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
              {row.firstName} {row.lastName}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Grade',
      accessor: 'grade',
      cell: (row) => (
        <Badge color="gray">Grade {row.grade}</Badge>
      ),
    },
    {
      header: 'School',
      accessor: 'school.name',
      cell: (row) => (
        <div className="text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          {row.school?.name || 'Not Assigned'}
        </div>
      ),
    },
    {
      header: 'Special Care',
      accessor: 'specialCareNeeds',
      cell: (row) => {
        const hasSpecialCareNeeds = row.specialCareNeeds && row.specialCareNeeds.length > 0;
        return (
          <div>
            {hasSpecialCareNeeds ? (
              <Badge color="yellow">
                <HeartIcon className="h-4 w-4 mr-1" />
                {row.specialCareNeeds.length} Need{row.specialCareNeeds.length > 1 ? 's' : ''}
              </Badge>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 italic transition-colors duration-200">No Special Needs</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Parent Contact',
      accessor: 'parents',
      cell: (row) => {
        const primaryParent = row.parents?.[0];
        if (!primaryParent) return <span className="text-gray-500 dark:text-gray-400 italic transition-colors duration-200">No contact</span>;
        
        return (
          <div className="text-sm">
            <div className="font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">{primaryParent.name}</div>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(row)}
            className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            title={`View details for ${row.firstName} ${row.lastName}`}
            aria-label={`View details for ${row.firstName} ${row.lastName}`}
          >
            <EyeIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row)}
            className="text-gray-400 dark:text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
            title={`Edit ${row.firstName} ${row.lastName}`}
            aria-label={`Edit ${row.firstName} ${row.lastName}`}
          >
            <PencilIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row)}
            className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            title={`Delete ${row.firstName} ${row.lastName}`}
            aria-label={`Delete ${row.firstName} ${row.lastName}`}
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-lg shadow dark:shadow-gray-900 overflow-hidden transition-colors duration-200">
      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        pagination={pagination}
      />
    </div>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['gray', 'blue', 'yellow', 'red', 'green']),
  className: PropTypes.string,
};

InitialsAvatar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  className: PropTypes.string,
};

StudentTable.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  pagination: PropTypes.object,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default StudentTable;