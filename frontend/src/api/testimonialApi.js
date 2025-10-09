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

// Admin routes
export const adminFetchAll = (token) =>
  API.get("/all/list", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTestimonialStatus = (id, status, token) =>
  API.put(
    `/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deleteTestimonial = (id, token) =>
  API.delete(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
