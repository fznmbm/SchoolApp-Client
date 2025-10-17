import React, { useContext } from 'react';
import Input from "@components/common/input/Input";
import Select from "@components/common/input/Select";
import { DRIVER_STATUS } from '@utils/driverFormHelpers';
import { ThemeContext } from '@/context/ThemeContext';

const DriverInformation = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="transition-colors duration-200 ease-in-out">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
        Driver Information
      </h3>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 mt-4">
        <Input
          label="Full Name"
          name="name"
          type="text"
          placeholder="Enter full name"
        />
        <Input
          label="Short Name"
          name="shortName"
          type="text"
          placeholder="Enter short name"
        />
        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          placeholder="Enter phone number"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter email address"
        />
        <Input label="Date of Birth" name="dateOfBirth" type="date" />
        <Input
          label="Nationality"
          name="nationality"
          type="text"
          placeholder="Enter nationality"
        />
        <Select label="Status" name="status" options={DRIVER_STATUS} />

        {/* Address Fields */}
        <Input
          label="Street"
          name="address.street"
          type="text"
          placeholder="Enter street address"
        />
        <Input
          label="City"
          name="address.city"
          type="text"
          placeholder="Enter city"
        />
        <Input
          label="County"
          name="address.county"
          type="text"
          placeholder="Enter county"
        />
        <Input
          label="Post Code"
          name="address.postCode"
          type="text"
          placeholder="Enter post code"
        />
        <Input
          label="Country"
          name="address.country"
          type="text"
          placeholder="Enter country"
          disabled
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mt-6 transition-colors duration-200">
        Emergency Contact
      </h3>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 mt-4">
        <Input
          label="Emergency Contact Name"
          name="emergencyContact.name"
          type="text"
          placeholder="Enter emergency contact's name"
        />
        <Input
          label="Emergency Contact Relationship"
          name="emergencyContact.relationship"
          type="text"
          placeholder="Enter relationship"
        />
        <Input
          label="Emergency Contact Phone Number"
          name="emergencyContact.phoneNumber"
          type="tel"
          placeholder="Enter emergency contact's phone number"
        />
      </div>
    </div>
  );
};

export default DriverInformation;