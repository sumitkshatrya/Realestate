import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const servicesAPI = {
  /**
   * Fetches all services from the API.
   */
  getServices: () => apiClient.get("/api/services"),

  /**
   * Fetches a single service by ID.
   * @param {string} id
   */
  getServiceById: (id) => apiClient.get(`/api/services/${id}`),
};