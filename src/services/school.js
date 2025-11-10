import axios from '@utils/api/axios';

export const getAllSchools = async (params) => {
  const response = await axios.get('/schools', { params });
  return response.data;
};

export const getSchool = async (id) => {
  const response = await axios.get(`/schools/${id}`);
  return response.data.data;
};

export const getSchoolStats = async (id) => {
  const response = await axios.get(`/schools/${id}/stats`);
  return response.data.data;
};

export const createSchool = async (schoolData) => {
  const response = await axios.post('/schools', schoolData);
  return response.data.data;
};

export const updateSchool = async ({ id, data }) => {
  const response = await axios.put(`/schools/${id}`, data);
  return response.data;
};

export const updateSchoolHolidays = async ({ id, holidays }) => {
  const response = await axios.put(`/schools/${id}/holidays`, { holidays });
  return response.data;
};

export const deleteSchoolById = async (id) => {
  const response = await axios.delete(`/schools/${id}`);
  return response.data;
};