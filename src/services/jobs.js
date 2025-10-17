import axios from '@utils/api/axios';

export const getJobs = async (params) => {
  const response = await axios.get('/jobs', { params });
  // Return the data directly to match the structure expected by the component
  return response.data;
};

export const getJob = async (id) => {
  const response = await axios.get(`/jobs/${id}`);
  return response.data.data;
};

export const createJob = async (jobData) => {
  const response = await axios.post('/jobs', jobData);
  return response.data.data;
};

export const updateJob = async ({ id, data }) => {
  const response = await axios.put(`/jobs/${id}`, data);
  return response.data.data;
};

export const deleteJob = async (id) => {
  const response = await axios.delete(`/jobs/${id}`);
  return response.data;
};

export const getJobsByDate = async (date, additionalParams = {}) => {
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;
  
  const params = {
    startDateFrom: startOfDay,
    startDateTo: endOfDay,
    ...additionalParams
  };
  
  const response = await axios.get('/jobs', { params });
  return response.data;
};

export const updateJobStatus = async ({ id, status }) => {
  const response = await axios.patch(`/jobs/${id}/status`, { status });
  return response.data.data;
};

export const updateAttendance = async ({ jobId, studentId, date, type, value }) => {
  const response = await axios.patch(`/jobs/${jobId}/attendance`, {
    studentId,
    date,
    type,
    value
  });
  return response.data.data;
};

export const updateJobDocuments = async ({ id, documentType, documentData }) => {
  const response = await axios.put(`/jobs/${id}/documents`, {
    documentType,
    documentData
  });
  return response.data.data;
};

export const assignDriver = async ({ id, driverId }) => {
  const response = await axios.put(`/jobs/${id}/assign-driver`, { driverId });
  return response.data.data;
};