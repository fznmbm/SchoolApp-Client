import axios from "../utils/api/axios";

const BASE_URL = "/applications";

export const getApplications = async (params = {}) => {
  const response = await axios.get(BASE_URL, { 
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search,
      status: params.status
    }
  });
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const submitApplication = async (formData) => {
  const response = await axios.post(`${BASE_URL}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await axios.patch(`${BASE_URL}/${id}/status`, { status });
  return response.data;
};

export const markApplicationAsRead = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}/read`);
  return response.data;
};
