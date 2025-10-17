import React, { useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Input from "@/components/common/input/Input";
import { Button } from "@/components/common/Button";
import LoadingSpinner from "@/components/common/Spinner";
import { ThemeContext } from "@context/ThemeContext";
import { createSchool } from "@/services/school";
import PropTypes from "prop-types";

const NewSchoolSchema = Yup.object().shape({
  name: Yup.string().required("School name is required"),
  address: Yup.object().shape({
    street: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    county: Yup.string(),
    postCode: Yup.string().required("Post code is required"),
  }),
  contact: Yup.object().shape({
    contactPerson: Yup.string().required("Contact person is required"),
    phone: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
  operatingHours: Yup.object().shape({
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string().required("End time is required"),
  }),
});

const NewSchoolModal = ({ isOpen, onClose, onSchoolCreated }) => {
  const { theme } = useContext(ThemeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    name: "",
    address: {
      street: "",
      city: "",
      county: "",
      postCode: "",
    },
    contact: {
      contactPerson: "",
      phone: "",
      email: "",
    },
    operatingHours: {
      startTime: "",
      endTime: "",
    },
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const schoolData = {
        ...values,
        isActive: true
      };

      const response = await createSchool(schoolData);
      
      onSchoolCreated(response);
      onClose();
    } catch (err) {
      console.error("Error creating school:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Failed to create school");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => !isSubmitting && onClose()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50 transition-colors duration-200" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  >
                    Add New School
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 transition-colors duration-200">
                    <div className="flex">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-200"
                        aria-hidden="true"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-200">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Formik
                  initialValues={initialValues}
                  validationSchema={NewSchoolSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isValid, dirty }) => (
                    <Form className="space-y-6">
                      {/* School Details */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                          School Details
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          <Input
                            label="School Name"
                            name="name"
                            type="text"
                            required
                          />
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                          Contact Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Contact Person"
                            name="contact.contactPerson"
                            type="text"
                            required
                          />
                          <Input
                            label="Phone Number"
                            name="contact.phone"
                            type="tel"
                            autoComplete="tel"
                            required
                          />
                          <Input
                            label="Email Address"
                            name="contact.email"
                            type="email"
                            autoComplete="email"
                            required
                          />
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                          Address
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <Input
                              label="Street Address"
                              name="address.street"
                              type="text"
                              autoComplete="street-address"
                              required
                            />
                          </div>
                          <Input
                            label="City"
                            name="address.city"
                            type="text"
                            autoComplete="address-level2"
                            required
                          />
                          <Input
                            label="County"
                            name="address.county"
                            type="text"
                            autoComplete="address-level1"
                          />
                          <Input
                            label="Post Code"
                            name="address.postCode"
                            type="text"
                            autoComplete="postal-code"
                            required
                          />
                        </div>
                      </div>

                      {/* Operating Hours */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                          Operating Hours
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Start Time"
                            name="operatingHours.startTime"
                            type="time"
                            required
                          />
                          <Input
                            label="End Time"
                            name="operatingHours.endTime"
                            type="time"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors duration-200">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={onClose}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting || !isValid || !dirty}
                        >
                          {isSubmitting ? (
                            <>
                              <LoadingSpinner className="w-5 h-5 mr-2 -ml-1" />
                              <span>Creating...</span>
                            </>
                          ) : (
                            "Create School"
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

NewSchoolModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSchoolCreated: PropTypes.func.isRequired,
};

export default NewSchoolModal;