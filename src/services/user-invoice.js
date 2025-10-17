import axios from "../utils/api/axios";

const BASE_URL = "/user-invoice"; 

export const validateDriverNumber = async (driverNumber) => {
  const response = await axios.get(`${BASE_URL}/driver/${driverNumber}/validate`);
  return response.data;
};

export const validatePANumber = async (paNumber) => {
  const response = await axios.get(`${BASE_URL}/pa/${paNumber}/validate`);
  return response.data;
};

export const submitInvoice = async (invoiceData) => {
  const response = await axios.post(BASE_URL, invoiceData);
  return response.data;
};

export const submitDriverInvoice = async (invoiceData) => {
  const updatedData = { ...invoiceData, userType: 'DRIVER' };
  return submitInvoice(updatedData);
};

export const submitPAInvoice = async (invoiceData) => {
  const updatedData = { ...invoiceData, userType: 'PA' };
  return submitInvoice(updatedData);
};

export const getDriverInvoices = async (driverNumber, params = {}) => {
  const response = await axios.get(`${BASE_URL}/driver/${driverNumber}`, { params });
  return response.data;
};

export const getPAInvoices = async (paNumber, params = {}) => {
  const response = await axios.get(`${BASE_URL}/pa/${paNumber}`, { params });
  return response.data;
};

export const getInvoice = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data.data;
};

export const updateInvoiceStatus = async (id, statusData) => {
  const response = await axios.put(`${BASE_URL}/${id}/status`, statusData);
  return response.data;
};

export const updateInvoice = async (id, invoiceData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, invoiceData);
  return response.data;
};

export const markInvoiceAsRead = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}/read`);
  return response.data;
};