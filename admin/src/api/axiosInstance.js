import axios from "axios";
import { toast } from "react-toastify";
import { clearFetchCache } from "./useFetchData";
import { getBackendBaseUrl } from "../utils/backendUrl";

const base = getBackendBaseUrl();
const baseURL = `${base}/api`;

// Create a global Axios instance
const API = axios.create({
  baseURL,
});

// Add a request interceptor to include the authorization token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthOrPasswordEndpoint =
      url.includes("/login") ||
      url.includes("/forgot-password") ||
      url.includes("/reset-password");

    if (error.response && error.response.status === 401 && !isAuthOrPasswordEndpoint) {
      localStorage.removeItem("adminToken");
      clearFetchCache();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred.";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;