import React, { useMemo } from "react";
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

const AdminStatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200
      ${
        isActive
          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      }
    `}
    aria-label={isActive ? "Active status" : "Inactive status"}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

const AdminTable = ({ data, isLoading, pagination, onDelete }) => {
  const navigate = useNavigate();
  
  const activeAdmins = useMemo(() => {
    const adminsList = Array.isArray(data) ? data : (data?.data || []);
    return adminsList.filter((admin) => admin.isActive);
  }, [data]);

  const columns = useMemo(() => [
    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <button
          onClick={() => navigate(`/admins/${row._id}`)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
          aria-label={`View details for ${row.firstName} ${row.lastName}`}
        >
          {row.firstName} {row.lastName}
        </button>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      cell: (row) => (
        <div className="flex items-center text-sm text-text-primary dark:text-white transition-colors duration-200">
          <EnvelopeIcon className="h-4 w-4 mr-1" />
          {row.email || "N/A"}
        </div>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (row) => (
        <div className="flex items-center text-sm text-text-primary dark:text-white transition-colors duration-200">
          <PhoneIcon className="h-4 w-4 mr-1" />
          {row.phone || "N/A"}
        </div>
      ),
    },
    {
      header: "Last Login",
      accessor: "lastLogin",
      cell: (row) => (
        <div className="text-sm text-text-primary dark:text-white transition-colors duration-200">
          {row.lastLogin ? new Date(row.lastLogin).toLocaleString() : 'Never'}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      cell: (row) => <AdminStatusBadge isActive={row.isActive} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admins/${row._id}`)}
            className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            title="View details"
            aria-label={`View details for ${row.firstName} ${row.lastName}`}
          >
            <EyeIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admins/${row._id}/edit`)}
            className="text-gray-400 dark:text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
            title="Edit Admin"
            aria-label={`Edit ${row.firstName} ${row.lastName}`}
          >
            <PencilIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row)}
            className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            title="Delete Admin"
            aria-label={`Delete ${row.firstName} ${row.lastName}`}
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </div>
      ),
    },
  ], [navigate, onDelete]);

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-lg shadow dark:shadow-gray-800 overflow-hidden transition-colors duration-200">
      <Table
        columns={columns}
        data={activeAdmins}
        isLoading={isLoading}
        pagination={pagination}
        emptyStateMessage="No active administrators found"
      />
    </div>
  );
};

export default AdminTable;