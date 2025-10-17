import React from 'react';

export const useStatusStyles = (status) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "VALID":
      case "ACTIVE":
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "EXPIRED":
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      case "EXPIRING_SOON":
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "PENDING_VERIFICATION":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return {
    colorClasses: getStatusColor(status)
  };
};

const StatusBadge = ({ status }) => {
  const { colorClasses } = useStatusStyles(status);
  const formatStatusText = (status) => {
    if (!status) return '';
    return status.replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${colorClasses}`}
      role="status"
      aria-label={`Status: ${formatStatusText(status)}`}
    >
      {formatStatusText(status)}
    </span>
  );
};

export default StatusBadge;