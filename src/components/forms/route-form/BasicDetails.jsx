import React, { useEffect, useMemo, useCallback, useContext } from 'react';
import { Field, useFormikContext } from 'formik';
import { useQuery } from "@tanstack/react-query";
import { getAllVendors } from "@/services/vendor";
import Input from '@/components/common/input/Input';
import Select from '@/components/common/input/Select'; 
import FileUpload from '@/components/common/input/FileUpload';
import { ThemeContext } from '@context/ThemeContext';
import PropTypes from 'prop-types';

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const Card = ({ title, children, rightElement }) => {
  return (
    <div className="bg-surface dark:bg-surface-dark rounded-lg shadow transition-colors duration-200">
      <div className="px-6 py-4 border-b border-border-light dark:border-border-dark-mode transition-colors duration-200">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            {title}
          </h4>
          {rightElement}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

const BasicDetails = ({ onCapacityChange }) => {
  const { setFieldValue, values } = useFormikContext();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const { data: vendorsData, isLoading: loadingVendors } = useQuery({
    queryKey: ["vendors", { status: "Active" }],
    queryFn: () => getAllVendors({ status: "Active" }),
  });
  
  const vendorOptions = useMemo(() => 
    vendorsData?.map(vendor => ({
      id: vendor._id,
      name: vendor.name
    })) || [], 
    [vendorsData]
  );
  
  useEffect(() => {
    if (!values.operatingDays || values.operatingDays.length === 0) {
      setFieldValue('operatingDays', WEEKDAYS);
    }
  }, [values.operatingDays, setFieldValue]);
  
  useEffect(() => {
    if (vendorOptions.length > 0 && !values.vendor) {
      setFieldValue('vendor', vendorOptions[0].id);
    }
  }, [vendorOptions, values.vendor, setFieldValue]);

  // Clear PA PO Number when PA is not required
  useEffect(() => {
    if (!values.isPANeeded && values.paPoNumber) {
      setFieldValue('paPoNumber', '');
    }
  }, [values.isPANeeded, values.paPoNumber, setFieldValue]);

  const handleCapacityChange = useCallback((e) => {
    const capacity = e.target.value;
    setFieldValue('capacity', capacity);
    onCapacityChange(capacity);
  }, [setFieldValue, onCapacityChange]);

  const calculateDailyPrice = useCallback(() => {
    const dailyMiles = parseFloat(values.dailyMiles) || 0;
    const pricePerMile = parseFloat(values.pricePerMile) || 0;
    const calculatedPrice = (dailyMiles * pricePerMile).toFixed(2);
    setFieldValue("dailyPrice", calculatedPrice);
  }, [values.dailyMiles, values.pricePerMile, setFieldValue]);
  
  const paCheckbox = (
    <label className="flex items-center space-x-2">
      <Field
        type="checkbox"
        name="isPANeeded"
        className="h-5 w-5 text-primary border-border-light dark:border-border-dark-mode rounded focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200"
        aria-label="PA Required checkbox"
      />
      <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        PA Required
      </span>
    </label>
  );
  
  return (
    <div className="space-y-8">
      {/* Basic Route Information Card */}
      <Card title="Basic Route Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input label="Route Number" name="routeNo" type="text" />
          <Input label="Route Name" name="name" type="text" />
          <Input label="Driver PO Number" name="poNumber" type="text" />
          <Input label="Invoice Template" name="invoiceTemplate" type="text" />
          {/* <Input label="Description" name="description" type="text" /> */}
          <Input 
            label="Vehicle Capacity"
            name="capacity"
            type="number"
            min="1"
            step="1"
            onChange={handleCapacityChange}
          />
          
          {/* Vendor Selection*/}
          <Select
            label="Vendor"
            name="vendor"
            options={vendorOptions}
            placeholder={loadingVendors ? "Loading vendors..." : "Select a vendor"}
            disabled={loadingVendors}
          />
          
          {/* Add document upload component */}
          <div className="sm:col-span-2">
            <FileUpload
              label="Route Document"
              name="documents"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={10485760} // 10MB
              helperText="Upload route map or contract (Max 10MB)"
            />
          </div>
        </div>
      </Card>

      {/* Route Planner Details Card */}
      <Card title="Route Planner Details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Input label="Name" name="routePlanner.name" type="text" />
          <Input label="Phone" name="routePlanner.phone" type="tel" />
          <Input label="Email" name="routePlanner.email" type="email" />
        </div>
      </Card>

      {/* Route Pricing Details Card */}
      <Card title="Route Pricing Details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Input
            label="Daily Miles"
            name="dailyMiles"
            type="number"
            min="0"
            step="0.1"
          />
          <Input
            label="Price Per Mile"
            name="pricePerMile"
            type="number"
            min="0"
            step="0.01"
          />
          <div className="space-y-2">
            <Input
              label="Daily Price / Contract Price"
              name="dailyPrice"
              type="number"
              min="0"
              step="0.01"
            />
            <button
              type="button"
              onClick={calculateDailyPrice}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary dark:text-primary-light bg-primary-light/10 dark:bg-primary/10 rounded hover:bg-primary-light/20 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200"
              aria-label="Calculate daily price"
            >
              Calculate
            </button>
          </div>
        </div>
      </Card>

      {/* PA Required Checkbox */}
      <Card title="PA Assignment" rightElement={paCheckbox}>
        {values.isPANeeded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="PA PO Number" name="paPoNumber" type="text" />
          </div>
        )}
      </Card>

      {/* Operating Days Card */}
      <Card title="Operating Days">
        <div className="flex flex-wrap gap-6">
          {DAYS.map((day) => (
            <label key={day} className="inline-flex items-center">
              <Field
                type="checkbox"
                name="operatingDays"
                value={day}
                className="h-5 w-5 text-primary border-border-light dark:border-border-dark-mode rounded focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200"
                aria-label={`${day} checkbox`}
              />
              <span className="ml-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200 capitalize">
                {day}
              </span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  rightElement: PropTypes.node
};

BasicDetails.propTypes = {
  onCapacityChange: PropTypes.func.isRequired
};

export default BasicDetails;