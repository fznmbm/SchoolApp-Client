import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Table } from "@components/common/table/Table";
import { Button } from "@components/common/Button";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const PANumberCell = ({ paNumber }) => (
  <div className="font-medium text-text-primary dark:text-text-dark-primary flex items-center transition-colors duration-200">
    {paNumber || "N/A"}
  </div>
);

const NameCell = ({ row, navigate }) => (
  <button
    onClick={() => navigate(`/pa/${row._id}`)}
    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
    aria-label={`View details for ${row.name}`}
  >
    {row.name}
  </button>
);

const ContactCell = ({ contact }) => (
  <div className="space-y-1">
    <div className="flex items-center text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      <PhoneIcon className="h-4 w-4 mr-1" />
      {contact?.phone || "N/A"}
    </div>
    <div className="flex items-center text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      <EnvelopeIcon className="h-4 w-4 mr-1" />
      {contact?.email || "N/A"}
    </div>
  </div>
);

const AddressCell = ({ address }) => (
  <div className="space-y-1">
    <div className="text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {address?.street || "N/A"}, {address?.city || "N/A"}, {address?.state || "N/A"}
    </div>
    <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      {address?.postCode || "N/A"}, {address?.country || "N/A"}
    </div>
  </div>
);

const StatusCell = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200
    ${
      status === 'ACTIVE'
        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
    }
  `}
  >
    {status === 'ACTIVE' ? 'Active' : 'Inactive'}
  </span>
);

const ActionsCell = ({ row, navigate, onDelete }) => (
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/pa/${row._id}`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      title="View details"
      aria-label={`View details for ${row.name}`}
    >
      <EyeIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/pa/${row._id}/edit`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
      title="Edit PA"
      aria-label={`Edit ${row.name}`}
    >
      <PencilIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDelete(row)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
      title="Delete PA"
      aria-label={`Delete ${row.name}`}
    >
      <TrashIcon className="h-5 w-5" />
    </Button>
  </div>
);

const PATable = ({ data, isLoading, pagination, onDelete }) => {
  const navigate = useNavigate();

  const activePAs = useMemo(() => {
    return Array.isArray(data) ? data.filter((pa) => pa.status === 'ACTIVE') : [];
  }, [data]);

  const columns = useMemo(() => [
    {
      header: "PA Number",
      accessor: "paNumber",
      cell: (row) => <PANumberCell paNumber={row.paNumber} />
    },
    {
      header: "Name",
      accessor: "name",
      cell: (row) => <NameCell row={row} navigate={navigate} />
    },
    {
      header: "Short Name",
      accessor: "shortName",
    },
    {
      header: "Contact",
      accessor: "contact",
      cell: (row) => <ContactCell contact={row.contact} />
    },
    {
      header: "Address",
      accessor: "address",
      cell: (row) => <AddressCell address={row.address} />
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <StatusCell status={row.status} />
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
        data={activePAs}
        isLoading={isLoading}
        pagination={pagination}
      />
    </div>
  );
};

PATable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func
  }),
  onDelete: PropTypes.func.isRequired
};

PATable.defaultProps = {
  data: [],
  isLoading: false
};

export default PATable;