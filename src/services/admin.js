import axios from "../utils/api/axios";

export const getAllAdmins = async (params = {}) => {
  const response = await axios.get("/admins", { params });
  return response.data;
};

export const getAdmin = async (id) => {
  const response = await axios.get(`/admins/${id}`);
  return response.data.data;
};

export const createAdmin = async (adminData) => {
  const response = await axios.post("/admins", adminData);
  return response.data.data;
};

export const updateAdmin = async (id, adminData) => {
  const response = await axios.put(`/admins/${id}`, adminData);
  return response.data.data;
};

export const deleteAdmin = async (id) => {
  const response = await axios.delete(`/admins/${id}`);
  return response.data;
};

export const restoreAdmin = async (id) => {
  const response = await axios.put(`/admins/${id}/restore`);
  return response.data.data;
};

export const updateAdminPassword = async (id, passwordData) => {
  const response = await axios.put(`/admins/${id}/password`, passwordData);
  return response.data;
};

export const getAdminHistory = async (id, params) => {
  const response = await axios.get(`/admins/${id}/history`, { params });
  return response.data;
};

export const updateAdminStatus = async (id, statusData) => {
  const response = await axios.put(`/admins/${id}/status`, statusData);
  return response.data;
};

export const getAdminStats = async () => {
  const response = await axios.get(`/admins/stats`);
  return response.data;
};