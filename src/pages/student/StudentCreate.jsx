import React, { useContext, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import StudentForm from "@components/forms/StudentForm";
import { createStudent, autoAssignRouteLabels } from "@services/student";
import { studentValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";

const StudentCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createStudent,
    onSuccess: async (data) => {
      // If student was assigned to a route, auto-assign route labels
      if (data.data.assignedRoute) {
        try {
          await autoAssignRouteLabels([data.data._id], data.data.assignedRoute);
          // Invalidate queries to refresh data
          queryClient.invalidateQueries(['students']);
          queryClient.invalidateQueries(['labels']);
        } catch (labelError) {
          console.error('Error assigning route labels:', labelError);
          // Don't fail the entire operation if label assignment fails
        }
      }
      navigate("/students");
    },
  });

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    try {
      // Prepare the cleaned data with formatted fields
      const cleanedData = {
        ...values,
        specialCareNeeds: values.specialCareNeeds.map(need => ({
          type: need.type,
          description: need.description,
        })),
        parents: values.parents.map(parent => ({
          ...parent,
          whatsapp: parent.whatsapp ? parent.whatsapp.replace(/\\s+/g, '').replace(/-/g, '') : undefined,
        }))
      };

      // Check if we have a document to upload
      if (values.document instanceof File) {
        // Create FormData for multipart upload
        const formData = new FormData();
        
        // Extract document from the data that will be stringified
        const { document, ...studentData } = cleanedData;
        
        // Add student data as JSON string
        formData.append('data', JSON.stringify(studentData));
        
        // Add document file using the field name 'documents' (plural) to match server middleware
        formData.append('documents', document, document.name);
        
        // Add document metadata
        formData.append('documentMetadata', JSON.stringify([{
          description: `${values.firstName} ${values.lastName} document`,
          type: 'STUDENT_DOCUMENT'
        }]));
        
        // Submit the form data
        mutate(formData);
      } else {
        // No files to upload, proceed with normal JSON request
        mutate(cleanedData);
      }
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setSubmitting(false);
    }
  }, [mutate]);


  const errorMessage = error?.response?.data?.message || error?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-colors duration-300">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Create New Student
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Add a new student to the system with their details and parent/guardian information.
              </p>
            </div>

            <StudentForm
              onSubmit={handleSubmit}
              validationSchema={studentValidationSchema}
              isError={isError}
              error={{ message: errorMessage }}
              isPending={isPending}
              aria-labelledby="create-student-heading"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCreate;