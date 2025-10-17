import React, { useEffect, useState, useContext, useCallback } from "react";
import { Formik, Form } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Input from "@/components/common/input/Input";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";
import Button from "@/components/common/Button";

const VendorForm = ({
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
    name: "",
    address: {
      street: "",
      city: "",
      county: "",
      postCode: "",
      country: "United Kingdom",
    },
    contact: {
      phone: "",
      email: "",
    },
    status: "Active",
  });

  useEffect(() => {
    if (editInitialValues) {
      setInitialValues({
        name: editInitialValues.name || "",
        address: {
          street: editInitialValues?.address?.street || "",
          city: editInitialValues?.address?.city || "",
          county: editInitialValues?.address?.county || "",
          postCode: editInitialValues?.address?.postCode || "",
          country: editInitialValues?.address?.country || "United Kingdom",
        },
        contact: {
          phone: editInitialValues?.contact?.phone || "",
          email: editInitialValues?.contact?.email || "",
        },
        status: editInitialValues?.status || "Active",
      });
    }
  }, [editInitialValues]);

  const handleCancel = useCallback(() => {
    navigate("/vendors");
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
                {error?.message || "An error occurred while saving the vendor"}
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
          <Form className="space-y-8">
            <div className="space-y-8 divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
              {/* Basic Information */}
              <div className="space-y-6 pt-8 first:pt-0">
                <div>
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Vendor Details
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Basic information about the vendor.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input label="Name" name="name" type="text" />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Contact Information
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Contact details for the vendor.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input label="Phone Number" name="contact.phone" type="tel" />
                  <Input label="Email Address" name="contact.email" type="email" />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Address
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Location details of the vendor.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input label="Street Address" name="address.street" type="text" />
                  </div>
                  <Input label="City" name="address.city" type="text" />
                  <Input label="County" name="address.county" type="text" />
                  <Input label="Post Code" name="address.postCode" type="text" />
                  <Input label="Country" name="address.country" type="text" />
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
                  aria-label={editInitialValues?._id ? "Update vendor" : "Create vendor"}
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
                    "Update Vendor"
                  ) : (
                    "Create Vendor"
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

export default VendorForm;