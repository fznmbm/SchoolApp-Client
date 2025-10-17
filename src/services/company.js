import axios from "../utils/api/axios";

export const getCompany = async () => {
  const response = await axios.get('/company');
  return response.data.data;
};


export const createCompany = async (companyData) => {
  const response = await axios.post('/company', companyData);
  return response.data.data;
};


export const updateCompany = async (companyData) => {
  const response = await axios.put('/company', companyData);
  return response.data.data;
};


export const deleteCompany = async () => {
  const response = await axios.delete('/company');
  return response.data;
};