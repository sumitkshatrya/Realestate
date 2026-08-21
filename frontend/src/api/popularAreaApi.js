import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const popularAreaAPI = {
  /**
   * Fetches all active popular areas.
   */
  getPopularAreas: () => apiClient.get("/api/popular-areas"),
};