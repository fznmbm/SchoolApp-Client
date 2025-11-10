import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "@services/route";
import { Table } from "@components/common/table/Table";
import { Button } from "@components/common/Button";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const JobTitleCell = ({ row, navigate }) => (
  <button
    onClick={() => navigate(`/jobs/${row._id}`)}
    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-left transition-colors duration-200"
    aria-label={`View details for ${row.title}`}
  >
    <div className="font-medium">{row.title}</div>
    <div className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      Route: {row.route?.name}
    </div>
  </button>
);

const DurationCell = ({ startDate, endDate }) => (
  <div className="space-y-1">
    <div className="flex items-center text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      <CalendarIcon className="h-4 w-4 mr-1" />
      From: {new Date(startDate).toLocaleDateString()}
    </div>
    <div className="flex items-center text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
      <CalendarIcon className="h-4 w-4 mr-1" />
      To: {new Date(endDate).toLocaleDateString()}
    </div>
  </div>
);

const StatusCell = ({ startDate, endDate }) => {
  if (!startDate || !endDate) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
        INVALID
      </span>
    );
  }

  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  let status = "";
  let statusClass = "";

  if (today < start) {
    status = "SCHEDULED";
    statusClass = "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
  } else if (today > end) {
    status = "COMPLETED";
    statusClass = "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300";
  } else {
    status = "IN PROGRESS";
    statusClass = "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${statusClass}`}
    >
      {status}
    </span>
  );
};

export const getJobStatus = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return "INVALID";
  }
  
  try {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
      return "SCHEDULED";
    } else if (today > end) {
      return "COMPLETED";
    } else {
      return "IN PROGRESS";
    }
  } catch (error) {
    return "INVALID";
  }
};

const ActionsCell = ({ row, navigate, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/jobs/${row._id}`)}
        className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        title="View job"
        aria-label={`View ${row.title}`}
      >
        <EyeIcon className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/jobs/${row._id}/edit`)}
        className="text-text-secondary dark:text-text-dark-secondary hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
        title="Edit job"
        aria-label={`Edit ${row.title}`}
      >
        <PencilIcon className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(row)}
        className="text-text-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
        title="Delete job"
        aria-label={`Delete ${row.title}`}
      >
        <TrashIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

const JobTable = ({ data, isLoading, filters, onFilterChange, pagination, onDelete }) => {
  const navigate = useNavigate();
  const [routeValue, setRouteValue] = useState(filters.route || "");
  const [statusValue, setStatusValue] = useState(filters.status || "");
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [fromDate, setFromDate] = useState(filters.startDateFrom ? filters.startDateFrom.substring(0,10) : "");
  const [toDate, setToDate] = useState(filters.startDateTo ? filters.startDateTo.substring(0,10) : "");

  useEffect(() => {
    setRouteValue(filters.route || "");
    setStatusValue(filters.status || "");
  }, [filters.route, filters.status]);

  const handleRouteChange = (e) => {
    const newRoute = e.target.value;
    setRouteValue(newRoute);
    onFilterChange({ ...filters, route: newRoute, page: 1 });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusValue(newStatus);
    onFilterChange({ ...filters, status: newStatus, page: 1 });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onFilterChange({ ...filters, search: value, page: 1 });
  };

  const handleFromDate = (e) => {
    const value = e.target.value;
    setFromDate(value);
    const iso = value ? `${value}T00:00:00.000Z` : "";
    onFilterChange({ ...filters, startDateFrom: iso, page: 1 });
  };

  const handleToDate = (e) => {
    const value = e.target.value;
    setToDate(value);
    const iso = value ? `${value}T23:59:59.999Z` : "";
    onFilterChange({ ...filters, startDateTo: iso, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setRouteValue("");
    setStatusValue("");
    setFromDate("");
    setToDate("");
    onFilterChange({
      ...filters,
      search: "",
      route: "",
      status: "",
      startDateFrom: "",
      startDateTo: "",
      page: 1,
    });
  };

  const jobs = useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    } else if (data.jobs && Array.isArray(data.jobs)) {
      return data.jobs;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    }

    return [];
  }, [data]);

  const {
    data: routesData,
    isLoading: isRoutesLoading
  } = useQuery({
    queryKey: ['routes'],
    queryFn: () => getRoutes({ limit: 100 }), 
    select: (data) => {
      const routesList = Array.isArray(data) ? data : (data?.data || []);
      return routesList.map(route => ({ id: route._id, name: `${route.routeNo} ${route.name || ''}` }));
    },
    staleTime: 5 * 60 * 1000 
  });

  const routes = useMemo(() => {
    if (!routesData) return [];
    return routesData.sort((a, b) => a.name.localeCompare(b.name));
  }, [routesData]);

  const statusOptions = [
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "IN PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" }
  ];

  const columns = useMemo(() => [
    {
      header: "Job Title",
      accessor: "title",
      cell: (row) => <JobTitleCell row={row} navigate={navigate} />
    },
    {
      header: "Duration",
      accessor: "duration",
      cell: (row) => <DurationCell startDate={row.startDate} endDate={row.endDate} />
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <StatusCell startDate={row.startDate} endDate={row.endDate} />
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <ActionsCell
          row={row}
          navigate={navigate}
          onDelete={onDelete}
        />
      )
    }
  ], [navigate, onDelete]);

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-lg shadow overflow-hidden border border-border-light dark:border-border-dark transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search title or route no."
            className="px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
          />
          <select
            value={routeValue}
            onChange={handleRouteChange}
            disabled={isRoutesLoading}
            className="px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md 
                       bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary 
                       focus:outline-none focus:ring-primary focus:border-primary 
                       transition-colors duration-200"
          >
            <option value="">All Routes</option>
            {isRoutesLoading ? (
              <option value="" disabled>Loading routes...</option>
            ) : (
              routes.map(route => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))
            )}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={handleFromDate}
            className="px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
          />
          <input
            type="date"
            value={toDate}
            onChange={handleToDate}
            className="px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
          />

          <select
            value={statusValue}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md 
                       bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark-primary 
                       focus:outline-none focus:ring-primary focus:border-primary 
                       transition-colors duration-200"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="ml-auto"
            title="Reset filters"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={jobs}
        isLoading={isLoading}
        pagination={pagination}
      />

      {/* Show info message if no data */}
      {jobs.length === 0 && !isLoading && (
        <div className="p-4 text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-t border-yellow-200 dark:border-yellow-900/50">
          <div className="mb-2">No jobs found. Try changing your filter or refreshing the page.</div>
        </div>
      )}
    </div>
  );
};

JobTable.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  isLoading: PropTypes.bool,
  filters: PropTypes.shape({
    route: PropTypes.string,
    status: PropTypes.string,
    page: PropTypes.number,
    limit: PropTypes.number
  }),
  onFilterChange: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func
  }),
  onDelete: PropTypes.func.isRequired
};

JobTable.defaultProps = {
  data: null,
  isLoading: false,
  filters: {
    route: "",
    status: "",
    page: 1,
    limit: 10
  }
};

export default JobTable;