import axios from "../utils/api/axios";

const BASE_URL = "/applications";

export const getApplications = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
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
