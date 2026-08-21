import axios from "axios";

// Use the VITE_API_BASE_URL from your .env file, with a fallback for local development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;