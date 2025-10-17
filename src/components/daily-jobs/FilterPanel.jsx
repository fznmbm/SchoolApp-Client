import React from 'react';
import Card from '@components/common/Card';
import Input from '@components/common/input/Input';
import { Button } from '@components/common/Button';

const FilterPanel = ({ filters, onFilterChange, onApplyFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    return (
        <Card 
            id="filter-panel"
            className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       shadow-sm dark:shadow-gray-900 transition-colors duration-200"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label 
                        htmlFor="status" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                                  text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 
                                  transition-colors duration-200"
                        value={filters.status}
                        onChange={handleChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="RENEWED">Renewed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label 
                        htmlFor="route" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                    >
                        Route
                    </label>
                    <Input
                        id="route"
                        name="route"
                        value={filters.route}
                        onChange={handleChange}
                        placeholder="Route Number"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                  border-gray-300 dark:border-gray-600 transition-colors duration-200"
                    />
                </div>

                <div>
                    <label 
                        htmlFor="driver" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
                    >
                        Driver
                    </label>
                    <Input
                        id="driver"
                        name="driver"
                        value={filters.driver}
                        onChange={handleChange}
                        placeholder="Driver Name"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                  border-gray-300 dark:border-gray-600 transition-colors duration-200"
                    />
                </div>

                <div className="flex items-end">
                    <Button 
                        onClick={onApplyFilters} 
                        className="w-full"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default FilterPanel;