import React, { useState, useMemo, useContext } from "react";
import { Formik, Form } from "formik";
import { useQuery } from "@tanstack/react-query";
import { ThemeContext } from "@/context/ThemeContext";
import { getAllTrainings } from "@/services/training";
import NavigationButtons from "./NavigationButtons";
import DriverInformation from "./DriverInformation";
import VehicleInformation from "./VehicleInformation";
import TrainingRecords from "./TrainingRecords";
import { prepareInitialValues, transformFormData } from "@utils/driverFormHelpers";

const DriverForm = ({
  onSubmit,
  validationSchema,
  isError,
  error,
  isPending,
  initialData = [],
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const { theme } = useContext(ThemeContext);
  const formInitialValues = useMemo(() => prepareInitialValues(initialData), [initialData]);

  const { data: trainingsResponse } = useQuery({
    queryKey: ["trainings"],
    queryFn: async () => {
      const response = await getAllTrainings({ page: 1, limit: 100 });
      return response;
    }
  });

  const trainingsOptions = useMemo(() => {
    if (!trainingsResponse) return [];
    
    return trainingsResponse.map(training => ({
      id: training._id,
      name: training.trainingName
    }));
  }, [trainingsResponse]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <DriverInformation />;
      case 2:
        return <VehicleInformation />;
      case 3:
        return <TrainingRecords trainingsOptions={trainingsOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="transition-colors duration-200 ease-in-out">
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(transformFormData(values));
          } catch (error) {
            console.error('Form submission error:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4 pb-2 transition-colors duration-200">
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Step {step} of 3</p>
            </div>
            
            {isError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4 transition-colors duration-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400 transition-colors duration-200">
                      {error?.message || "An error occurred"}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            
            {/* Display validation errors for the current step
            {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4 transition-colors duration-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 transition-colors duration-200">
                      Please fix the validation errors before proceeding
                    </h3>
                  </div>
                </div>
              </div>
            )} */}
            
            {renderStep()}
            
            <NavigationButtons
              step={step}
              setStep={setStep}
              isSubmitting={isSubmitting}
              isPending={isPending}
              onCancel={onCancel}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default DriverForm;