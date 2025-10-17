import React, { useEffect, useState, useCallback, useContext } from "react";
import { Formik, Form } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Input from "@components/common/input/Input";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@context/ThemeContext";
import { Button } from "@components/common/Button"; 
import LoadingSpinner from "@components/common/Spinner"; 

const LicensingAuthorityForm = ({
  onSubmit,
  validationSchema,
  isError,
  error,
  isPending,
  editInitialValues,
}) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  
  const [initialValues, setInitialValues] = useState({
    licensingAuthorityID: "",
    authorityName: "",
    contact: {
      phone: "",
      email: "",
      address: {
        street: "",
        city: "",
        county: "",
        postCode: "",
        country: "United Kingdom",
      },
    },
  });

  const handleCancel = useCallback(() => {
    navigate("/licensing-authority");
  }, [navigate]);

  useEffect(() => {
    if (editInitialValues) {
      setInitialValues({
        licensingAuthorityID: editInitialValues.licensingAuthorityID || "",
        authorityName: editInitialValues.authorityName || "",
        contact: {
          phone: editInitialValues?.contact?.phone || "",
          email: editInitialValues?.contact?.email || "",
          address: {
            street: editInitialValues?.contact?.address?.street || "",
            city: editInitialValues?.contact?.address?.city || "",
            county: editInitialValues?.contact?.address?.county || "",
            postCode: editInitialValues?.contact?.address?.postCode || "",
            country: editInitialValues?.contact?.address?.country || "United Kingdom",
          },
        },
      });
    }
  }, [editInitialValues]);

 
  const sectionHeaderClasses = "text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300";
  const sectionDescClasses = "mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300";

  return (
    <div className="transition-colors duration-300 ease-in-out">
      {/* Error Alert */}
      {isError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-300" 
             role="alert"
             aria-live="assertive">
          <div className="flex">
            <ExclamationCircleIcon 
              className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-300" 
              aria-hidden="true" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-300">
                {error?.message || "An error occurred while saving the licensing authority"}
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
        {({ isSubmitting }) => (
          <Form className="space-y-8" aria-label="Licensing authority form">
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {/* Authority Details Section */}
              <div className="space-y-6 pt-0 transition-colors duration-300">
                <div>
                  <h3 className={sectionHeaderClasses}>
                    Authority Details
                  </h3>
                  <p className={sectionDescClasses}>
                    Basic information about the licensing authority.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input 
                    label="Authority ID" 
                    name="licensingAuthorityID" 
                    type="text" 
                    aria-required="true"
                    autoComplete="off"
                  />
                  <Input 
                    label="Authority Name" 
                    name="authorityName" 
                    type="text" 
                    aria-required="true"
                    autoComplete="organization"
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6 pt-8 transition-colors duration-300">
                <div>
                  <h3 className={sectionHeaderClasses}>
                    Contact Information
                  </h3>
                  <p className={sectionDescClasses}>
                    Contact details for the licensing authority.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input 
                    label="Phone Number" 
                    name="contact.phone" 
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel" 
                    aria-required="true"
                  />
                  <Input 
                    label="Email Address" 
                    name="contact.email" 
                    type="email"
                    inputMode="email"
                    autoComplete="email" 
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-6 pt-8 transition-colors duration-300">
                <div>
                  <h3 className={sectionHeaderClasses}>
                    Address
                  </h3>
                  <p className={sectionDescClasses}>
                    Location details of the licensing authority.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input 
                      label="Street Address" 
                      name="contact.address.street" 
                      type="text"
                      autoComplete="street-address" 
                      aria-required="true"
                    />
                  </div>
                  <Input 
                    label="City" 
                    name="contact.address.city" 
                    type="text"
                    autoComplete="address-level2" 
                    aria-required="true"
                  />
                  <Input 
                    label="County" 
                    name="contact.address.county" 
                    type="text"
                    autoComplete="address-level1" 
                    aria-required="true"
                  />
                  <Input 
                    label="Post Code" 
                    name="contact.address.postCode" 
                    type="text"
                    autoComplete="postal-code" 
                    aria-required="true"
                  />
                  <Input 
                    label="Country" 
                    name="contact.address.country" 
                    type="text" 
                    defaultValue="United Kingdom"
                    autoComplete="country-name"
                    aria-required="true"
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
                  aria-label="Cancel and return to previous page"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  aria-label={editInitialValues?._id ? "Update authority" : "Create authority"}
                >
                  {isPending ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2 -ml-1" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    editInitialValues?._id ? "Update Authority" : "Create Authority"
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

export default LicensingAuthorityForm;