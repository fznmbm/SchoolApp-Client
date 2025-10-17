import axios from "../utils/api/axios";

export const getInvoiceDetails = async (routeId) => {
  const url = routeId 
    ? `/invoice/details/${routeId}`
    : '/invoice/details';
    
  const response = await axios.get(url);
  return response.data.data;
};

export default {
  getInvoiceDetails
};