import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form } from "formik";
import { ChevronLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@components/common/Spinner";
import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "@services/route";

const RouteInfoCard = ({ selectedRoute, formData }) => {
  if (!selectedRoute && !formData) return null;

  const routeData = selectedRoute || formData;

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md transition-colors duration-300">
      <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 transition-colors duration-300">
        Route Price Information
      </h4>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Daily Price:
          </span>
          <span className="block text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
            £{routeData.dailyPrice?.toFixed(2) || '0.00'}
          </span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Driver Price:
          </span>
          <span className="block text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
            £{routeData.driverPrice?.toFixed(2) || 'Not set'}
          </span>
        </div>
        {(routeData.isPANeeded || formData.isPANeeded) && (
          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              PA Price:
            </span>
            <span className="block text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
              £{routeData.paPrice?.toFixed(2) || 'Not set'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyPreview = () => (
  <div className="mt-6 flex justify-center items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
    <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
      No data to preview. Please check your route selection and date range.
    </p>
  </div>
);

const TripTable = ({ previewData }) => {
  if (previewData.length === 0) {
    return <EmptyPreview />;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 transition-colors duration-300">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Student
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Pickup Time
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              From
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Destination
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800 transition-colors duration-300">
          {previewData.map((row, index) => (
            <tr
              key={index}
              className={row.amPickupTime
                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                : 'bg-green-50 dark:bg-green-900/20'
              }
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {row.passenger}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {row.amPickupTime ? `${row.amPickupTime} (AM)` : `${row.pmPickupTime} (PM)`}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {row.from}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {row.destination}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const JobFormStep2 = ({
  onSubmit,
  validationSchema,
  isPending,
  formData,
  onBack,
  isEditMode
}) => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState(formData.routeInfo || null);
  const [previewData, setPreviewData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 100,
  });

  const routeId = typeof formData.route === 'object' ? formData.route._id : formData.route;

  const { data: routesData, isLoading: isRoutesLoading } = useQuery({
    queryKey: ["routes", searchParams],
    queryFn: () => getRoutes(searchParams),
    onSuccess: (data) => {
      // Routes fetched successfully
    }
  });

  const routes = routesData || [];

  const initialValues = {
    ...formData
  };

  const getDateRangeString = useCallback(() => {
    if (!formData.startDate) return "";

    const startDate = new Date(formData.startDate).toLocaleDateString('en-GB');

    if (!formData.endDate) return startDate;

    const endDate = new Date(formData.endDate).toLocaleDateString('en-GB');
    return `${startDate} - ${endDate}`;
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    if (isEditMode && routes && routes.length > 0 && routeId) {
      const matchedRoute = routes.find(r => r._id === routeId);

      if (matchedRoute) {
        setSelectedRoute(matchedRoute);
      }
    }
  }, [isEditMode, routes, routeId, selectedRoute]);

  const generatePreviewData = useCallback(() => {
    if ((!selectedRoute && !formData.stops) || !formData.startDate) {
      return;
    }

    const newPreviewData = [];

    const dateRangeString = getDateRangeString();

    const studentSchoolMap = new Map();

    let allStops = [];

    if (selectedRoute?.stops && (selectedRoute.stops.startingStop || selectedRoute.stops.endingStop)) {
      allStops = [
        selectedRoute.stops?.startingStop,
        ...(selectedRoute.stops?.intermediateStops || []),
        selectedRoute.stops?.endingStop
      ].filter(stop => stop);
    }
    else if (Array.isArray(formData.stops)) {
      allStops = formData.stops.map(stop => {
        if (stop.type === 'start') {
          return { ...stop, isStartingStop: true };
        } else if (stop.type === 'end') {
          return { ...stop, isEndingStop: true };
        } else {
          return { ...stop, isIntermediateStop: true };
        }
      });
    }

    if (allStops.length === 0) {
      return;
    }

    allStops.forEach(stop => {
      if (stop.isSchool && stop.students && stop.students.length > 0) {
        stop.students.forEach(studentInfo => {
          if (studentInfo.student) {
            const studentId = typeof studentInfo.student === 'object'
              ? studentInfo.student._id
              : studentInfo.student;

            studentSchoolMap.set(studentId, {
              schoolLocation: stop.location,
              schoolId: stop.schoolId || null,
              timeAM: stop.timeAM,
              timePM: stop.timePM
            });
          }
        });
      }
    });

    // Create a map of student IDs to student objects from dayWiseStudents
    const studentInfoMap = new Map();

    // Collect student info from selectedRoute dayWiseStudents if available
    if (selectedRoute?.dayWiseStudents) {
      selectedRoute.dayWiseStudents.forEach(day => {
        if (day.students && Array.isArray(day.students)) {
          day.students.forEach(student => {
            if (student._id) {
              studentInfoMap.set(student._id, student);
            }
          });
        }
      });
    }

    allStops.forEach(stop => {
      if (!stop.isSchool && stop.students && stop.students.length > 0) {
        stop.students.forEach(studentInfo => {
          if (studentInfo.student) {
            const studentId = typeof studentInfo.student === 'object'
              ? studentInfo.student._id
              : studentInfo.student;

            let student;

            if (typeof studentInfo.student === 'object') {
              student = studentInfo.student;
            } else if (studentInfoMap.has(studentId)) {
              student = studentInfoMap.get(studentId);
            } else {
              student = {
                _id: studentId,
                firstName: 'Student',
                lastName: `ID: ${studentId.substring(0, 6)}...`
              };
            }

            const homeLocation = stop.location;

            const schoolInfo = studentSchoolMap.get(studentId) || {
              schoolLocation: allStops.find(s => s.isSchool)?.location || "School",
              timeAM: allStops.find(s => s.isSchool)?.timeAM || "08:00",
              timePM: allStops.find(s => s.isSchool)?.timePM || "15:30"
            };

            // AM trip (home to school)
            newPreviewData.push({
              date: dateRangeString,
              routeNo: selectedRoute?.routeNo || formData.routeNo || '',
              passenger: student.firstName + ' ' + student.lastName,
              amPickupTime: stop.timeAM || '08:00',
              from: homeLocation,
              destination: schoolInfo.schoolLocation,
            });

            // PM trip (school to home)
            newPreviewData.push({
              date: dateRangeString,
              routeNo: selectedRoute?.routeNo || formData.routeNo || '',
              passenger: student.firstName + ' ' + student.lastName,
              pmPickupTime: schoolInfo.timePM || '15:30',
              from: schoolInfo.schoolLocation,
              destination: homeLocation,
            });
          }
        });
      }
    });

    // Sort preview data: first AM trips by time, then PM trips by time
    newPreviewData.sort((a, b) => {
      // If both have AM pickup times
      if (a.amPickupTime && b.amPickupTime) {
        return a.amPickupTime.localeCompare(b.amPickupTime);
      }
      // If only a has AM pickup time
      if (a.amPickupTime) {
        return -1; // a comes first
      }
      // If only b has AM pickup time
      if (b.amPickupTime) {
        return 1; // b comes first
      }
      // Both must have PM pickup times
      return a.pmPickupTime.localeCompare(b.pmPickupTime);
    });

    setPreviewData(newPreviewData);
  }, [selectedRoute, formData.stops, formData.startDate, formData.routeNo, getDateRangeString]);

  useEffect(() => {
    generatePreviewData();
  }, [selectedRoute, generatePreviewData, formData.stops]);

  const handleFormSubmit = useCallback((values) => {
    onSubmit({
      ...values,
    });
  }, [onSubmit]);

  const handleCancel = useCallback(() => {
    navigate("/jobs");
  }, [navigate]);

  const handleBack = useCallback((values) => {
    onBack(values);
  }, [onBack]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ values, isSubmitting }) => (
        <Form className="space-y-8">
          <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
            {/* Preview Section */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  Job Preview
                </h3>
                <span className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  Route No - {selectedRoute?.routeNo || formData.routeNo || ''}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Date Range: {getDateRangeString()}
              </p>

              {/* Route Price Information */}
              <RouteInfoCard selectedRoute={selectedRoute} formData={formData} />

              {/* Loading indicator */}
              {isRoutesLoading && (
                <div className="mt-6 flex justify-center items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                  <LoadingSpinner className="w-5 h-5 mr-2" />
                  <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Loading route information...
                  </p>
                </div>
              )}

              {/* Student trips table */}
              {!isRoutesLoading && (
                <TripTable previewData={previewData} />
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => handleBack(values)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors duration-300"
                aria-label="Back to previous step"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                Back
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors duration-300"
                  aria-label="Cancel and return to jobs list"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 transition-colors duration-300"
                  aria-label={formData._id ? "Update job" : "Create job"}
                >
                  {isSubmitting || isPending ? (
                    <span className="inline-flex items-center">
                      <LoadingSpinner className="w-5 h-5 mr-2" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <CheckIcon className="h-5 w-5 mr-2" />
                      {formData._id ? "Update Job" : "Create Job"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default JobFormStep2;