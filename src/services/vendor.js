import axios from '@utils/api/axios';

export const getAllVendors = async (params) => {
  const response = await axios.get('/vendors', { params });
  return response.data.data;
};

export const getVendor = async (id) => {
  const response = await axios.get(`/vendors/${id}`);
  return response.data.data;
};

export const createVendor = async (vendorData) => {
  const response = await axios.post('/vendors', vendorData);
  return response.data.data;
};

export const updateVendor = async ({ id, data }) => {
  const response = await axios.put(`/vendors/${id}`, data);
  return response.data;
};

export const deleteVendor = async (id) => {
  const response = await axios.delete(`/vendors/${id}`);
  return response.data;
};