import axios from '@utils/api/axios';

export const getAllLicensingAuthorities = async (params = {}) => {
  const response = await axios.get('/licensing-authority', { 
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search
    }
  });
  return response.data;
};

export const getLicensingAuthority = async (id) => {
  const response = await axios.get(`/licensing-authority/${id}`);
  return response.data.data;
};

export const createLicensingAuthority = async (data) => {
  const response = await axios.post('/licensing-authority', data);
  return response.data.data;
};

export const updateLicensingAuthority = async ({ id, data }) => {
  const response = await axios.put(`/licensing-authority/${id}`, data);
  return response.data.data;
};

export const deleteLicensingAuthority = async (id) => {
  const response = await axios.delete(`/licensing-authority/${id}`);
  return response.data;
};