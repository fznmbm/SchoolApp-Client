import React, { useEffect, useState, useContext, useCallback } from "react";
import { Formik, Form } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Input from "@/components/common/input/Input";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@context/ThemeContext";
import Button from "@/components/common/Button";

const TrainingForm = ({
  onSubmit,
  validationSchema,
  isError,
  error,
  isPending,
  editInitialValues,
}) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const [initialValues, setInitialValues] = useState({
    trainingID: "",
    trainingName: "",
    candidateType: "",
    description: "",
    status: "Active"
  });

  useEffect(() => {
    if (editInitialValues) {
      setInitialValues({
        trainingID: editInitialValues.trainingID || "",
        trainingName: editInitialValues.trainingName || "",
        candidateType: editInitialValues.candidateType || "",
        description: editInitialValues.description || "",
        status: editInitialValues.status || "Active"
      });
    }
  }, [editInitialValues]);

  const handleCancel = useCallback(() => {
    navigate("/training");
  }, [navigate]);

  return (
    <>
      {isError && (
        <div className="rounded-md bg-error-light dark:bg-error-dark p-4 mb-6 transition-colors duration-200">
          <div className="flex">
            <ExclamationCircleIcon 
              className="h-5 w-5 text-error dark:text-error-light transition-colors duration-200" 
              aria-hidden="true" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-error-dark dark:text-error-light transition-colors duration-200">
                {error?.message || "An error occurred while saving the training"}
              </p>
            </div>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="space-y-8">
            <div className="space-y-8 divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
              {/* Basic Information */}
              <div className="space-y-6 pt-8 first:pt-0">
                <div>
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Training Details
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Basic information about the training.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input 
                    label="Training ID" 
                    name="trainingID" 
                    type="text" 
                  />
                  <Input 
                    label="Training Name" 
                    name="trainingName" 
                    type="text" 
                  />
                </div>
              </div>

              {/* Candidate Type */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Candidate Type
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Select the type of candidate for this training.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label 
                      htmlFor="candidateType" 
                      className="block text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200"
                    >
                      Candidate Type
                    </label>
                    <select
                      id="candidateType"
                      name="candidateType"
                      value={values.candidateType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base 
                                border-border-light dark:border-border-dark-mode 
                                bg-surface dark:bg-surface-dark
                                text-text-primary dark:text-text-dark-primary
                                focus:outline-none focus:ring-primary dark:focus:ring-primary-light
                                focus:border-primary dark:focus:border-primary-light
                                sm:text-sm rounded-md transition-colors duration-200"
                      aria-invalid={touched.candidateType && errors.candidateType ? "true" : "false"}
                    >
                      <option value="">Select Candidate Type</option>
                      <option value="Driver">Driver</option>
                      <option value="PA">Personal Assistant</option>
                    </select>
                    {touched.candidateType && errors.candidateType && (
                      <p className="mt-2 text-sm text-error dark:text-error-light transition-colors duration-200">
                        {errors.candidateType}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Description
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Provide additional details about the training.
                  </p>
                </div>

                <div>
                  <label 
                    htmlFor="description" 
                    className="block text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200"
                  >
                    Training Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 block w-full rounded-md 
                              border-border-light dark:border-border-dark-mode 
                              bg-surface dark:bg-surface-dark
                              text-text-primary dark:text-text-dark-primary
                              shadow-sm focus:border-primary dark:focus:border-primary-light
                              focus:ring-primary dark:focus:ring-primary-light
                              sm:text-sm transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Status
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Set the current status of the training.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label 
                      htmlFor="status" 
                      className="block text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200"
                    >
                      Training Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base 
                                border-border-light dark:border-border-dark-mode 
                                bg-surface dark:bg-surface-dark
                                text-text-primary dark:text-text-dark-primary
                                focus:outline-none focus:ring-primary dark:focus:ring-primary-light
                                focus:border-primary dark:focus:border-primary-light
                                sm:text-sm rounded-md transition-colors duration-200"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  aria-label="Cancel form submission"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isPending}
                  aria-label={editInitialValues?._id ? "Update training" : "Create training"}
                >
                  {isPending ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2 -ml-1 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : editInitialValues?._id ? (
                    "Update Training"
                  ) : (
                    "Create Training"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TrainingForm;