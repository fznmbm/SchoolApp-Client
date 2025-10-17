import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Table } from "@components/common/table/Table";
import { Button } from "@components/common/Button";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const TrainingIdCell = ({ row, navigate }) => (
  <button
    onClick={() => navigate(`/training/${row._id}`)}
    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
    aria-label={`View details for training ${row.trainingID}`}
  >
    {row.trainingID}
  </button>
);

const TrainingNameCell = ({ trainingName }) => (
  <div className="flex items-center">
    <AcademicCapIcon className="h-5 w-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
    <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {trainingName}
    </span>
  </div>
);

const CandidateTypeCell = ({ candidateType }) => (
  <div className="flex items-center">
    <UserIcon className="h-5 w-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
    <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {candidateType}
    </span>
  </div>
);

const StatusCell = ({ status }) => (
  <span 
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200
      ${status === 'Active' 
        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}
    aria-label={`Status: ${status}`}
  >
    {status === 'Active' ? (
      <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 transition-colors duration-200" />
    ) : (
      <XCircleIcon className="h-4 w-4 mr-1 text-red-500 dark:text-red-400 transition-colors duration-200" />
    )}
    {status}
  </span>
);

const CreatedDateCell = ({ date }) => (
  <span className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
    {new Date(date).toLocaleDateString()}
  </span>
);

const ActionsCell = ({ row, navigate, onDelete }) => (
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/training/${row._id}`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      title="View details"
      aria-label={`View details for ${row.trainingName}`}
    >
      <EyeIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/training/${row._id}/edit`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
      title="Edit training"
      aria-label={`Edit ${row.trainingName}`}
    >
      <PencilIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDelete(row)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
      title="Delete training"
      aria-label={`Delete ${row.trainingName}`}
    >
      <TrashIcon className="h-5 w-5" />
    </Button>
  </div>
);

const TrainingTable = ({ data, isLoading, pagination, onDelete }) => {
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      header: "Training ID",
      accessor: "trainingID",
      cell: (row) => <TrainingIdCell row={row} navigate={navigate} />
    },
    {
      header: "Training Name",
      accessor: "trainingName",
      cell: (row) => <TrainingNameCell trainingName={row.trainingName} />
    },
    {
      header: "Candidate Type",
      accessor: "candidateType",
      cell: (row) => <CandidateTypeCell candidateType={row.candidateType} />
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <StatusCell status={row.status} />
    },
    {
      header: "Created",
      accessor: "createdAt",
      cell: (row) => <CreatedDateCell date={row.createdAt} />
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => <ActionsCell row={row} navigate={navigate} onDelete={onDelete} />
    },
  ], [navigate, onDelete]);

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-lg shadow overflow-hidden border border-border-light dark:border-border-dark transition-colors duration-200">
      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        pagination={pagination}
      />
    </div>
  );
};

TrainingTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func
  }),
  onDelete: PropTypes.func.isRequired
};

TrainingTable.defaultProps = {
  data: [],
  isLoading: false
};

export default TrainingTable;