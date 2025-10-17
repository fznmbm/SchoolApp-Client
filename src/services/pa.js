import axios from '@utils/api/axios';

export const getAllPAs = async (params) => {
  const response = await axios.get('/pa', { params });
  return response.data;
};

export const getPA = async (id) => {
  const response = await axios.get(`/pa/${id}`);
  return response.data.data;
};

export const getPAByNumber = async (paNumber) => {
  const response = await axios.get(`/pa/number/${paNumber}`);
  return response.data.data;
};

export const createPA = async (data) => {
  try {
    // If data is FormData (contains files), use multipart/form-data
    if (data instanceof FormData) {

      // Handle the case where FormData might contain trainingDocuments
      // and need to merge them into the documents field
      const originalData = data;
      const newFormData = new FormData();

      // Copy all fields except files to new FormData
      let documentFiles = [];
      let trainingFiles = [];

      // First pass: collect all files and other form data
      for (let [key, value] of originalData.entries()) {
        if (key === 'documents') {
          documentFiles.push(value);
        } else if (key === 'trainingDocuments') {
          trainingFiles.push(value);
        } else {
          newFormData.append(key, value);
        }
      }

      // Second pass: add all files to the documents field
      documentFiles.forEach(file => {
        newFormData.append('documents', file);
      });

      trainingFiles.forEach(file => {
        newFormData.append('documents', file);
      });


      const response = await axios.post('/pa', newFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    }
    // Regular JSON request (no files)
    else {
      const response = await axios.post('/pa', data);
      return response.data.data;
    }
  } catch (error) {
    console.error("Error in createPA service:", error);

    // Enhanced error handling
    if (error.response?.status === 413) {
      throw new Error("File is too large. Please upload a smaller document.");
    } else if (error.response?.status === 415) {
      throw new Error("Invalid file type. Please upload a supported document format.");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to create PA. Please try again later.");
    }
  }
};


export const updatePA = async ({ id, data, files = [], filesMetadata = [] }) => {

  try {
    // If we have files, use FormData for multipart/form-data
    if (files && files.length > 0) {
      const formData = new FormData();

      // Add the data as a JSON string
      formData.append('data', JSON.stringify(data));

      // Add filesMetadata as JSON if it exists
      if (filesMetadata && filesMetadata.length > 0) {
        formData.append('filesMetadata', JSON.stringify(filesMetadata));
      }

      // Important: Add each file to the FormData
      files.forEach((file, index) => {
        formData.append('documents', file);
      });

      // Make the request with the proper Content-Type header
      const response = await axios.put(`/pa/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } else {
      // No files - use regular JSON request
      const response = await axios.put(`/pa/${id}`, data);
      return response.data.data;
    }
  } catch (error) {
    console.error("Error in updatePA service:", error);
    throw error;
  }
};

export const deletePA = async (id) => {
  const response = await axios.delete(`/pa/${id}`);
  return response.data;
};

export const updatePADocuments = async ({ id, documentType, documentData }) => {
  const response = await axios.put(`/pa/${id}/documents`, {
    documentType,
    documentData
  });
  return response.data.data;
};

export const updatePATraining = async ({ id, trainingData }) => {
  const response = await axios.put(`/pa/${id}/training`, {
    trainingData
  });
  return response.data.data;
};