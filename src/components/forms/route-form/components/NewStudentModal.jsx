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
import Select from "@/components/common/input/Select";
import { Button } from "@/components/common/Button";
import LoadingSpinner from "@/components/common/Spinner";
import { ThemeContext } from "@context/ThemeContext";
import { createStudent } from "@/services/student";
import PropTypes from "prop-types";

const NewStudentSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  grade: Yup.string().required("Grade is required"),
  school: Yup.string().required("School is required"),
  parent: Yup.object().shape({
    name: Yup.string().required("Parent name is required"),
    relationship: Yup.string().required("Relationship is required"),
    whatsapp: Yup.string().required("WhatsApp number is required"),
    address: Yup.object().shape({
      street: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      postCode: Yup.string().required("Post code is required"),
    }),
  }),
});

const RELATIONSHIPS = [
  { id: "mother", name: "Mother" },
  { id: "father", name: "Father" },
  { id: "guardian", name: "Guardian" },
  { id: "other", name: "Other" },
];

const NewStudentModal = ({ isOpen, onClose, onStudentCreated, schools }) => {
  const { theme } = useContext(ThemeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    firstName: "",
    lastName: "",
    grade: "",
    school: "",
    parent: {
      name: "",
      relationship: "",
      whatsapp: "",
      address: {
        street: "",
        city: "",
        county: "",
        postCode: "",
      },
    },
  };

  const schoolOptions = Array.isArray(schools)
    ? schools.map((school) => ({
        id: school._id,
        name: school.name,
      }))
    : [];

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const studentData = {
        firstName: values.firstName,
        lastName: values.lastName,
        grade: values.grade,
        school: values.school,
        parents: [
          {
            name: values.parent.name,
            relationship: values.parent.relationship,
            whatsapp: values.parent.whatsapp,
            address: values.parent.address
          }
        ],
        isActive: true
      };

      const response = await createStudent(studentData);
      
      onStudentCreated(response.data || response);
      onClose();
    } catch (err) {
      console.error("Error creating student:", err);
      setError(err.message || "Failed to create student");
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
                    Add New Student
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
                  validationSchema={NewStudentSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isValid, dirty }) => (
                    <Form className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                          Student Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="First Name"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            required
                          />
                          <Input
                            label="Last Name"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            required
                          />
                          <Select
                            label="School"
                            name="school"
                            options={schoolOptions}
                            placeholder="Select a school"
                            required
                          />
                          <Input
                            label="Grade"
                            name="grade"
                            type="text"
                            placeholder="e.g. 10th"
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                          Parent/Guardian Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Name"
                            name="parent.name"
                            type="text"
                            autoComplete="name"
                            required
                          />
                          <Select
                            label="Relationship"
                            name="parent.relationship"
                            options={RELATIONSHIPS}
                            placeholder="Select relationship"
                            required
                          />
                          <Input
                            label="WhatsApp Number"
                            name="parent.whatsapp"
                            type="tel"
                            autoComplete="tel"
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                          Address
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Street Address"
                            name="parent.address.street"
                            type="text"
                            autoComplete="street-address"
                            required
                          />
                          <Input
                            label="City"
                            name="parent.address.city"
                            type="text"
                            autoComplete="address-level2"
                            required
                          />
                          <Input
                            label="County"
                            name="parent.address.county"
                            type="text"
                            autoComplete="address-level1"
                          />
                          <Input
                            label="Post Code"
                            name="parent.address.postCode"
                            type="text"
                            autoComplete="postal-code"
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
                            "Create Student"
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

NewStudentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStudentCreated: PropTypes.func.isRequired,
  schools: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default NewStudentModal;