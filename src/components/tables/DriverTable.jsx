import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "@components/common/table/Table";
import { Button } from "@components/common/Button";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const StatusBadge = ({ status }) => (
  <span 
    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
      status === 'ACTIVE' 
        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    }`}
    aria-label={`Driver status: ${status}`}
  >
    {status}
  </span>
);

const DriverAvatar = ({ name }) => (
  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2 transition-colors duration-200">
    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">
      {name.charAt(0)}
    </span>
  </div>
);

const DriverTable = ({ data, isLoading, pagination, onDelete = () => {} }) => {
  const navigate = useNavigate();

  const activeDrivers = useMemo(() => {
    return data?.filter(driver => driver.isActive) || [];
  }, [data]);

  const columns = useMemo(() => [
    {
      header: "Driver Number",
      accessor: "driverNumber",
      cell: (row) => (
        <button
          onClick={() => navigate(`/drivers/${row._id}`)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
          aria-label={`View details for driver ${row.driverNumber}`}
        >
          {row.driverNumber}
        </button>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center">
          <DriverAvatar name={row.name} />
          <span className="text-text-primary dark:text-white transition-colors duration-200">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      cell: (row) => (
        <span className="text-text-primary dark:text-white transition-colors duration-200">
          {row.email}
        </span>
      ),
    },
    {
      header: "Nationality",
      accessor: "nationality",
      cell: (row) => (
        <span className="text-text-primary dark:text-white uppercase transition-colors duration-200">
          {row.nationality}
        </span>
      ),
    },
    {
      header: "Vehicle",
      accessor: "vehicle",
      cell: (row) => (
        <div className="text-text-primary dark:text-white transition-colors duration-200">
          {row.vehicle ? (
            <>
              <span>{row.vehicle.make} {row.vehicle.model}</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                {row.vehicle.registrationNumber}
              </div>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400 italic transition-colors duration-200">
              No Vehicle
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/drivers/${row._id}`)}
            className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            title="View driver details"
            aria-label={`View details for driver ${row.name}`}
          >
            <EyeIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/drivers/${row._id}/edit`)}
            className="text-gray-400 dark:text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
            title="Edit Driver"
            aria-label={`Edit driver ${row.name}`}
          >
            <PencilIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row)}
            className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            title="Delete Driver"
            aria-label={`Delete driver ${row.name}`}
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
        data={activeDrivers}
        isLoading={isLoading}
        pagination={{
          ...pagination,
          totalPages: Math.ceil(activeDrivers.length / (pagination?.limit || 10))
        }}
        emptyStateMessage="No active drivers found"
      />
    </div>
  );
};

export default DriverTable;