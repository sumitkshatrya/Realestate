import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const submitTestimonial = (formData) => {
  // The ApiClient will handle FormData correctly now
  return apiClient.post("/api/testimonials/create", formData);
};


export const testimonialAPI = {
  /**
   * Fetches approved testimonials with pagination.
   * @param {number} page - The page number to fetch.
   * @param {number} limit - The number of items per page.
   */
  getApprovedTestimonials: (page = 1, limit = 3) =>
    apiClient.get(`/api/testimonials/approved?page=${page}&limit=${limit}`),

  getSummary: () => apiClient.get("/api/testimonials/summary"),

  /**
   * Submits a testimonial for a specific agent.
   * The backend should associate this with the logged-in user.
   */
  submitTestimonialForAgent: (testimonialData) =>
    apiClient.post("/api/testimonials/agent-review", testimonialData),
};