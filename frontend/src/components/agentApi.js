import API from "./axiosInstance";

export const agentAPI = {
  getAgentProfile: (agentId) => {
    return API.get(`/api/agents/${agentId}`);
  },
  updateAgentProfile: (formData) => {
    // The backend will identify the user via the JWT token
    return API.put('/api/agents/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAgentTestimonials: (agentId) => {
    return API.get(`/api/agents/${agentId}/testimonials`);
  },
  requestValuation: (valuationData) => {
    return API.post('/api/agents/request-valuation', valuationData);
  },
};