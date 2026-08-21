import API from "./axiosInstance";

const normalizeContactsList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const contactAPI = {
  getContacts: async () => {
    const response = await API.get("/admin/contacts");
    return normalizeContactsList(response.data);
  },

  deleteContact: async (id) => {
    const response = await API.delete(`/admin/contacts/${id}`);
    return response.data;
  },
};

