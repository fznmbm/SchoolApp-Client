import api from '@utils/api/axios';

export const getAllStudents = async (params = {}) => {
  const { page, limit, search, school, hasSpecialCareNeeds } = params;
  
  // Build query string with parameters
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (search) queryParams.append('search', search);
  if (school) queryParams.append('school', school);
  if (hasSpecialCareNeeds) queryParams.append('hasSpecialCareNeeds', hasSpecialCareNeeds);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/students?${queryString}` : '/students';
  
  const response = await api.get(url);
  return response.data;
};

export const getStudentsByRoute = async (id) => {
  const response = await api.get(`/students/by-route/${id}`);
  return response.data.data;
};

export const getStudent = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data.data;
};

export const createStudent = async (data) => {
  try {
    // If data is FormData (contains files), use multipart/form-data
    if (data instanceof FormData) {
      
      const response = await api.post('/students', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } 
    
    // Regular JSON request (no files)
    else {
      const response = await api.post('/students', data);
      return response.data;
    }
  } catch (error) {
    console.error("Error in createStudent service:", error);
    
    // Enhanced error handling
    if (error.response?.status === 413) {
      throw new Error("File is too large. Please upload a smaller document.");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const updateStudent = async ({ id, ...data }) => {
  // Handle document upload
  if (data.document instanceof File) {
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Extract document and other data
    const { document, ...studentData } = data;
    
    // Add student data as JSON string
    formData.append('data', JSON.stringify(studentData));
    
    // Add document metadata if any
    if (data.documentMetadata) {
      formData.append('documentMetadata', JSON.stringify(data.documentMetadata));
    }
    
    // Add document file
    formData.append('documents', document);
    
    const response = await api.put(`/students/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } 
  // Handle document removal
  else if (data.document === null || data.document === "") {
    // Create a modified data object with removal flag
    const updatedData = {
      ...data,
      removeDocument: true // Add explicit flag to remove document
    };
    
    const response = await api.put(`/students/${id}`, updatedData);
    return response.data;
  } 
  // No document changes
  else {
    // No document to upload, proceed with normal JSON request
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  }
};
export const deleteStudentById = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};

export const addSpecialCareNeed = async (studentId, specialCareNeedData) => {
  const response = await api.post(`/students/${studentId}/special-care-needs`, specialCareNeedData);
  return response.data;
};

export const removeSpecialCareNeed = async (studentId, specialCareNeedId) => {
  const response = await api.delete(`/students/${studentId}/special-care-needs/${specialCareNeedId}`);
  return response.data;
};

// Label management functions
export const addLabelsToStudent = async (studentId, labelIds, assignedRoute = null) => {
  const response = await api.post(`/students/${studentId}/labels`, {
    labelIds,
    assignedRoute
  });
  return response.data;
};

export const removeLabelsFromStudent = async (studentId, labelIds) => {
  const response = await api.delete(`/students/${studentId}/labels`, {
    data: { labelIds }
  });
  return response.data;
};

export const createRouteLabel = async (routeId) => {
  const response = await api.post(`/students/route-labels/${routeId}`);
  return response.data;
};

export const autoAssignRouteLabels = async (studentIds, routeId) => {
  const response = await api.post('/students/auto-assign-route-labels', {
    studentIds,
    routeId
  });
  return response.data;
};

export const getStudentsWithLabels = async (params = {}) => {
  const { page, limit, search, school, hasSpecialCareNeeds, labelIds, assignedRoute } = params;
  
  // Build query string with parameters
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (search) queryParams.append('search', search);
  if (school) queryParams.append('school', school);
  if (hasSpecialCareNeeds) queryParams.append('hasSpecialCareNeeds', hasSpecialCareNeeds);
  if (assignedRoute) queryParams.append('assignedRoute', assignedRoute);
  if (labelIds) {
    if (Array.isArray(labelIds)) {
      labelIds.forEach(id => queryParams.append('labelIds', id));
    } else {
      queryParams.append('labelIds', labelIds);
    }
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/students/with-labels?${queryString}` : '/students/with-labels';
  
  const response = await api.get(url);
  return response.data;
};

export const getStudentLabels = async () => {
  const response = await api.get('/students/labels');
  return response.data;
};