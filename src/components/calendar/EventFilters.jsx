import React from 'react';

/**
 * Event type filter checkbox component
 */
const FilterCheckbox = ({ id, checked, onChange, color, label }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mr-1"
      />
      <label htmlFor={id} className="flex items-center cursor-pointer text-gray-700 dark:text-gray-300 transition-colors duration-200">
        <span className={`w-3 h-3 inline-block mr-1 bg-${color}-100 dark:bg-${color}-900/30 border border-${color}-200 dark:border-${color}-700 rounded transition-colors duration-200`}></span>
        <span>{label}</span>
      </label>
    </div>
  );
};

/**
 * Event filters section component
 */
const EventFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3 text-xs mt-3">
      <FilterCheckbox 
        id="filter-holiday"
        checked={filters.holiday}
        onChange={() => onFilterChange('holiday')}
        color="blue"
        label="School Holiday"
      />
      <FilterCheckbox 
        id="filter-temp-driver"
        checked={filters.tempDriver}
        onChange={() => onFilterChange('tempDriver')}
        color="yellow"
        label="Temp Driver"
      />
      <FilterCheckbox 
        id="filter-special-service"
        checked={filters.specialService}
        onChange={() => onFilterChange('specialService')}
        color="purple"
        label="Special Service"
      />
      <FilterCheckbox 
        id="filter-absence"
        checked={filters.absence}
        onChange={() => onFilterChange('absence')}
        color="red"
        label="Absence"
      />
    </div>
  );
};

export default EventFilters;