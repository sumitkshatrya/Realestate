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

  /**
   * Fetches properties similar to a target property ID.
   */
  getSimilarProperties: async (id) => {
    const response = await apiClient.get("/api/properties");
    const all = response?.data || response || [];
    const filtered = Array.isArray(all) ? all.filter((p) => String(p._id) !== String(id)) : [];
    return { data: filtered.slice(0, 3) };
  },

  /**
   * Fetches multiple properties matching an array of IDs.
   */
  getPropertiesByIds: async (ids = []) => {
    const response = await apiClient.get("/api/properties");
    const all = response?.data || response || [];
    const idSet = new Set((ids || []).map(String));
    const filtered = Array.isArray(all) ? all.filter((p) => idSet.has(String(p._id))) : [];
    return { data: filtered };
  },
};

export default propertyAPI;