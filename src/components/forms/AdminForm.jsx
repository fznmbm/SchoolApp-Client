import React, { useEffect, useState, useContext, useCallback } from "react";
import { Formik, Form } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Input from "@components/common/input/Input";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ThemeContext } from "@context/ThemeContext";
import LoadingSpinner from "@components/common/Spinner";
import { Button } from "@components/common/Button"; 

const AdminForm = ({
  onSubmit,
  validationSchema,
  isError,
  error,
  isPending,
  editInitialValues,
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isNewAdmin: true,
  });


  

  useEffect(() => {
    if (editInitialValues) {
      setInitialValues({
        firstName: editInitialValues.firstName || "",
        lastName: editInitialValues.lastName || "",
        email: editInitialValues.email || "",
        phone: editInitialValues.phone || "",
        password: "",
        confirmPassword: "",
        isNewAdmin: false,
      });
    } else {
      setInitialValues(prev => ({
        ...prev,
        isNewAdmin: true,
      }));
    }
  }, [editInitialValues]);

  const handleCancel = useCallback(() => {
    navigate("/admins");
  }, [navigate]);

  return (
    <div className="transition-colors duration-300 ease-in-out">
      {isError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-300">
          <div className="flex">
            <ExclamationCircleIcon 
              className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-300" 
              aria-hidden="true" 
            />
            <div className="ml-3">
              <p 
                className="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-300" 
                role="alert"
              >
                {error?.message || "An error occurred while saving the administrator"}
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
        {({ values, errors, touched }) => (
          <Form className="space-y-8" aria-label="Administrator form">
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {/* Basic Information */}
              <div className="space-y-6 pt-8 first:pt-0">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    Administrator Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Basic information about the administrator.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input 
                    label="First Name" 
                    name="firstName" 
                    type="text" 
                    aria-required="true"
                  />
                  <Input 
                    label="Last Name" 
                    name="lastName" 
                    type="text" 
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    Contact Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Contact details for the administrator.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    aria-required="true"
                    inputMode="email"
                    autoComplete="email"
                  />
                  <Input 
                    label="Phone Number" 
                    name="phone" 
                    type="tel" 
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {editInitialValues?._id ? "Change Password" : "Password"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    {editInitialValues?._id
                      ? "Leave blank to keep the current password."
                      : "Set a secure password for the administrator."}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    aria-required={!editInitialValues?._id}
                    autoComplete={editInitialValues?._id ? "new-password" : "current-password"}
                  />
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    aria-required={!editInitialValues?._id || values.password.length > 0}
                    autoComplete={editInitialValues?._id ? "new-password" : "current-password"}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                  aria-label="Cancel form submission"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  aria-label={editInitialValues?._id ? "Update administrator" : "Create administrator"}
                >
                  {isPending ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2 -ml-1" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    editInitialValues?._id ? "Update Administrator" : "Create Administrator"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminForm;