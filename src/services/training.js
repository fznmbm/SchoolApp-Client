import axios from '@utils/api/axios';

export const getAllTrainingsForMapping = async () => {
  const response = await axios.get('/training/mapping/all');
  return response.data.data;
};

export const getAllTrainings = async (params = {}) => {
  const response = await axios.get('/training', { 
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search,
      candidateType: params.candidateType,
      status: params.status
    }
  });
  return response.data.data;
};

export const getTraining = async (id) => {
  const response = await axios.get(`/training/${id}`);
  return response.data.data;
};

export const createTraining = async (trainingData) => {
  const response = await axios.post('/training', trainingData);
  return response.data.data;
};

export const updateTraining = async ({ id, data }) => {
  const response = await axios.put(`/training/${id}`, data);
  return response.data.data;
};

export const deleteTraining = async (id) => {
  const response = await axios.delete(`/training/${id}`);
  return response.data;
};