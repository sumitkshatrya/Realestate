import API from "./axiosInstance";

const normalizeAreasList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const popularAreaAPI = {
  getAreas: async () => {
    const response = await API.get("/popular-areas");
    return normalizeAreasList(response.data);
  },

  createArea: async (areaData) => {
    const response = await API.post("/popular-areas", areaData);
    return response.data;
  },

  updateArea: async (id, areaData) => {
    const response = await API.put(`/popular-areas/${id}`, areaData);
    return response.data;
  },

  deleteArea: async (id) => {
    const response = await API.delete(`/popular-areas/${id}`);
    return response.data;
  },
};

