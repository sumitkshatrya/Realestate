import API from "./axiosInstance"; // Import the global Axios instance

export const adminFetchAll = async (params = {}) => {
  // The base URL is now handled by the global instance, just append the specific path
  const response = await API.get("/testimonials/all/list", { params });
  return response.data;
};

export const updateTestimonialStatus = async (id, status) => {
  const response = await API.put(`/testimonials/${id}/status`, { status });
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await API.delete(`/testimonials/${id}`);
  return response.data;
};

export const bulkUpdateStatus = async (payload) => {
  const response = await API.post("/testimonials/bulk-status", payload);
  return response.data;
};

export const bulkDelete = async (payload) => {
  const response = await API.post("/testimonials/bulk-delete", payload);
  return response.data;
};
