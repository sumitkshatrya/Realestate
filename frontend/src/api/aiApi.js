import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const aiAPI = {
  /**
   * Parse natural language query into structured property search filter parameters
   */
  parseQuery: (query) => apiClient.post("/api/ai/parse-query", { query }),

  /**
   * Calculate property match score and positive match reasons / considerations
   */
  calculateMatchScore: (property, preferences = {}) =>
    apiClient.post("/api/ai/match-score", { property, preferences }),

  /**
   * Compare 2 to 4 properties side-by-side
   */
  compareProperties: (properties = []) =>
    apiClient.post("/api/ai/compare", { properties }),

  /**
   * Get property fit insights, pros, considerations, and location intelligence
   */
  getPropertyInsights: (property) =>
    apiClient.post("/api/ai/insights", { property }),

  /**
   * Generate property descriptions for sellers/agents
   */
  generateDescription: (propertyData) =>
    apiClient.post("/api/ai/generate-description", propertyData),

  /**
   * Calculate listing quality score & checklist for sellers
   */
  calculateListingScore: (propertyData) =>
    apiClient.post("/api/ai/listing-score", propertyData),
};

export default aiAPI;

