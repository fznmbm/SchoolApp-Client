import React from "react";

export const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${getStatusColor(status)}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
};

export const TimeOfDayBadge = ({ timeOfDay }) => {
  const getTimeOfDayColor = (timeOfDay) => {
    switch (timeOfDay) {
      case "MORNING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "EVENING":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300";
      case "BOTH":
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
    }
  };

  const formatTimeOfDay = (timeOfDay) => {
    switch (timeOfDay) {
      case "MORNING":
        return "Morning only";
      case "EVENING":
        return "Evening only";
      case "BOTH":
      default:
        return "Morning & Evening";
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${getTimeOfDayColor(timeOfDay)}`}
      aria-label={`Time of day: ${formatTimeOfDay(timeOfDay)}`}
    >
      {formatTimeOfDay(timeOfDay)}
    </span>
  );
};

export const ServiceTypeBadge = ({ type }) => {
  const getServiceTypeColor = (type) => {
    switch (type) {
      case "EARLY_PICKUP":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300";
      case "LATE_PICKUP":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300";
      case "EXTRA_PICKUP":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300";
      case "OTHER":
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const formatServiceType = (type) => {
    switch (type) {
      case "EARLY_PICKUP":
        return "Early Pickup";
      case "LATE_PICKUP":
        return "Late Pickup";
      case "EXTRA_PICKUP":
        return "Extra Pickup";
      case "OTHER":
      default:
        return "Other";
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${getServiceTypeColor(type)}`}
      aria-label={`Service type: ${formatServiceType(type)}`}
    >
      {formatServiceType(type)}
    </span>
  );
};