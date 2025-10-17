import React, { useContext, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import PAForm from "@/components/forms/PAEditForm";
import { getPA, updatePA } from "@services/pa";
import { paValidationSchema } from "@utils/validations";
import { ThemeContext } from "@/context/ThemeContext";


const PageHeader = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {title}
    </h1>
    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
      {description}
    </p>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400" 
         role="status" 
         aria-label="Loading PA data">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
    <div className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-md shadow-sm transition-colors duration-200" 
         role="alert" 
         aria-live="assertive">
      <p className="font-medium">Error loading PA</p>
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

const PAEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext);

  const { 
    data: paData, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useQuery({
    queryKey: ["pa", id],
    queryFn: () => getPA(id),
    enabled: !!id,
  });

  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: ({ data, files, filesMetadata }) => {
      // If we have a proper data structure from our form
      if (data && typeof data === 'object') {
        // Process documents to include IDs from existing documents
        if (data.documents && Array.isArray(data.documents)) {
          data.documents = data.documents.map(doc => {
            // If the document already has an ID, use it
            if (doc._id) return doc;
            
            // Otherwise, try to find matching document by type
            const existingDoc = paData?.documents?.find(d => d.type === doc.type);
            if (existingDoc) {
              return {
                ...doc,
                _id: existingDoc._id
              };
            }
            
            return doc;
          });
        }
        
        // Process trainings to include IDs from existing trainings
        if (data.trainings && Array.isArray(data.trainings)) {
          data.trainings = data.trainings.map(training => {
            // If the training already has an ID, use it
            if (training._id) return training;
            
            // For new trainings, make sure to just use the ID 
            // not the full nameObject that might be included
            if (training.nameId && typeof training.name === 'undefined') {
              training.name = training.nameId;
              delete training.nameId;
            }
            
            return training;
          });
        }
        
        // Process file metadata to match existing entities if needed
        if (filesMetadata && Array.isArray(filesMetadata)) {
          filesMetadata = filesMetadata.map(meta => {
            if (meta.type === 'document' && !meta.entityId) {
              // Try to find matching document
              const matchingDoc = paData?.documents?.find(d => 
                meta.newEntityData && d.type === meta.newEntityData.type
              );
              if (matchingDoc) {
                meta.entityId = matchingDoc._id;
                meta.newEntityData = null;
              }
            } 
            else if (meta.type === 'training' && !meta.entityId) {
              // For trainings, match by name ID
              const matchingTraining = paData?.trainings?.find(t => 
                meta.newEntityData && 
                t.name && 
                meta.newEntityData.name && 
                t.name._id === meta.newEntityData.name
              );
              if (matchingTraining) {
                meta.entityId = matchingTraining._id;
                meta.newEntityData = null;
              }
            }
            return meta;
          });
        }
        
        return updatePA({ id, data, files, filesMetadata });
      }
      
      // Fallback for direct FormData submission (not expected with new implementation)
      return updatePA({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pas'] });
      queryClient.invalidateQueries({ queryKey: ['pa', id] });
      navigate("/pa");
    },
    onError: (error) => {
      console.error('Error updating PA:', error);
    }
  });

  const handleSubmit = useCallback((formData) => {
    mutate(formData);
  }, [mutate]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isFetchError) {
    return <ErrorState message={fetchError.message} />;
  }

  const errorMessage = updateError?.response?.data?.message || updateError?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl transition-colors duration-200">
          <div className="px-4 py-6 sm:p-8">
            <PageHeader 
              title="Edit Personal Assistant" 
              description="Update the personal assistant's details." 
            />

            <PAForm
              editInitialValues={paData}
              onSubmit={handleSubmit}
              validationSchema={paValidationSchema}
              isError={isUpdateError}
              error={{ message: errorMessage }}
              isPending={isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PAEdit;