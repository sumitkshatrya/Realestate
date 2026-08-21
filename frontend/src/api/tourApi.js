import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const tourAPI = {
  /**
   * Submits a request to schedule a tour for a property.
   * @param {object} tourData - The tour request details.
   */
  scheduleTour: (tourData) => apiClient.post("/api/tours/schedule", tourData),
};