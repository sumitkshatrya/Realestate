import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const contactAPI = {
  /**
   * Submits a contact form message.
   * @param {object} contactData - The contact form data.
   */
  sendMessage: (contactData) => apiClient.post("/api/contact", contactData),
  contactAgent: (contactData) =>
    apiClient.post("/api/contact", {
      ...contactData,
      fullname: contactData.fullname || contactData.name,
      subject:
        contactData.subject ||
        (contactData.propertyName
          ? `Inquiry for ${contactData.propertyName}`
          : "Agent Inquiry"),
    }),
};