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
  MapPinIcon,
} from "@heroicons/react/24/outline";

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

const AddressCell = ({ contact }) => (
  <div className="space-y-1">
    <div className="flex items-center text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      <MapPinIcon className="h-4 w-4 mr-1" />
      {contact?.address?.street || "N/A"}
    </div>
    <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      {contact?.address?.city || "N/A"}, {contact?.address?.postCode || "N/A"}
    </div>
  </div>
);

const ActionsCell = ({ row, navigate, onDelete }) => (
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/corporate-accounts/${row._id}`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      title="View details"
      aria-label={`View details for ${row.companyName}`}
    >
      <EyeIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/corporate-accounts/${row._id}/edit`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
      title="Edit account"
      aria-label={`Edit ${row.companyName}`}
    >
      <PencilIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDelete(row)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
      title="Delete account"
      aria-label={`Delete ${row.companyName}`}
    >
      <TrashIcon className="h-5 w-5" />
    </Button>
  </div>
);

const CorporateAccountTable = ({ data, isLoading, pagination, onDelete }) => {
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      header: "Account ID",
      accessor: "corporateAccountID",
      cell: (row) => (
        <button
          onClick={() => navigate(`/corporate-accounts/${row._id}`)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
          aria-label={`View details for ${row.companyName}`}
        >
          {row.corporateAccountID}
        </button>
      ),
    },
    {
      header: "Company Name",
      accessor: "companyName",
    },
    {
      header: "Contact",
      accessor: "contact",
      cell: (row) => <ContactCell contact={row.contact} />,
    },
    {
      header: "Address",
      accessor: "address",
      cell: (row) => <AddressCell contact={row.contact} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <ActionsCell row={row} navigate={navigate} onDelete={onDelete} />
      ),
    },
  ], [navigate, onDelete]);

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-lg shadow overflow-hidden transition-colors duration-200">
      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        pagination={pagination}
      />
    </div>
  );
};

CorporateAccountTable.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  pagination: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
};

CorporateAccountTable.defaultProps = {
  data: [],
  isLoading: false,
};

export default CorporateAccountTable;


