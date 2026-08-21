import API from "./axiosInstance"; // Import the global Axios instance

const normalizeServicesList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

export const servicesAPI = {
  getServices: async () => {
    const response = await API.get("/services", { params: { includeInactive: true } });
    return normalizeServicesList(response.data);
  },

  createService: async (serviceData) => {
    const response = await API.post("/services", serviceData);
    return response.data;
  },

  updateService: async (id, serviceData) => {
    const response = await API.put(`/services/${id}`, serviceData);
    return response.data;
  },

  deleteService: async (id) => {
    const response = await API.delete(`/services/${id}`);
    return response.data;
  },
};
