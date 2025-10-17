import api from '@utils/api/axios';

export const getRoutes = async (params) => {
  const response = await api.get('/routes', { params });
  return response.data.data;
};

export const getRoute = async (id) => {
  const response = await api.get(`/routes/${id}`);
  return response.data.data;
};

export const createRoute = async (data) => {
  // Check if we have files to upload
  if (data.documents) {
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Extract document and other data
    const { documents, ...routeData } = data;
    
    // Add route data as JSON string
    formData.append('data', JSON.stringify(routeData));
    
    // Add document metadata if any
    if (data.documentMetadata) {
      formData.append('documentMetadata', JSON.stringify(data.documentMetadata));
    }
    
    // Add document file
    formData.append('documents', documents);
    
    const response = await api.post('/routes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } else {
    // No files to upload, proceed with normal JSON request
    const response = await api.post('/routes', data);
    return response.data;
  }
};

export const updateRoute = async ({ id, ...data }) => {
  // Improved document check - handle both File objects and document data structures
  const hasDocumentsToUpload = data.documents && (
    (data.documents instanceof File) || // Single file
    (typeof data.documents === 'object' && data.documents.size > 0) || // Single file-like object
    (Array.isArray(data.documents) && data.documents.some(doc => 
      doc instanceof File || (doc && typeof doc === 'object' && doc.size > 0)
    ))
  );
  
  // Check if there are documents to remove
  const hasDocumentsToRemove = data.documentsToRemove && 
    Array.isArray(data.documentsToRemove) && 
    data.documentsToRemove.length > 0;

  // If we have document changes, use FormData
  if (hasDocumentsToUpload || hasDocumentsToRemove) {
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Extract documents from data and create a clean routeData object
    const { documents, ...routeData } = data;
    
    // Add route data as JSON string
    formData.append('data', JSON.stringify(routeData));
    
    // Add document metadata if any
    if (data.documentMetadata) {
      formData.append('documentsMetadata', JSON.stringify(data.documentMetadata));
    }
    
    // Add document files if any
    if (hasDocumentsToUpload) {
      if (Array.isArray(documents)) {
        // Multiple documents
        documents.forEach(doc => {
          if (doc instanceof File || (doc && typeof doc === 'object' && doc.size > 0)) {
            formData.append('documents', doc);
          }
        });
      } else if (documents instanceof File || (documents && typeof documents === 'object' && documents.size > 0)) {
        // Single document
        formData.append('documents', documents);
      }
    }
    
    const response = await api.put(`/routes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } 
  // Handle explicit document removal (when documents is set to null/empty)
  else if (data.documents === null || data.documents === "") {
    const response = await api.put(`/routes/${id}`, data);
    return response.data;
  }
  // No document changes, proceed with normal JSON request
  else {
    const response = await api.put(`/routes/${id}`, data);
    return response.data;
  }
};

export const deleteRouteById = async (id) => {
  const response = await api.delete(`/routes/${id}`);
  return response.data;
};

export const assignDriverToRoute = async (id, { driverId, driverPrice, reason }) => {
  const response = await api.put(`/routes/${id}/driver`, {
    driverId,
    driverPrice,
    reason
  });
  return response.data;
};

export const assignPAToRoute = async (id, { isPANeeded, paId, paPrice, reason }) => {
  const response = await api.put(`/routes/${id}/pa`, {
    isPANeeded,
    paId,
    paPrice,
    reason
  });
  return response.data;
};

export const assignTemporaryDriver = async (routeId, driverData) => {
  const response = await api.post(`/routes/${routeId}/temporary-driver`, driverData);
  return response.data;
};

export const removeTemporaryDriver = async (routeId, payload) =>
  api.delete(`/routes/${routeId}/temporary-driver`, { data: payload }).then(res => res.data);


export const getTemporaryDriverHistory = async (routeId) => {
  const response = await api.get(`/routes/${routeId}/temporary-driver/history`);
  return response.data.data;
};

export const checkDriverAvailability = async (driverId, startDate, endDate) => {
  const response = await api.get(`/drivers/${driverId}/availability`, {
    params: { startDate, endDate }
  });
  return response.data;
};