import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const propertyAPI = {
  /**
   * Fetches all properties from the API.
   */
  getProperties: () => apiClient.get("/api/properties"),

  /**
   * Searches properties using the provided query.
   */
  searchProperties: (query = {}) => {
    const queryString = query.q ? `?q=${encodeURIComponent(query.q)}` : "";
    return apiClient.get(`/api/properties/search${queryString}`);
  },

  /**
   * Fetches a single property by its ID.
   */
  getPropertyById: (id) => apiClient.get(`/api/properties/${id}`),
};