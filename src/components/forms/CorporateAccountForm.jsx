import React, { useEffect, useState, useCallback, useContext } from "react";
import { Formik, Form } from "formik";
import Input from "@components/common/input/Input";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@context/ThemeContext";
import { Button } from "@components/common/Button";
import LoadingSpinner from "@components/common/Spinner";

const CorporateAccountForm = ({
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
    corporateAccountID: "",
    companyName: "",
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
    navigate("/corporate-accounts");
  }, [navigate]);

  useEffect(() => {
    if (editInitialValues) {
      setInitialValues({
        corporateAccountID: editInitialValues.corporateAccountID || "",
        companyName: editInitialValues.companyName || "",
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
  const sectionDescClasses = "mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300";

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 transition-colors duration-200">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300 transition-colors duration-200">
                There was a problem
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-200 transition-colors duration-200">
                <p>{error?.message || 'Something went wrong. Please try again.'}</p>
              </div>
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
          <Form className="space-y-8" aria-label="Corporate account form">
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              <div className="space-y-6 pt-0 transition-colors duration-300">
                <div>
                  <h3 className={sectionHeaderClasses}>Corporate Account Details</h3>
                  <p className={sectionDescClasses}>Basic information about the corporate account.</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input label="Company Name" name="companyName" type="text" aria-required="true" autoComplete="organization" />
                </div>
              </div>

              <div className="space-y-6 pt-6 transition-colors duration-300">
                <div>
                  <h3 className={sectionHeaderClasses}>Contact Information</h3>
                  <p className={sectionDescClasses}>How we can reach the company.</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input label="Phone" name="contact.phone" type="text" aria-required="true" autoComplete="tel" />
                  <Input label="Email" name="contact.email" type="email" aria-required="true" autoComplete="email" />
                </div>
              </div>

              <div className="space-y-6 pt-6 transition-colors duration-300">
                <div>
                  <h3 className={sectionHeaderClasses}>Address</h3>
                  <p className={sectionDescClasses}>Company address details.</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input label="Street" name="contact.address.street" type="text" autoComplete="street-address" />
                  <Input label="City" name="contact.address.city" type="text" autoComplete="address-level2" />
                  <Input label="County" name="contact.address.county" type="text" />
                  <Input label="Post Code" name="contact.address.postCode" type="text" autoComplete="postal-code" />
                  <Input label="Country" name="contact.address.country" type="text" />
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isPending}>
                {isPending ? <LoadingSpinner size="sm" /> : 'Save'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CorporateAccountForm;


