import axios from "../utils/api/axios";

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats and alerts
 */
export const getDashboardStats = async () => {
  try {
    const response = await axios.get('/dashboard/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

