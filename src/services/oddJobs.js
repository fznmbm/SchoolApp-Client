import axios from '@utils/api/axios';

export const listOddJobs = async (params) => {
  const res = await axios.get('/odd-jobs', { params });
  return res.data;
};

export const getOddJob = async (id) => {
  const res = await axios.get(`/odd-jobs/${id}`);
  return res.data.data;
};

export const createOddJob = async (data) => {
  const res = await axios.post('/odd-jobs', data);
  return res.data.data;
};

export const updateOddJob = async ({ id, data }) => {
  const res = await axios.put(`/odd-jobs/${id}`, data);
  return res.data.data;
};

export const deleteOddJob = async (id) => {
  const res = await axios.delete(`/odd-jobs/${id}`);
  return res.data;
};

export const updateOddJobStatus = async ({ id, status }) => {
  const res = await axios.patch(`/odd-jobs/${id}/status`, { status });
  return res.data.data;
};



