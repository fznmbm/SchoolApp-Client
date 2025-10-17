import axios from '@utils/api/axios';

export const getAllCorporateAccounts = async (params = {}) => {
  const response = await axios.get('/corporate-accounts', {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search
    }
  });
  return response.data;
};

export const getCorporateAccount = async (id) => {
  const response = await axios.get(`/corporate-accounts/${id}`);
  return response.data.data;
};

export const createCorporateAccount = async (data) => {
  const response = await axios.post('/corporate-accounts', data);
  return response.data.data;
};

export const updateCorporateAccount = async ({ id, data }) => {
  const response = await axios.put(`/corporate-accounts/${id}`, data);
  return response.data.data;
};

export const deleteCorporateAccount = async (id) => {
  const response = await axios.delete(`/corporate-accounts/${id}`);
  return response.data;
};


