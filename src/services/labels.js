import axios from "../utils/api/axios";

const BASE_URL = "/api/labels";

export const getLabels = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createLabel = async (labelData) => {
  const response = await axios.post(BASE_URL, labelData);
  return response.data;
};

export const updateLabel = async (id, labelData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, labelData);
  return response.data;
};

export const deleteLabel = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const addLabelsToInvoice = async (invoiceId, labelIds) => {
  const response = await axios.post(`/api/labels/invoice/${invoiceId}`, { labelIds });
  return response.data;
};

export const removeLabelsFromInvoice = async (invoiceId, labelIds) => {
  const response = await axios.delete(`/api/labels/invoice/${invoiceId}`, { data: { labelIds } });
  return response.data;
};
