import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Table } from "@components/common/table/Table";
import { Button } from "@components/common/Button";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const RouteNumberCell = ({ row, navigate }) => (
  <button
    onClick={() => navigate(`/routes/${row._id}`)}
    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
    aria-label={`View details for route ${row.routeNo}`}
  >
    {row.routeNo}
  </button>
);

const RouteNameCell = ({ name, poNumber, paPoNumber }) => (
  <div className="transition-colors duration-200">
    <div className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {name}
    </div>
    <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      {poNumber}
      {paPoNumber ? ` | PA: ${paPoNumber}` : ''}
    </div>
  </div>
);

const RoutePlannerCell = ({ planner }) => (
  <div className="transition-colors duration-200">
    <div className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {planner?.name || 'N/A'}
    </div>
    <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      {planner?.phone || 'No phone'}
    </div>
  </div>
);

const StopInfoCell = ({ stop }) => (
  <div className="transition-colors duration-200">
    <div className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
      {stop?.location || 'N/A'}
    </div>
    <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      {stop?.time || 'No time'}
    </div>
  </div>
);

const DriverInfoCell = ({ driver }) => {
  if (!driver) {
    return <span className="text-text-secondary dark:text-text-dark-secondary italic transition-colors duration-200">Not Assigned</span>;
  }

  return (
    <div className="flex items-center">
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors duration-200">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">
          {driver.name.charAt(0)}
        </span>
      </div>
      <div className="ml-2">
        <div className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          {driver.name}
        </div>
        <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
          {driver.phoneNumber}
        </div>
      </div>
    </div>
  );
};

const PAInfoCell = ({ isPANeeded, pa }) => {
  if (!isPANeeded) {
    return <span className="text-text-secondary dark:text-text-dark-secondary italic transition-colors duration-200">Not Required</span>;
  }

  if (!pa) {
    return <span className="text-amber-500 dark:text-amber-400 transition-colors duration-200">Required - Not Assigned</span>;
  }

  return (
    <div className="transition-colors duration-200">
      <div className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        {pa.name}
      </div>
      <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        {pa.phoneNumber}
      </div>
    </div>
  );
};

const ActionsCell = ({ row, navigate, onDelete }) => (
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/routes/${row._id}`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      title="View route details"
      aria-label={`View details for route ${row.routeNo}`}
    >
      <EyeIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/routes/${row._id}/edit`)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
      title="Edit Route"
      aria-label={`Edit route ${row.routeNo}`}
    >
      <PencilIcon className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDelete(row)}
      className="text-text-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
      title="Delete Route"
      aria-label={`Delete route ${row.routeNo}`}
    >
      <TrashIcon className="h-5 w-5" />
    </Button>
  </div>
);

const RouteTable = ({ data, isLoading, pagination, onDelete = () => {} }) => {
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      header: "Route No",
      accessor: "routeNo",
      cell: (row) => <RouteNumberCell row={row} navigate={navigate} />
    },
    {
      header: "Name",
      accessor: "name",
      cell: (row) => <RouteNameCell name={row.name} poNumber={row.poNumber} paPoNumber={row.paPoNumber} />
    },
    {
      header: "Route Planner",
      accessor: "routePlanner.name",
      cell: (row) => <RoutePlannerCell planner={row.routePlanner} />
    },
    {
      header: "Starting Stop",
      accessor: "stops.startingStop.location",
      cell: (row) => <StopInfoCell stop={row.stops?.startingStop} />
    },
    {
      header: "Ending Stop",
      accessor: "stops.endingStop.location",
      cell: (row) => <StopInfoCell stop={row.stops?.endingStop} />
    },
    {
      header: "Driver",
      accessor: "permanentDriver.name",
      cell: (row) => <DriverInfoCell driver={row.permanentDriver} />
    },
    {
      header: "PA",
      accessor: "pa.name",
      cell: (row) => <PAInfoCell isPANeeded={row.isPANeeded} pa={row.pa} />
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

RouteTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func
  }),
  onDelete: PropTypes.func
};

RouteTable.defaultProps = {
  data: [],
  isLoading: false,
  onDelete: () => {}
};

export default RouteTable;