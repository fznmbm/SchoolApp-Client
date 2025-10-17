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
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const NameCell = ({ row, navigate }) => (
  <button
    onClick={() => navigate(`/vendors/${row._id}`)}
    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
    aria-label={`View details for ${row.name}`}
  >
    {row.name}
  </button>
);

const AddressCell = ({ address }) => (
  <div className="space-y-1">
    <div className="text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {address?.street || "N/A"}, {address?.city || "N/A"}, {address?.county || "N/A"}
    </div>
    <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      {address?.postCode || "N/A"}, {address?.country || "N/A"}
    </div>
  </div>
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

const ActionsCell = ({ row, navigate, onDelete }) => (
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/vendors/${row._id}`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 dark:border-border-dark transition-colors duration-200"
      title="View details"
      aria-label={`View details for ${row.name}`}
    >
      <EyeIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/vendors/${row._id}/edit`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-yellow-600 dark:hover:text-yellow-400 dark:border-border-dark transition-colors duration-200"
      title="Edit Vendor"
      aria-label={`Edit ${row.name}`}
    >
      <PencilIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDelete(row)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400 dark:border-border-dark transition-colors duration-200"
      title="Delete Vendor"
      aria-label={`Delete ${row.name}`}
    >
      <TrashIcon className="h-5 w-5" />
    </Button>
  </div>
);

const VendorTable = ({ data, isLoading, pagination, onDelete }) => {
  const navigate = useNavigate();

  const activeVendors = useMemo(() => {
    return Array.isArray(data) ? data.filter((vendor) => vendor.status === 'Active') : [];
  }, [data]);

  const columns = useMemo(() => [
    {
      header: "Name",
      accessor: "name",
      cell: (row) => <NameCell row={row} navigate={navigate} />
    },
    {
      header: "Address",
      accessor: "address",
      cell: (row) => <AddressCell address={row.address} />
    },
    {
      header: "Contact",
      accessor: "contact",
      cell: (row) => <ContactCell contact={row.contact} />
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
    <div className="bg-surface dark:bg-surface-dark rounded-lg shadow dark:shadow-gray-900 overflow-hidden border border-border-light dark:border-border-dark transition-colors duration-200">
      <Table
        columns={columns}
        data={activeVendors}
        isLoading={isLoading}
        pagination={pagination}
      />
    </div>
  );
};

VendorTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func
  }),
  onDelete: PropTypes.func.isRequired
};

VendorTable.defaultProps = {
  data: [],
  isLoading: false
};

export default VendorTable;