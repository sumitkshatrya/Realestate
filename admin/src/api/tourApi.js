import API from "./axiosInstance";

const normalizeToursList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const tourAPI = {
  getTours: async () => {
    const response = await API.get("/tours");
    return normalizeToursList(response.data);
  },

  updateTourStatus: async (id, status) => {
    const response = await API.put(`/tours/${id}/status`, { status });
    return response.data;
  },

  deleteTour: async (id) => {
    const response = await API.delete(`/tours/${id}`);
    return response.data;
  },
};

