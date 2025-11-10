import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { Formik, Form } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { getAllSchools } from "@/services/school";
import { getAllStudents } from "@/services/student";
import { ThemeContext } from '@context/ThemeContext';
import StepIndicator from "./components/StepIndicator";
import NavigationButtons from "./components/NavigationButtons";
import BasicDetails from "./BasicDetails";
import StopsSection from "./StopsSection";
import StudentDaysSection from "./StudentDaysSection";
import SpecialServicesSection from "./SpecialServiceSection";
import PropTypes from 'prop-types';

const TOTAL_STEPS = 3;

const defaultInitialValues = {
  routeNo: "",
  name: "",
  poNumber: "",
  paPoNumber: "",
  description: "",
  vendor: "",
  invoiceTemplate:"",
  // Staff & pricing
  permanentDriver: "",
  driverPrice: "",
  pa: "",
  paPrice: "",
  routePlanner: {
    name: "",
    phone: "",
    email: "",
  },
  operatingDays: [],
  isPANeeded: false,
  stops: {
    startingStop: {
      location: "",
      isSchool: false,
      timeAM: "",
      timePM: "",
      students: []
    },
    intermediateStops: [],
    endingStop: {
      location: "",
      isSchool: false,
      timeAM: "",
      timePM: "",
      students: []
    },
  },
  dayWiseStudents: [],
  capacity: null,
  pricePerMile: "",
  dailyPrice: "",
  dailyMiles: "",
  documents: null,
  documentMetadata: [{ type: 'ROUTE_MAP', description: 'Document' }]
};

const ErrorAlert = ({ error }) => (
  <div className="rounded-md bg-error/10 dark:bg-error-dark/10 p-4 mb-6 transition-colors duration-200">
    <div className="flex">
      <ExclamationCircleIcon className="h-5 w-5 text-error dark:text-error-dark transition-colors duration-200" />
      <div className="ml-3">
        <p className="text-sm font-medium text-error-dark dark:text-error-light transition-colors duration-200">
          {error?.message || "An error occurred while saving the route"}
        </p>
      </div>
    </div>
  </div>
);

const RouteForm = ({ onSubmit, isError, error, isPending, editInitialValues, validationSchema }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCapacity, setSelectedCapacity] = useState("");

  const [initialValues, setInitialValues] = useState(defaultInitialValues);
  
  useEffect(() => {
    if (editInitialValues) {
      const formattedValues = {
        ...defaultInitialValues,
        ...editInitialValues,
        paPoNumber: editInitialValues.paPoNumber || "",
        // Normalize populated refs to IDs for validation
        permanentDriver: editInitialValues.permanentDriver?._id || editInitialValues.permanentDriver || "",
        pa: editInitialValues.pa?._id || editInitialValues.pa || "",
        documents: editInitialValues?.documents
          ? Array.isArray(editInitialValues.documents) && editInitialValues.documents.length > 0
            ? {
              name: editInitialValues.documents[0].fileName || '',
              type: editInitialValues.documents[0].fileMimeType || '',
              size: editInitialValues.documents[0].fileSize || 0,
              url: editInitialValues.documents[0].fileUrl || editInitialValues.documents[0].downloadUrl || '',
              fileName: editInitialValues.documents[0].fileName || '',
              fileMimeType: editInitialValues.documents[0].fileMimeType || '',
              fileSize: editInitialValues.documents[0].fileSize || 0
            }
            : null
          : null,
        routePlanner: {
          name: editInitialValues.routePlanner?.name || "",
          phone: editInitialValues.routePlanner?.phone || "",
          email: editInitialValues.routePlanner?.email || "",
        },
        stops: {
          startingStop: editInitialValues.stops?.startingStop || {
            location: "",
            isSchool: false,
            timeAM: "",
            timePM: "",
            students: []
          },
          intermediateStops: editInitialValues.stops?.intermediateStops || [],
          endingStop: editInitialValues.stops?.endingStop || {
            location: "",
            isSchool: false,
            timeAM: "",
            timePM: "",
            students: []
          },
        },
        dayWiseStudents: editInitialValues.dayWiseStudents || [],
        operatingDays: editInitialValues.operatingDays || [],
        capacity: editInitialValues.capacity || "",
        pricePerMile: editInitialValues.pricePerMile || "",
        dailyPrice: editInitialValues.dailyPrice || "",
        dailyMiles: editInitialValues.dailyMiles || "",
        isPANeeded: editInitialValues.isPANeeded || false,
        vendor: editInitialValues.vendor?._id || editInitialValues.vendor || "",
      };

      setInitialValues(formattedValues);

      if (editInitialValues.capacity) {
        setSelectedCapacity(editInitialValues.capacity);
      }
    }
  }, [editInitialValues]);

  const { data: schools } = useQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
    select: (data) => Array.isArray(data) ? data : (data?.data || []),
  });

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: getAllStudents,
  });

  const validateCurrentStep = useCallback((values, step, errors = {}) => {
    switch (step) {
      case 1:
        // Validate basic details
        if (!values.name) errors.name = "Name is required";
        if (!values.routeNo) errors.routeNo = "Route number is required";
        break;
      case 2:
        // Validate stops section
        if (!values.stops.startingStop.location) {
          errors.stops = { 
            startingStop: { 
              location: "Starting location is required"
            } 
          };
        }
        if (!values.stops.endingStop.location) {
          if (!errors.stops) errors.stops = {};
          if (!errors.stops.endingStop) errors.stops.endingStop = {};
          errors.stops.endingStop.location = "Ending location is required";
        }

        // Validate that stops have students
        if (values.stops.startingStop.students.length === 0) {
          if (!errors.stops) errors.stops = {};
          if (!errors.stops.startingStop) errors.stops.startingStop = {};
          errors.stops.startingStop.students = "Starting stop must have at least one student";
        }
        if (values.stops.endingStop.students.length === 0) {
          if (!errors.stops) errors.stops = {};
          if (!errors.stops.endingStop) errors.stops.endingStop = {};
          errors.stops.endingStop.students = "Ending stop must have at least one student";
        }

        // Validate AM/PM times
        if (!values.stops.startingStop.timeAM) {
          if (!errors.stops) errors.stops = {};
          if (!errors.stops.startingStop) errors.stops.startingStop = {};
          errors.stops.startingStop.timeAM = "AM time is required";
        }
        if (!values.stops.startingStop.timePM) {
          if (!errors.stops) errors.stops = {};
          if (!errors.stops.startingStop) errors.stops.startingStop = {};
          errors.stops.startingStop.timePM = "PM time is required";
        }
        if (!values.stops.endingStop.timeAM) {
          if (!errors.stops) errors.stops = {};
          if (!errors.stops.endingStop) errors.stops.endingStop = {};
          errors.stops.endingStop.timeAM = "AM time is required";
        }
        if (!values.stops.endingStop.timePM) {
          if (!errors.stops) errors.stops = {};
          if (!errors.stops.endingStop) errors.stops.endingStop = {};
          errors.stops.endingStop.timePM = "PM time is required";
        }

        // Validate intermediate stops if any
        values.stops.intermediateStops.forEach((stop, index) => {
          if (stop.location && (!stop.timeAM || !stop.timePM)) {
            if (!errors.stops) errors.stops = {};
            if (!errors.stops.intermediateStops) errors.stops.intermediateStops = [];
            
            // Make sure the array has enough elements
            while (errors.stops.intermediateStops.length <= index) {
              errors.stops.intermediateStops.push({});
            }
            
            if (!stop.timeAM) {
              errors.stops.intermediateStops[index].timeAM = "AM time is required";
            }
            if (!stop.timePM) {
              errors.stops.intermediateStops[index].timePM = "PM time is required";
            }
          }
        });
        break;
      case 3:
        // Validate special services if needed
        // No validation for special services since they're optional
        break;
      default:
        break;
    }
    return errors;
  }, []);

  const renderCurrentStep = useCallback((formikProps) => {
    switch (currentStep) {
      case 1:
        return <BasicDetails onCapacityChange={setSelectedCapacity} />;
      case 2:
        return (
          <>
            <StopsSection
              schools={schools}
              students={students}
              initialValues={initialValues}
            />
            <StudentDaysSection students={students} />
          </>
        );
      case 3:
        return (
          <SpecialServicesSection students={students} />
        );
      default:
        return null;
    }
  }, [currentStep, schools, students, initialValues, setSelectedCapacity]);

  return (
    <>
      {isError && <ErrorAlert error={error} />}

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validateOnChange={true}  
        validateOnBlur={true}
        validationSchema={validationSchema}
      >
        {(formikProps) => {
          const handleNext = () => {
            const fieldsToTouch = {};
            
            if (currentStep === 1) {
              fieldsToTouch.name = true;
              fieldsToTouch.routeNo = true;
              fieldsToTouch.capacity = true;
              fieldsToTouch.vendor = true;
            } else if (currentStep === 2) {
              fieldsToTouch['stops.startingStop.location'] = true;
              fieldsToTouch['stops.startingStop.timeAM'] = true;
              fieldsToTouch['stops.startingStop.timePM'] = true;
              fieldsToTouch['stops.endingStop.location'] = true;
              fieldsToTouch['stops.endingStop.timeAM'] = true;
              fieldsToTouch['stops.endingStop.timePM'] = true;
              
              formikProps.values.stops.intermediateStops.forEach((_, index) => {
                fieldsToTouch[`stops.intermediateStops[${index}].location`] = true;
                fieldsToTouch[`stops.intermediateStops[${index}].timeAM`] = true;
                fieldsToTouch[`stops.intermediateStops[${index}].timePM`] = true;
              });
            }
            
            formikProps.setTouched(fieldsToTouch);
            
            const errors = validateCurrentStep(formikProps.values, currentStep);
            
            if (Object.keys(errors).length === 0) {
              setCurrentStep(curr => curr + 1);
            } else {
              formikProps.setErrors({...formikProps.errors, ...errors});
            }
          };

          const handlePrevious = () => {
            setCurrentStep(curr => curr - 1);
          };

          const handleSubmit = () => {
            formikProps.setTouched(
              Object.keys(formikProps.values).reduce((acc, key) => {
                acc[key] = true;
                return acc;
              }, {})
            );
            
            formikProps.setFieldTouched('stops.startingStop.location', true);
            formikProps.setFieldTouched('stops.startingStop.timeAM', true);
            formikProps.setFieldTouched('stops.startingStop.timePM', true);
            formikProps.setFieldTouched('stops.endingStop.location', true);
            formikProps.setFieldTouched('stops.endingStop.timeAM', true);
            formikProps.setFieldTouched('stops.endingStop.timePM', true);

            const currentStepErrors = validateCurrentStep(formikProps.values, currentStep);

            formikProps.validateForm().then(errors => {
              const allErrors = { ...errors, ...currentStepErrors };
              
              const hasErrors = Object.keys(allErrors).length > 0;

              if (hasErrors) {
                formikProps.setErrors(allErrors);

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              } else {
                const cleanedValues = {
                  ...formikProps.values,
                  stops: {
                    ...formikProps.values.stops,
                    intermediateStops: formikProps.values.stops.intermediateStops
                      .filter((stop) => stop.location.trim() !== "")
                      .map((stop, index) => ({
                        ...stop,
                        sequence: index + 1,
                      })),
                  },
                };

                onSubmit(cleanedValues, { setSubmitting: formikProps.setSubmitting });
              }
            });
          };

          return (
            <Form className="space-y-8">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                onStepClick={(step) => {
                  if (step > currentStep) {
                    const errors = validateCurrentStep(formikProps.values, currentStep);
                    if (Object.keys(errors).length > 0) {
                      formikProps.setErrors({...formikProps.errors, ...errors});
                      return; 
                    }
                  }
                  setCurrentStep(step);
                }}
              />

              <div className="space-y-8 divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
                {renderCurrentStep(formikProps)}

                {/* Navigation Buttons*/}
                <NavigationButtons
                  currentStep={currentStep}
                  totalSteps={TOTAL_STEPS}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onSubmit={handleSubmit}
                  isSubmitting={formikProps.isSubmitting}
                  isPending={isPending}
                  isEditMode={!!editInitialValues}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

ErrorAlert.propTypes = {
  error: PropTypes.object
};

RouteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isError: PropTypes.bool,
  error: PropTypes.object,
  isPending: PropTypes.bool,
  editInitialValues: PropTypes.object,
  validationSchema: PropTypes.object
};

export default RouteForm;