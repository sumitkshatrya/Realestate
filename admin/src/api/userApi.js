import API from "./axiosInstance";

const normalizeUsersList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const userAPI = {
  getUsers: async (params = {}) => {
    const response = await API.get("/admin/users", { params });
    return normalizeUsersList(response.data);
  },

  updateUser: async (id, userData) => {
    const response = await API.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await API.put(`/admin/users/${id}/status`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  },
};

