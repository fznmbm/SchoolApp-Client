import React, { useEffect, useState, useContext, useCallback } from "react";
import { Formik, Form, FieldArray } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Input from "@components/common/input/Input";
import Select from "@components/common/input/Select";
import FileUpload from "@components/common/input/FileUpload";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllTrainings } from "@/services/training";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "@components/common/Button"; 
import LoadingSpinner from "@components/common/Spinner"; 

const PA_STATUS = [
  { id: "ACTIVE", name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
];

const DOCUMENT_TYPES = [
  { id: "DBS", name: "DBS" },
];

const prepareInitialValues = (editInitialValues) => {
  return {
    name: editInitialValues?.name || "",
    shortName: editInitialValues?.shortName || "",
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
    documents: DOCUMENT_TYPES.map((doc) => {
      const existingDoc = editInitialValues?.documents?.find(
        (d) => d.type === doc.id
      );
      return {
        type: doc.id,
        number: existingDoc?.number || "",
        issuedDate: existingDoc?.issuedDate
          ? new Date(existingDoc.issuedDate).toISOString().split("T")[0]
          : "",
        expiryDate: existingDoc?.expiryDate
          ? new Date(existingDoc.expiryDate).toISOString().split("T")[0]
          : "",
        file: null,
        fileUrl: existingDoc?.file?.fileUrl || "",
        fileName: existingDoc?.file?.fileName || "",
        fileSize: existingDoc?.file?.fileSize || 0,
      };
    }),
    trainings: editInitialValues?.trainings?.map(training => ({
      name: training.name || "",
      completionDate: training.completionDate 
        ? new Date(training.completionDate).toISOString().split("T")[0]
        : "",
      certificateNumber: training.certificateNumber || "",
      expiryDate: training.expiryDate 
        ? new Date(training.expiryDate).toISOString().split("T")[0]
        : "",
      file: null,
      fileUrl: training.file?.fileUrl || "",
      fileName: training.file?.fileName || "",
      fileSize: training.file?.fileSize || 0,
    })) || [
      {
        name: "",
        completionDate: "",
        certificateNumber: "",
        expiryDate: "",
        file: null,
        fileUrl: "",
        fileName: "",
        fileSize: 0,
      },
    ],
    status: editInitialValues?.status || "ACTIVE",
  };
};

const transformFormData = (values) => {
  const formData = new FormData();
  
  const paData = {
    name: values.name,
    shortName: values.shortName,
    address: values.address,
    contact: values.contact,
    status: values.status
  };
  
  formData.append('data', JSON.stringify(paData));
  
  const documentMetadata = values.documents.map((doc, index) => ({
    type: doc.type,
    number: doc.number,
    issuedDate: doc.issuedDate,
    expiryDate: doc.expiryDate
  }));
  
  formData.append('documentMetadata', JSON.stringify(documentMetadata));
  
  const trainingMetadata = values.trainings.filter(t => t.name).map((training, index) => ({
    name: training.name,
    completionDate: training.completionDate,
    certificateNumber: training.certificateNumber,
    expiryDate: training.expiryDate
  }));
  
  formData.append('trainingMetadata', JSON.stringify(trainingMetadata));

  values.documents.forEach((doc, index) => {
    if (doc.file) {
      formData.append('documents', doc.file);
    }
  });
  
  values.trainings.forEach((training, index) => {
    if (training.file && training.name) {
      formData.append('documents', training.file); 
    }
  });
  
  return formData;
};

const SectionHeading = ({ title, description }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {title}
    </h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
      {description}
    </p>
  </div>
);

const PAForm = ({
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
  
  const [initialValues, setInitialValues] = useState(() =>
    prepareInitialValues(editInitialValues)
  );

  const { data: trainingsResponse } = useQuery({
    queryKey: ["trainings"],
    queryFn: async () => {
      const response = await getAllTrainings({ page: 1, limit: 100 });
      return response;
    }
  });

  const trainingsOptions = React.useMemo(() => {
    if (!trainingsResponse) return [];

    return trainingsResponse.map(training => ({
      id: training._id,
      name: training.trainingName
    }));
  }, [trainingsResponse]);

  useEffect(() => {
    if (editInitialValues) {
      setInitialValues(prepareInitialValues(editInitialValues));
    }
  }, [editInitialValues]);

  const handleSubmit = useCallback(async (values, formikHelpers) => {
    try {
      console.log("Submitting PA form with values:", values);
      
      const formData = transformFormData(values);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("FormData contents:");
        for (let pair of formData.entries()) {
          if (pair[0] === 'documents' || pair[0] === 'trainingDocuments') {
            console.log(`${pair[0]}: File object - ${pair[1].name}`);
          } else {
            console.log(`${pair[0]}: ${typeof pair[1] === 'string' ? pair[1] : 'Object'}`);
          }
        }
      }
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      formikHelpers.setSubmitting(false);
    }
  }, [onSubmit]);

  const handleCancel = useCallback(() => {
    navigate("/pa");
  }, [navigate]);

  return (
    <div className="transition-colors duration-300 ease-in-out">
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
                {error?.message || "An error occurred while saving the PA"}
              </p>
            </div>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="space-y-8" aria-label="Personal Assistant form" encType="multipart/form-data">
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {/* Basic Information */}
              <div className="space-y-6 pt-8 first:pt-0">
                <SectionHeading
                  title="PA Details"
                  description="Basic information about the Personal Assistant."
                />

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input 
                    label="Name" 
                    name="name" 
                    type="text" 
                    aria-required="true"
                    autoComplete="name"
                  />
                  <Input 
                    label="Short Name" 
                    name="shortName" 
                    type="text" 
                    aria-required="true"
                  />
                  <Select 
                    label="Status" 
                    name="status" 
                    options={PA_STATUS} 
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 pt-8">
                <SectionHeading
                  title="Contact Information"
                  description="Contact details for the Personal Assistant."
                />

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

              {/* Address Information */}
              <div className="space-y-6 pt-8">
                <SectionHeading
                  title="Address"
                  description="Location details of the Personal Assistant."
                />

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input 
                      label="Street" 
                      name="address.street" 
                      type="text"
                      autoComplete="street-address"
                      aria-required="true"
                    />
                  </div>
                  <Input 
                    label="City" 
                    name="address.city" 
                    type="text"
                    autoComplete="address-level2"
                    aria-required="true"
                  />
                  <Input 
                    label="County" 
                    name="address.county" 
                    type="text"
                    autoComplete="address-level1"
                    aria-required="true"
                  />
                  <Input 
                    label="Post Code" 
                    name="address.postCode" 
                    type="text"
                    autoComplete="postal-code"
                    aria-required="true"
                  />
                  <Input 
                    label="Country" 
                    name="address.country" 
                    type="text" 
                    autoComplete="country-name"
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-6 pt-8">
                <SectionHeading
                  title="Documents"
                  description="Required documents and certifications."
                />

                <div className="space-y-6">
                  {DOCUMENT_TYPES.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm 
                                bg-white dark:bg-gray-800 transition-colors duration-300"
                    >
                      <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                        {doc.name}
                      </h4>
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <Input
                          label="Document Number"
                          name={`documents[${index}].number`}
                          type="text"
                          aria-required="true"
                        />
                        <Input
                          label="Issue Date"
                          name={`documents[${index}].issuedDate`}
                          type="date"
                          aria-required="true"
                        />
                        <Input
                          label="Expiry Date"
                          name={`documents[${index}].expiryDate`}
                          type="date"
                          aria-required="true"
                        />
                        <div className="sm:col-span-2">
                          <FileUpload
                            label="Document File"
                            name={`documents[${index}].file`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            maxSize={5 * 1024 * 1024} // 5MB
                            helperText="Supported formats: PDF, JPG, PNG (Max 5MB)"
                            existingFile={values.documents[index].fileUrl}
                            existingFileName={values.documents[index].fileName}
                            aria-required="true"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Information */}
              <div className="space-y-6 pt-8">
                <SectionHeading
                  title="Trainings"
                  description="Training records and certifications."
                />

                <FieldArray name="trainings">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.trainings.map((_, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm 
                                    bg-white dark:bg-gray-800 transition-colors duration-300"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                              Training Record {index + 1}
                            </h4>
                            {values.trainings.length > 1 && (
                              <Button
                                variant="danger"
                                size="sm"
                                type="button"
                                onClick={() => remove(index)}
                                aria-label={`Remove training record ${index + 1}`}
                              >
                                Remove
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <Select
                              label="Training"
                              name={`trainings.${index}.name`}
                              options={trainingsOptions}
                              aria-required="true"
                            />
                            <Input
                              label="Certificate Number"
                              name={`trainings.${index}.certificateNumber`}
                              type="text"
                              aria-required="true"
                            />
                            <Input
                              label="Completion Date"
                              name={`trainings.${index}.completionDate`}
                              type="date"
                              aria-required="true"
                            />
                            <Input
                              label="Expiry Date"
                              name={`trainings.${index}.expiryDate`}
                              type="date"
                              aria-required="true"
                            />
                            <div className="sm:col-span-2">
                              <FileUpload
                                label="Certificate"
                                name={`trainings.${index}.file`}
                                accept=".pdf,.jpg,.jpeg,.png"
                                maxSize={5 * 1024 * 1024} // 5MB
                                helperText="Supported formats: PDF, JPG, PNG (Max 5MB)"
                                existingFile={values.trainings[index].fileUrl}
                                existingFileName={values.trainings[index].fileName}
                                aria-required="true"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                          push({
                            name: "",
                            completionDate: "",
                            certificateNumber: "",
                            expiryDate: "",
                            file: null,
                            fileUrl: "",
                            fileName: "",
                            fileSize: 0,
                          })
                        }
                        className="mt-4"
                        aria-label="Add new training record"
                      >
                        Add Training
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                  aria-label="Cancel and return to PA list"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  aria-label={editInitialValues?._id ? "Update PA information" : "Create new PA"}
                >
                  {isPending ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2 -ml-1" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    editInitialValues?._id ? "Update PA" : "Create PA"
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

export default PAForm;