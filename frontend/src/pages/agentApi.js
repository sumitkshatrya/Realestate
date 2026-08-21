import API from "./axiosInstance";

export const agentAPI = {
  contactAgent: (contactData) => {
    // This endpoint will receive the agent contact form data on the backend.
    return API.post("/agent/contact", contactData);
  },
};