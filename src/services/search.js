import axios from "../utils/api/axios";


export const globalSearch = async (query, limit = 15) => {
  try {
    const response = await axios.get('/search', {
      params: { query, limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error performing global search:', error);
    throw error;
  }
};


export const groupSearchResultsByType = (results) => {
  return results.reduce((grouped, item) => {
    if (!grouped[item.type]) {
      grouped[item.type] = [];
    }
    grouped[item.type].push(item);
    return grouped;
  }, {});
};