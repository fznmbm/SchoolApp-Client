import React, { useContext, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import StudentForm from "@components/forms/StudentForm";
import { getStudent, updateStudent, autoAssignRouteLabels } from "@services/student";
import { studentValidationSchema } from "@utils/validations";
import { ThemeContext } from "@context/ThemeContext";
import { Button } from "@components/common/Button";
import LoadingSpinner from "@components/common/Spinner";

const StudentEdit = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  // Fetch student data
  const {
    data: studentData,
    isLoading,
    isError: isFetchError,
    error: fetchError,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
    enabled: !!id,
  });

  // Update student mutation
  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: (formData) => updateStudent({ id, ...formData }),
    onSuccess: async (data) => {
      // If student was assigned to a route, auto-assign route labels
      if (data.data.assignedRoute) {
        try {
          await autoAssignRouteLabels([id], data.data.assignedRoute);
          // Invalidate queries to refresh data
          queryClient.invalidateQueries(['students']);
          queryClient.invalidateQueries(['student-labels']);
        } catch (labelError) {
          console.error('Error assigning route labels:', labelError);
          // Don't fail the entire operation if label assignment fails
        }
      }
      navigate("/students");
    },
  });

  // Handle form submission with proper data transformation
  const handleSubmit = useCallback((values, { setSubmitting }) => {
    // Check if we have any files to upload
    const hasFiles = values.specialCareNeeds?.some(need => need.file instanceof File);
    
    if (hasFiles) {
      // Create a FormData object to handle file uploads
      const formData = new FormData();

      // Process special care needs
      const specialCareNeeds = values.specialCareNeeds?.map((need, index) => {
        const needData = {
          type: need.type,
          description: need.description,
          fileUrl: need.fileUrl // Keep existing fileUrl if no new file
        };

        // If there's a new file uploaded, append it to formData
        if (need.file instanceof File) {
          const fileName = `specialCareNeed_${index}_${need.file.name}`;
          formData.append('documents', need.file, fileName);
          needData.fileUrl = fileName;
        }

        return needData;
      });

      // Prepare the text data with proper structure
      const textData = {
        ...values,
        specialCareNeeds, 
        parents: values.parents.map((parent) => ({
          ...parent,
          whatsapp: parent.whatsapp
            ? parent.whatsapp.replace(/\s+/g, "").replace(/-/g, "")
            : undefined,
        }))
      };

      // Append the JSON data
      formData.append('data', JSON.stringify(textData));
      
      // Submit the FormData
      mutate(formData);
    } else {
      // No files to upload, just send student data as regular JSON
      const updatedData = {
        ...values,
        parents: values.parents.map((parent) => ({
          ...parent,
          whatsapp: parent.whatsapp
            ? parent.whatsapp.replace(/\s+/g, "").replace(/-/g, "")
            : undefined,
        }))
      };
      
      mutate(updatedData);
    }
    
    setSubmitting(false);
  }, [mutate]);

  // Return to students list
  const handleBackToList = useCallback(() => {
    navigate("/students");
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300" aria-live="polite" aria-busy="true">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400" />
          <p className="mt-3 text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading student details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isFetchError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300" aria-live="assertive">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-300">
          <div className="text-red-500 dark:text-red-400 font-medium text-lg mb-2 transition-colors duration-300">
            Error Loading Student
          </div>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            {fetchError?.message || "Unable to load student details. Please try again later."}
          </p>
          <Button 
            variant="primary"
            onClick={handleBackToList}
            className="mt-4"
            aria-label="Return to students list"
          >
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const errorMessage = updateError?.response?.data?.message || updateError?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-colors duration-300">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300" id="edit-student-heading">
                Edit Student
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Update the student's details and parent/guardian information.
              </p>
            </div>

            <StudentForm
              editInitialValues={studentData}
              onSubmit={handleSubmit}
              validationSchema={studentValidationSchema}
              isError={isUpdateError}
              error={{ message: errorMessage }}
              isPending={isUpdating}
              aria-labelledby="edit-student-heading"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEdit;