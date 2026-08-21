import API from "./axiosInstance";

const normalizePropertiesList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const propertyAPI = {
  getProperties: async () => {
    const response = await API.get("/properties/admin/all");
    return normalizePropertiesList(response.data);
  },

  createProperty: async (propertyData) => {
    const response = await API.post("/properties", propertyData);
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const response = await API.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await API.delete(`/properties/${id}`);
    return response.data;
  },
};

