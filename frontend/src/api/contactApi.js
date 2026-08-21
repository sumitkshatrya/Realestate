import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const contactAPI = {
  /**
   * Submits a contact form message.
   * @param {object} contactData - The contact form data.
   */
  sendMessage: (contactData) => apiClient.post("/api/contact", contactData),
};