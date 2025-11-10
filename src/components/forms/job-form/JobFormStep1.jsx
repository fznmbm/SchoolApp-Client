import React, { useState, useCallback, useRef } from "react";
import { Formik, Form } from "formik";
import { ExclamationCircleIcon, CalendarIcon } from "@heroicons/react/20/solid";
import Input from "@components/common/input/Input";
import Select from "@components/common/input/Select";
import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "@services/route";
import LoadingSpinner from "@components/common/Spinner";
import DatePicker from "@components/common/input/DatePicker";
import { format } from "date-fns";

const JobFormStep1 = ({
  validationSchema,
  isError,
  error,
  isPending,
  editInitialValues,
  onNext
}) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
  });
  const [activeDatePicker, setActiveDatePicker] = useState(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const initialValues = editInitialValues || {
    title: "",
    route: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    operatingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    isActive: true,
    isPANeeded: false,
  };

  if (initialValues.startDate && typeof initialValues.startDate === 'string') {
    initialValues.startDate = new Date(initialValues.startDate);
  } else if (!initialValues.startDate) {
    initialValues.startDate = new Date();
  }
  
  if (initialValues.endDate && typeof initialValues.endDate === 'string') {
    initialValues.endDate = new Date(initialValues.endDate);
  } else if (!initialValues.endDate) {
    initialValues.endDate = new Date();
  }

  const { data: routes, isLoading: isRoutesLoading } = useQuery({
    queryKey: ["routes", searchParams],
    queryFn: () => getRoutes({ ...searchParams, limit: 1000 }), // Fetch all routes for selector
  });

  const routesList = Array.isArray(routes) ? routes : (routes?.data || []);
  const routeOptions = routesList.map((route) => ({
    id: route._id,
    name: `${route.routeNo} ${route.name || ''}`,
  }));

  const handleRouteChange = useCallback(async (data, setFieldValue) => {
    const routeId = data.id;
    const route = routesList.find((r) => r._id === routeId);
    setSelectedRoute(route);
    setFieldValue("route", routeId);
    
    setFieldValue("routeInfo", route);
    
    if (route?.operatingDays && route.operatingDays.length > 0) {
      setFieldValue("operatingDays", route.operatingDays);
    }
    
    if (route?.isPANeeded) {
      setFieldValue("isPANeeded", true);
      if (route.pa) {
        setFieldValue("pa", route.pa);
      }
    }
    
    if (route?.permanentDriver) {
      setFieldValue("permanentDriver", route.permanentDriver);
    }
  }, [routes]);

  const handleFormSubmit = useCallback((values) => {
    onNext(values);
  }, [onNext]);

  const toggleDatePicker = (field) => {
    setActiveDatePicker(activeDatePicker === field ? null : field);
  };

  const handleDateChange = (date, field, setFieldValue) => {
    // Create UTC midnight for selected date
    const utcDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));
    
    setFieldValue(field, utcDate);
    setActiveDatePicker(null);
  };

  const DateField = ({ label, name, value, setFieldValue }) => {
    const isActive = activeDatePicker === name;
    const ref = name === 'startDate' ? startDateRef : endDateRef;
    
    return (
      <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
          {label}
        </label>
        <div 
          ref={ref}
          className="flex justify-between items-center border rounded-md px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary-light focus-within:border-primary dark:focus-within:border-primary-light cursor-pointer transition-colors duration-300"
          onClick={() => toggleDatePicker(name)}
        >
          <span className="text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">
            {value ? format(value, 'yyyy-MM-dd') : 'Select date'}
          </span>
          <CalendarIcon className="h-5 w-5 text-text-secondary dark:text-text-dark-secondary transition-colors duration-300" />
        </div>
        
        {isActive && (
          <div className="absolute z-10 mt-1">
            <DatePicker
              selectedDate={value || new Date()}
              onChange={(date) => handleDateChange(date, name, setFieldValue)}
              onClose={() => setActiveDatePicker(null)}
            />
          </div>
        )}
      </div>
    );
  };

  const isEditMode = Boolean(editInitialValues && editInitialValues._id);

  return (
    <div className=" dark:bg-gray-800 rounded-lg transition-colors duration-300">
      {isError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-300" role="alert">
          <div className="flex">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-300"
              aria-hidden="true"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-300">
                {error?.message || "An error occurred while saving the job"}
              </p>
            </div>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-8">
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {/* Basic Details Section */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 pt-4">
                <div className="sm:col-span-2">
                  <Input label="Job Title" name="title" type="text" />
                </div>
                
                <div className="sm:col-span-2">
                  <Select
                    label="Route"
                    name="route"
                    options={routeOptions}
                    isLoading={isRoutesLoading}
                    onChange={(value) => handleRouteChange(value, setFieldValue)}
                    disabled={isEditMode}
                    helperText={isEditMode ? 'Route cannot be changed when editing a job' : undefined}
                    aria-label="Select a route"
                  />
                </div>

                <div className="flex gap-4 sm:col-span-2">
                  <div className="flex-1">
                    <DateField
                      label="Start Date"
                      name="startDate"
                      value={values.startDate}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                  <div className="flex-1">
                    <DateField
                      label="End Date"
                      name="endDate"
                      value={values.endDate}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-colors duration-300"
                  aria-label="Continue to preview"
                >
                  {isSubmitting || isPending ? (
                    <span className="inline-flex items-center">
                      <LoadingSpinner className="w-5 h-5 mr-2" />
                      Processing...
                    </span>
                  ) : (
                    "Continue to Preview"
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default JobFormStep1;