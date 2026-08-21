import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const contentAPI = {
  /**
   * Fetches the content for the About Us section.
   */
  getAboutContent: () => apiClient.get("/api/content/about"),
};