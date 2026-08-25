import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const agentAPI = {
  getAgentProfile: (agentId) => apiClient.get(`/api/agents/${agentId}`),
  updateAgentProfile: (formData) =>
    apiClient.put("/api/agents/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAgentTestimonials: (agentId) => apiClient.get(`/api/agents/${agentId}/testimonials`),
  requestValuation: (valuationData) => apiClient.post("/api/agents/request-valuation", valuationData),
};

