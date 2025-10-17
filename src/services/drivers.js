import axios from "../utils/api/axios";

export const getDrivers = async (params) => {
  const response = await axios.get("/drivers", { params });
  return response.data.data;
};

export const deleteDriverById = async (id) => {
  const response = await axios.delete(`/drivers/${id}`);
  return response.data;
};

export const getDriver = async (id) => {
  const response = await axios.get(`/drivers/${id}`);
  return response.data.data;
};

export const getDriversByCapacity = async (params) => {
  const response = await axios.get("/drivers/capacity", {
    params: {
      capacity: params.capacity
    }
  });
  return response.data.data;
};

export const createDriver = async (data) => {
  // Create FormData for multipart upload
  const formData = new FormData();
  
  // Clone the data to avoid modifying the original
  const driverData = JSON.parse(JSON.stringify(data));
  
  // Process driver documents
  if (data.documents?.length > 0) {
    // Create metadata to match files with documents
    const driverDocumentMetadata = data.documents
      .filter(doc => doc.file)
      .map(doc => ({
        type: doc.type,
        number: doc.number,
        description: doc.description || `${doc.type} document`
      }));
    
    if (driverDocumentMetadata.length > 0) {
      formData.append('driverDocumentMetadata', JSON.stringify(driverDocumentMetadata));
    }
    
    // Remove file objects from driverData before JSON stringification
    driverData.documents = driverData.documents.map(doc => {
      const { file, ...rest } = doc;
      return rest;
    });
    
    // Add driver documents to formData
    data.documents.forEach((doc) => {
      if (doc.file) {
        formData.append('driverDocuments', doc.file);
      }
    });
  }
  
  // Process vehicle documents if they exist
  if (data.vehicle?.documents?.length > 0) {
    // Create metadata to match files with vehicle documents
    const vehicleDocumentMetadata = data.vehicle.documents
      .filter(doc => doc.file)
      .map(doc => ({
        type: doc.type,
        number: doc.number,
        description: doc.description || `Vehicle ${doc.type} document`
      }));
    
    if (vehicleDocumentMetadata.length > 0) {
      formData.append('vehicleDocumentMetadata', JSON.stringify(vehicleDocumentMetadata));
    }
    
    // Remove file objects from vehicle data before JSON stringification
    driverData.vehicle.documents = driverData.vehicle.documents.map(doc => {
      const { file, ...rest } = doc;
      return rest;
    });
    
    // Add vehicle documents to formData
    data.vehicle.documents.forEach((doc) => {
      if (doc.file) {
        formData.append('vehicleDocuments', doc.file);
      }
    });
  }
  
  // Process training documents if they exist
  if (data.trainings?.length > 0) {
    // Create metadata to match files with trainings
    const trainingDocumentMetadata = data.trainings
      .filter(training => training.file)
      .map(training => ({
        training: training.training, // Include training ID for matching
        certificateNumber: training.certificateNumber,
        description: training.description || 'Training certificate'
      }));
    
    if (trainingDocumentMetadata.length > 0) {
      formData.append('trainingDocumentMetadata', JSON.stringify(trainingDocumentMetadata));
    }
    
    // Remove file objects from training data before JSON stringification
    driverData.trainings = driverData.trainings.map(training => {
      const { file, ...rest } = training;
      return rest;
    });
    
    // Add training documents to formData
    data.trainings.forEach((training) => {
      if (training.file) {
        formData.append('trainingDocuments', training.file);
      }
    });
  }
  
  // Add driver data as JSON string
  formData.append('driverData', JSON.stringify(driverData));
  
  // Check if we have any files to upload
  const hasFiles = 
    data.documents?.some(doc => doc.file) || 
    data.vehicle?.documents?.some(doc => doc.file) ||
    data.trainings?.some(training => training.file);
  
  try {
    if (hasFiles) {
      // Send with multipart/form-data when we have files
      const response = await axios.post('/drivers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // No files to upload, proceed with normal JSON request
      const response = await axios.post('/drivers', driverData);
      return response.data;
    }
  } catch (error) {
    console.error('Driver creation error:', error);
    console.error('Details:', error.response?.data || error.message);
    throw error;
  }
};

export const updateDriver = async ({ id, ...driverData }) => {
  const formData = new FormData();

  // Add driver documents if they exist
  if (driverData.documents) {
    driverData.documents.forEach((doc) => {
      if (doc.file instanceof File) {
        formData.append("driverDocuments", doc.file);
      }
    });
  }

  // Add vehicle documents if they exist
  if (driverData.vehicle?.documents) {
    driverData.vehicle.documents.forEach((doc) => {
      if (doc.file instanceof File) {
        formData.append("vehicleDocuments", doc.file);
      }
    });
  }

  // Add training documents if they exist
  if (driverData.trainings) {
    // Append training files
    driverData.trainings.forEach((training) => {
      if (training.file instanceof File) {
        formData.append("trainingDocuments", training.file);
      }
    });

    // Create metadata to match training files server-side
    const trainingDocumentMetadata = driverData.trainings
      .filter(t => t.file instanceof File)
      .map(t => ({
        training: t.training,
        certificateNumber: t.certificateNumber
      }));
    if (trainingDocumentMetadata.length > 0) {
      formData.append('trainingDocumentMetadata', JSON.stringify(trainingDocumentMetadata));
    }
  }

  // Remove file objects from the data before stringifying
  const cleanData = {
    ...driverData,
    documents: driverData.documents?.map(({ file, ...rest }) => rest),
    vehicle: driverData.vehicle
      ? {
          ...driverData.vehicle,
          documents: driverData.vehicle.documents?.map(({ file, ...rest }) => rest),
        }
      : undefined,
    trainings: driverData.trainings?.map(({ file, description, ...rest }) => rest),
  };

  formData.append("driverData", JSON.stringify(cleanData));

  const response = await axios.put(`/drivers/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateDriverDocuments = async (id, documentData) => {
  const formData = new FormData();

  // Add document files if they exist
  if (documentData.documents) {
    documentData.documents.forEach((doc) => {
      if (doc.file) {
        formData.append("documents", doc.file);
      }
    });
  }

  // Remove file objects from the data before stringifying
  const cleanData = {
    ...documentData,
    documents: documentData.documents?.map(({ file, ...rest }) => rest),
  };

  formData.append("documentData", JSON.stringify(cleanData));

  const response = await axios.put(`/drivers/${id}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const verifyVehicle = async (id, verificationData) => {
  const response = await axios.put(
    `/drivers/${id}/vehicle/verify`,
    verificationData
  );
  return response.data;
};

export const getDriverStats = async (id) => {
  const response = await axios.get(`/drivers/${id}/stats`);
  return response.data;
};

export const getDriverAssignments = async (id, params) => {
  const response = await axios.get(`/drivers/${id}/assignments`, { params });
  return response.data;
};

export const updateDriverStatus = async (id, statusData) => {
  const response = await axios.put(`/drivers/${id}/status`, statusData);
  return response.data;
};

export const addVehicle = async (id, vehicleData) => {
  const response = await axios.post(`/drivers/${id}/vehicle`, vehicleData);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await axios.put(`/drivers/${id}/vehicle`, vehicleData);
  return response.data;
};

export const addDriverRating = async (id, ratingData) => {
  const response = await axios.post(`/drivers/${id}/ratings`, ratingData);
  return response.data;
};

export const getDriverHistory = async (id, params) => {
  const response = await axios.get(`/drivers/${id}/history`, { params });
  return response.data;
};

export const getDriverInvoice = async (id, params) => {
  const response = await axios.get(`/drivers/${id}/invoice`, {
    params: {
      startDate: params.startDate,
      endDate: params.endDate
    }
  });
  return response.data.data;
};

// Helper function to prepare form data for document upload
const prepareDocumentFormData = (documentData, file) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('documentData', JSON.stringify({
    number: documentData.number,
    issuedDate: documentData.issuedDate,
    expiryDate: documentData.expiryDate
  }));
  return formData;
};

export const updateDriverDocument = async (driverId, documentType, documentData) => {
  const formData = prepareDocumentFormData(documentData, documentData.document);
  const response = await axios.put(
    `/drivers/${driverId}/driver-documents/${documentType}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};

export const updateVehicleDocument = async (driverId, documentType, documentData) => {
  const formData = prepareDocumentFormData(documentData, documentData.document);
  const response = await axios.put(
    `/drivers/${driverId}/vehicle-documents/${documentType}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};

export const deleteDriverDocument = async (driverId, documentType) => {
  const response = await axios.delete(`/drivers/${driverId}/driver-documents/${documentType}`);
  return response.data;
};

export const deleteVehicleDocument = async (driverId, documentType) => {
  const response = await axios.delete(`/drivers/${driverId}/vehicle-documents/${documentType}`);
  return response.data;
};
