import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const propertyAPI = {
  /**
   * Fetches all properties from the API.
   */
  getProperties: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.purpose) params.append("purpose", filters.purpose);
    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get(`/api/properties${queryString}`);
  },

  /**
   * Searches properties using the provided query object (q, purpose, category, status, type).
   */
  searchProperties: (query = {}) => {
    const params = new URLSearchParams();
    if (query.q) params.append("q", query.q);
    if (query.purpose) params.append("purpose", query.purpose);
    if (query.category) params.append("category", query.category);
    if (query.status) params.append("status", query.status);
    if (query.type) params.append("type", query.type);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get(`/api/properties/search${queryString}`);
  },

  /**
   * Fetches a single property by its ID.
   */
  getPropertyById: (id) => apiClient.get(`/api/properties/${id}`),
};

export default propertyAPI;