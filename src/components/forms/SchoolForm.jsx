import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Formik, Form } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Input from "@components/common/input/Input";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@context/ThemeContext";
import LoadingSpinner from "@components/common/Spinner";
import { Button } from "@components/common/Button"; 

const SchoolForm = ({
  onSubmit,
  validationSchema,
  isError,
  error,
  isPending,
  editInitialValues
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  
  const [initialValues, setInitialValues] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      county: "",
      postCode: ""
    },
    contact: {
      contactPerson: "",
      phone: "",
      email: ""
    },
    operatingHours: {
      startTime: "",
      endTime: ""
    },
    isActive: true
  });

 

  
  useEffect(() => {
    if (editInitialValues) {
      setInitialValues({
        name: editInitialValues.name || "",
        address: {
          street: editInitialValues?.address?.street || "",
          city: editInitialValues?.address?.city || "",
          county: editInitialValues?.address?.county || "",
          postCode: editInitialValues?.address?.postCode || ""
        },
        contact: {
          contactPerson: editInitialValues?.contact?.contactPerson || "",
          phone: editInitialValues?.contact?.phone || "",
          email: editInitialValues?.contact?.email || ""
        },
        operatingHours: {
          startTime: editInitialValues?.operatingHours?.startTime || "",
          endTime: editInitialValues?.operatingHours?.endTime || ""
        },
        isActive: editInitialValues?.isActive ?? true
      });
    }
  }, [editInitialValues]);


  const handleCancel = useCallback(() => {
    navigate("/schools");
  }, [navigate]);


  const sectionHeaderClasses = "text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300";
  const sectionDescClasses = "mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300";

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
                {error?.message || "An error occurred while saving the school"}
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
        {({ values, setFieldValue }) => (
          <Form className="space-y-8" aria-label="School form">
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {/* Basic Information */}
              <div className="space-y-6 pt-8 first:pt-0">
                <div>
                  <h3 className={sectionHeaderClasses}>School Details</h3>
                  <p className={sectionDescClasses}>
                    Basic information about the school.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                  <Input 
                    label="School Name" 
                    name="name" 
                    type="text" 
                    aria-label="School name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className={sectionHeaderClasses}>Contact Information</h3>
                  <p className={sectionDescClasses}>
                    Contact details for the school.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input 
                    label="Contact Person" 
                    name="contact.contactPerson" 
                    type="text" 
                    aria-label="Contact person name"
                  />
                  <Input 
                    label="Phone Number" 
                    name="contact.phone" 
                    type="tel" 
                    inputMode="tel"
                    autoComplete="tel"
                    aria-label="School phone number"
                  />
                  <Input 
                    label="Email Address" 
                    name="contact.email" 
                    type="email" 
                    inputMode="email"
                    autoComplete="email"
                    aria-label="School email address"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className={sectionHeaderClasses}>Address</h3>
                  <p className={sectionDescClasses}>
                    Location details of the school.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input 
                      label="Street Address" 
                      name="address.street" 
                      type="text" 
                      autoComplete="street-address"
                      aria-label="School street address"
                    />
                  </div>
                  <Input 
                    label="City" 
                    name="address.city" 
                    type="text" 
                    autoComplete="address-level2"
                    aria-label="City"
                  />
                  <Input 
                    label="County" 
                    name="address.county" 
                    type="text" 
                    autoComplete="address-level1"
                    aria-label="County"
                  />
                  <Input 
                    label="Post Code" 
                    name="address.postCode" 
                    type="text" 
                    autoComplete="postal-code"
                    aria-label="Post code"
                  />
                </div>
              </div>

              {/* Operating Hours */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className={sectionHeaderClasses}>Operating Hours</h3>
                  <p className={sectionDescClasses}>
                    School operating hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="Start Time"
                    name="operatingHours.startTime"
                    type="time"
                    aria-label="School day start time"
                  />
                  <Input
                    label="End Time"
                    name="operatingHours.endTime"
                    type="time"
                    aria-label="School day end time"
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
                  aria-label={editInitialValues?._id ? "Update school" : "Create school"}
                >
                  {isPending ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2 -ml-1" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    editInitialValues?._id ? "Update School" : "Create School"
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

export default SchoolForm;