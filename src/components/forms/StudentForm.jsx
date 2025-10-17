import React, { useState, useContext, useCallback } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon,
  DocumentPlusIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import Input from "../common/input/Input";
import Select from "../common/input/Select";
import { RELATIONSHIPS } from "../../config/constants";
import { getAllSchools } from "@/services/school";
import { getRoutes } from "@/services/route";
import FileUpload from "../common/input/FileUpload";
import { Button } from "@components/common/Button";
import LoadingSpinner from "@components/common/Spinner";
import { ThemeContext } from "@context/ThemeContext";
import NewSchoolModal from "@/components/forms/route-form/components/NewSchoolModal";

const StudentForm = ({
  editInitialValues,
  onSubmit,
  validationSchema,
  isError,
  error,
  isPending,
}) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const queryClient = useQueryClient();
  
  const [isNewSchoolModalOpen, setIsNewSchoolModalOpen] = useState(false);

  const [hasSpecialCareNeeds, setHasSpecialCareNeeds] = useState(
    editInitialValues?.specialCareNeeds?.length > 0 || false
  );

  const initialValues = editInitialValues
    ? {
      ...editInitialValues,
      school: editInitialValues?.school?._id || null,
      assignedRoute: editInitialValues?.assignedRoute?._id || editInitialValues?.assignedRoute || null,
      document: editInitialValues?.document
        ? {
          ...editInitialValues.document,
          type: editInitialValues.document.fileMimeType,
          name: editInitialValues.document.fileName,
          size: editInitialValues.document.fileSize
        }
        : null,
      specialCareNeeds:
        editInitialValues?.specialCareNeeds?.map((need) => ({
          ...need,
        })) || [],
    }
    : {
      firstName: "",
      lastName: "",
      grade: "",
      school: null,
      assignedRoute: null,
      document: null,
      parents: [
        {
          name: "",
          relationship: null,
          whatsapp: "",
          address: {
            street: "",
            city: "",
            county: "",
            postCode: "",
          },
        },
      ],
      specialCareNeeds: [],
      isActive: true,
    };

  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
  });

  const { data: schools, isLoading, refetch } = useQuery({
    queryKey: ["schools", searchParams],
    queryFn: () => getAllSchools(searchParams),
  });

  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutes({ isActive: true }),
  });

  const schoolOptions =
    schools?.map((school) => ({
      id: school._id,
      name: school.name,
    })) || [];

  const routeOptions = [
    { id: null, name: "No Route Assignment" },
    ...(routes?.map((route) => ({
      id: route._id,
      name: `Route ${route.routeNo} - ${route.name}`,
    })) || [])
  ];

  const handleCancel = useCallback(() => {
    navigate("/students");
  }, [navigate]);
  
  const handleNewSchoolCreated = useCallback((newSchool) => {
    setIsNewSchoolModalOpen(false);
    
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 rounded-md p-4 shadow-lg z-50 transition-opacity duration-500';
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="h-5 w-5 mr-2 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>School ${newSchool.name} added successfully!</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 4000);
    
    if (queryClient) {
      queryClient.invalidateQueries(['schools']);
      refetch();  
    }
  }, [queryClient, refetch]);

  const sectionHeaderClasses = "text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300";
  const sectionDescClasses = "mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300";
  const cardClasses = "p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300";

  const ParentFields = ({ index, remove }) => (
    <div className={`relative ${cardClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className={sectionHeaderClasses}>
          {index === 0
            ? "Primary Parent/Guardian"
            : "Secondary Parent/Guardian"}
        </h4>
        {index > 0 && (
          <Button
            variant="danger"
            size="sm"
            type="button"
            onClick={() => remove(index)}
            aria-label={`Remove ${index === 0 ? 'primary' : 'secondary'} parent/guardian`}
            className="p-2 rounded-full"
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <Input
          label="Name"
          name={`parents.${index}.name`}
          type="text"
          placeholder="Enter full name"
          autoComplete="name"
          aria-required="true"
        />
        <Select
          label="Relationship"
          name={`parents.${index}.relationship`}
          options={RELATIONSHIPS}
          aria-required="true"
        />

        <Input
          label="WhatsApp"
          name={`parents.${index}.whatsapp`}
          type="tel"
          placeholder="Enter WhatsApp number"
          inputMode="tel"
          autoComplete="tel"
          aria-required="true"
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
            Address Information
          </h4>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700 mx-4 transition-colors duration-300"></div>
        </div>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <Input
            label="Street"
            name={`parents.${index}.address.street`}
            type="text"
            placeholder="Enter street address"
            autoComplete="street-address"
            aria-required="true"
          />
          <Input
            label="City"
            name={`parents.${index}.address.city`}
            type="text"
            placeholder="Enter city"
            autoComplete="address-level2"
            aria-required="true"
          />
          <Input
            label="County"
            name={`parents.${index}.address.county`}
            type="text"
            placeholder="Enter county"
            autoComplete="address-level1"
            aria-required="true"
          />
          <Input
            label="Post Code"
            name={`parents.${index}.address.postCode`}
            type="text"
            placeholder="Enter post code"
            autoComplete="postal-code"
            aria-required="true"
          />
        </div>
      </div>
    </div>
  );

  const SpecialCareNeedFields = ({ index, remove }) => (
    <div className={`relative ${cardClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className={sectionHeaderClasses}>
          Special Care Need {index + 1}
        </h4>
        <Button
          variant="danger"
          size="sm"
          type="button"
          onClick={() => remove(index)}
          aria-label={`Remove special care need ${index + 1}`}
          className="p-2 rounded-full"
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4">
        <Input
          label="Type of Special Care Need"
          name={`specialCareNeeds.${index}.type`}
          type="text"
          placeholder="Enter type of special need"
          aria-required="true"
        />
        <Input
          label="Description"
          name={`specialCareNeeds.${index}.description`}
          type="textarea"
          placeholder="Provide detailed description of the special care need"
          aria-required="true"
        />
      </div>
    </div>
  );

  return (
    <div className="transition-colors duration-300 ease-in-out">
      {/* Add School Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => setIsNewSchoolModalOpen(true)}
          className="inline-flex items-center py-2 px-4"
          size="sm"
        >
          <PlusCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          School
        </Button>
      </div>
      
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
                {error?.message ||
                  "An error occurred while creating the student"}
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
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className="space-y-8" aria-label="Student information form">
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {/* Basic Information */}
              <div className="space-y-6 pt-8 first:pt-0">
                <div>
                  <h3 className={sectionHeaderClasses}>
                    Basic Information
                  </h3>
                  <p className={sectionDescClasses}>
                    Student's personal and academic details.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    aria-required="true"
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    aria-required="true"
                  />
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Select
                    label="School"
                    name="school"
                    options={schoolOptions}
                    aria-required="true"
                  />
                  <Input
                    label="Grade"
                    name="grade"
                    type="text"
                    aria-required="true"
                  />
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Select
                    label="Assigned Route (Optional)"
                    name="assignedRoute"
                    options={routeOptions}
                    aria-required="false"
                    helperText="Select a route to automatically group this student with others on the same route"
                  />
                </div>
              </div>

              <div className="mt-6">
                <FileUpload
                  label="Student Document"
                  name="document"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  maxSize={5 * 1024 * 1024} // 5MB
                  helperText="Upload student document (Max 5MB)"
                  aria-required="false"
                />
              </div>

              {/* Parents Section */}
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className={sectionHeaderClasses}>
                    Parents/Guardians
                  </h3>
                  <p className={sectionDescClasses}>
                    Add contact information for parents or guardians.
                  </p>
                </div>

                <FieldArray name="parents">
                  {({ push, remove }) => (
                    <div className="space-y-6">
                      {values.parents.map((_, index) => (
                        <ParentFields
                          key={index}
                          index={index}
                          remove={remove}
                        />
                      ))}

                      {values.parents.length < 2 && (
                        <div className="flex flex-col items-start">
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={() =>
                              push({
                                name: "",
                                relationship: "",
                                whatsapp: "",
                                address: {
                                  street: "",
                                  city: "",
                                  county: "",
                                  postCode: "",
                                },
                              })
                            }
                            aria-label={values.parents.length === 0
                              ? "Add parent or guardian"
                              : "Add secondary parent or guardian"}
                          >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            {values.parents.length === 0
                              ? "Add Parent/Guardian"
                              : "Add Secondary Parent/Guardian"}
                          </Button>
                          {values.parents.length === 1 && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                              You can add one more parent/guardian (optional)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Special Care Needs Section */}
              <div className="space-y-6 pt-8">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasSpecialCareNeeds"
                    checked={hasSpecialCareNeeds}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setHasSpecialCareNeeds(checked);
                      if (!checked) {
                        setFieldValue("specialCareNeeds", []);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-300"
                    aria-label="Student has special care needs"
                  />
                  <label
                    htmlFor="hasSpecialCareNeeds"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300"
                  >
                    Student has special care needs
                  </label>
                </div>

                {hasSpecialCareNeeds && (
                  <>
                    <div>
                      <h3 className={sectionHeaderClasses}>
                        Special Care Needs
                      </h3>
                      <p className={sectionDescClasses}>
                        Provide details about any special care requirements for
                        the student.
                      </p>
                    </div>
                    <FieldArray name="specialCareNeeds">
                      {({ push, remove }) => (
                        <div className="space-y-6">
                          {values.specialCareNeeds.map((_, index) => (
                            <SpecialCareNeedFields
                              key={index}
                              index={index}
                              remove={remove}
                            />
                          ))}

                          {values.specialCareNeeds.length < 3 && (
                            <div className="flex flex-col items-start">
                              <Button
                                variant="secondary"
                                type="button"
                                onClick={() =>
                                  push({
                                    type: "",
                                    description: "",
                                  })
                                }
                                aria-label={values.specialCareNeeds.length === 0
                                  ? "Add special care need"
                                  : "Add another special care need"}
                              >
                                <DocumentPlusIcon className="h-5 w-5 mr-2" />
                                {values.specialCareNeeds.length === 0
                                  ? "Add Special Care Need"
                                  : "Add Another Special Care Need"}
                              </Button>
                              {values.specialCareNeeds.length > 0 && (
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                  Maximum 3 special care needs can be added
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </FieldArray>
                  </>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                  aria-label="Cancel and return to students list"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || isPending}
                  aria-busy={isSubmitting || isPending}
                  aria-label={initialValues._id ? "Update student" : "Create student"}
                >
                  {isSubmitting || isPending ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2 -ml-1" />
                      <span>Saving...</span>
                    </>
                  ) : initialValues._id ? (
                    "Update Student"
                  ) : (
                    "Create Student"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      
      {/* Modal for creating a new school */}
      {isNewSchoolModalOpen && (
        <NewSchoolModal
          isOpen={isNewSchoolModalOpen}
          onClose={() => setIsNewSchoolModalOpen(false)}
          onSchoolCreated={handleNewSchoolCreated}
        />
      )}
    </div>
  );
};

export default StudentForm;