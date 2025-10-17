import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "@components/common/table/Table";
import { Button } from "@components/common/Button";
import { ThemeContext } from "@context/ThemeContext";
import {
  CheckCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const SchoolNameCell = ({ row, navigate }) => (
  <button
    onClick={() => navigate(`/schools/${row._id}`)}
    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
    aria-label={`View details for ${row.name}`}
  >
    {row.name}
  </button>
);

const ContactInfoCell = ({ contact }) => (
  <div className="space-y-1">
    <div className="text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {contact?.contactPerson || "N/A"}
    </div>
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
      <PhoneIcon className="h-4 w-4 mr-1" />
      {contact?.phone || "N/A"}
    </div>
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
      <EnvelopeIcon className="h-4 w-4 mr-1" />
      {contact?.email || "N/A"}
    </div>
  </div>
);

const AddressCell = ({ address }) => (
  <div className="space-y-1">
    <div className="text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {address?.street || "N/A"}
    </div>
    <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
      {address?.city || "N/A"}, {address?.county || "N/A"}
    </div>
    <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
      {address?.postCode || "N/A"}
    </div>
  </div>
);

const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200
    ${
      isActive
        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
    `}
    aria-label={isActive ? "Active" : "Inactive"}
  >
    {isActive ? (
      <>
        <CheckCircleIcon className="w-4 h-4 mr-1" />
        <span>Active</span>
      </>
    ) : (
      <>
        <XCircleIcon className="w-4 h-4 mr-1" />
        <span>Inactive</span>
      </>
    )}
  </span>
);

const ActionButtons = ({ row, navigate, onDelete }) => (
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/schools/${row._id}`)}
      className="text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 border-border-light dark:border-border-dark-mode transition-colors duration-200"
      title="View details"
      aria-label={`View details for ${row.name}`}
    >
      <EyeIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/schools/${row._id}/edit`)}
      className="text-gray-400 hover:text-yellow-600 dark:text-gray-500 dark:hover:text-yellow-400 border-border-light dark:border-border-dark-mode transition-colors duration-200"
      title="Edit School"
      aria-label={`Edit ${row.name}`}
    >
      <PencilIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDelete(row)}
      className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 border-border-light dark:border-border-dark-mode transition-colors duration-200"
      title="Delete School"
      aria-label={`Delete ${row.name}`}
    >
      <TrashIcon className="h-5 w-5" />
    </Button>
  </div>
);


const SchoolTable = ({ data, isLoading, pagination, onDelete }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  
  const activeSchools = useMemo(
    () => data?.filter((school) => school.isActive) || [],
    [data]
  );
  
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessor: "name",
        cell: (row) => <SchoolNameCell row={row} navigate={navigate} />,
      },
      {
        header: "Contact Person",
        accessor: "contact",
        cell: (row) => <ContactInfoCell contact={row.contact} />,
      },
      {
        header: "Address",
        accessor: "address",
        cell: (row) => <AddressCell address={row.address} />,
      },
      {
        header: "Status",
        accessor: "isActive",
        cell: (row) => <StatusBadge isActive={row.isActive} />,
      },
      {
        header: "Actions",
        accessor: "actions",
        cell: (row) => (
          <ActionButtons row={row} navigate={navigate} onDelete={onDelete} />
        ),
      },
    ],
    [navigate, onDelete]
  );

  return (
    <div 
      className="bg-surface dark:bg-surface-dark rounded-lg shadow overflow-hidden border border-border-light dark:border-border-dark-mode transition-colors duration-200"
      role="region"
      aria-label="Schools table"
    >
      <Table
        columns={columns}
        data={activeSchools}
        isLoading={isLoading}
        pagination={pagination}
      />
    </div>
  );
};

export default SchoolTable;