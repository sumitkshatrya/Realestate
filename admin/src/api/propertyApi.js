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
    const isFormData = propertyData instanceof FormData;
    const response = await API.post("/properties", propertyData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const isFormData = propertyData instanceof FormData;
    const response = await API.put(`/properties/${id}`, propertyData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await API.delete(`/properties/${id}`);
    return response.data;
  },

  seedProperties: async () => {
    const response = await API.post("/properties/seed");
    return response.data;
  },
};

