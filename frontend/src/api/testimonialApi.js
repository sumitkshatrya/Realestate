import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const submitTestimonial = (formData) => {
  return apiClient.post("/api/testimonials/create", formData);
};

export const fetchTestimonialById = (id) => {
  return apiClient.get(`/api/testimonials/${id}`);
};

export const testimonialAPI = {
  getApprovedTestimonials: (page = 1, limit = 3) =>
    apiClient.get(`/api/testimonials/approved?page=${page}&limit=${limit}`),

  getSummary: () => apiClient.get("/api/testimonials/summary"),

  getTestimonialById: fetchTestimonialById,

  submitTestimonial: submitTestimonial,

  submitTestimonialForAgent: (testimonialData) =>
    apiClient.post("/api/testimonials/create", testimonialData),
};

export default testimonialAPI;