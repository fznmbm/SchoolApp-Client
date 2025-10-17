import React, { useContext } from 'react';
import Input from "@components/common/input/Input";
import Select from "@components/common/input/Select";
import { VEHICLE_TYPES } from '@utils/driverFormHelpers';
import { ThemeContext } from '@/context/ThemeContext';

const VehicleInformation = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="transition-colors duration-200 ease-in-out">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
        Vehicle Information
      </h3>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 mt-4">
        <Input
          label="Registration Number"
          name="vehicle.registrationNumber"
          type="text"
          placeholder="Enter registration number"
        />
        <Select
          label="Vehicle Type"
          name="vehicle.type"
          options={VEHICLE_TYPES}
        />
        <Input
          label="Make"
          name="vehicle.make"
          type="text"
          placeholder="Enter vehicle make"
        />
        <Input
          label="Model"
          name="vehicle.model"
          type="text"
          placeholder="Enter vehicle model"
        />
        <Input
          label="Year"
          name="vehicle.year"
          type="text"
          placeholder="Enter year of manufacture"
        />
        <Input
          label="Capacity"
          name="vehicle.capacity"
          type="number"
          placeholder="Enter seating capacity"
        />
      </div>
    </div>
  );
};

export default VehicleInformation;