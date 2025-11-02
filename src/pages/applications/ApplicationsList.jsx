import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Button } from '@components/common/Button';
import Table from '../../components/common/table/Table';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { getApplications } from '../../services/application';

const ApplicationsList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);



  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };



  const columns = [
    {
      header: 'Submission Date',
      accessor: 'submittedAt',
      cell: (row) => row.submittedAt ? new Date(row.submittedAt).toLocaleDateString() : '-'
    },
    {
      header: 'Position',
      accessor: 'position',
      cell: (row) => row.position || '-'
    },
    {
      header: 'Name',
      accessor: 'fullName',
      cell: (row) => row.fullName || '-'
    },
    {
      header: 'Email',
      accessor: 'email',
      cell: (row) => row.email || '-'
    },
    {
      header: 'Phone',
      accessor: 'phoneNumber',
      cell: (row) => row.phoneNumber || '-'
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const status = row.status || 'pending';
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'approved' ? 'bg-green-900 text-green-300' :
            status === 'rejected' ? 'bg-red-900 text-red-300' :
            status === 'reviewed' ? 'bg-blue-900 text-blue-300' :
            'bg-gray-700 text-gray-300'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/applications/${row._id}`)}
            className="text-text-secondary dark:text-text-dark-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            title="View Details"
            aria-label={`View application for ${row.fullName}`}
          >
            <EyeIcon className="h-5 w-5" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="bg-red-50 border-red-200">
          <div className="text-red-700">Error: {error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-2">Applications</h1>
        <p className="text-text-secondary dark:text-gray-300">Manage driver and PA applications</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-light dark:border-border-dark transition-colors duration-200">
          <div className="text-sm text-text-secondary dark:text-gray-300">Total Applications</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{applications.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-light dark:border-border-dark transition-colors duration-200">
          <div className="text-sm text-text-secondary dark:text-gray-300">Approved</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {applications.filter(app => app.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-light dark:border-border-dark transition-colors duration-200">
          <div className="text-sm text-text-secondary dark:text-gray-300">Rejected</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {applications.filter(app => app.status === 'rejected').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-light dark:border-border-dark transition-colors duration-200">
          <div className="text-sm text-text-secondary dark:text-gray-300">Pending</div>
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {applications.filter(app => app.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-light dark:border-border-dark transition-colors duration-200">
        <Table
          columns={columns}
          data={applications}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ApplicationsList;