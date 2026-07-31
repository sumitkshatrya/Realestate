import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/testimonials",
});

// Public routes
export const submitTestimonial = (formData) =>
  API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchApprovedTestimonials = () => API.get("/approved");
export const fetchTestimonialById = (id) => API.get(`/${id}`);
