import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/testimonials",
});

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  },
});

export const adminFetchAll = async () => {
  const response = await API.get("/all/list", authHeaders());
  return response.data;
};

export const updateTestimonialStatus = async (id, status) => {
  const response = await API.put(`/${id}/status`, { status }, authHeaders());
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await API.delete(`/${id}`, authHeaders());
  return response.data;
};
