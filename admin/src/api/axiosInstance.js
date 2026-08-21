import axios from "axios";
import { toast } from "react-toastify";
import { clearFetchCache } from "./useFetchData";


// Create a global Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use the base URL from your .env file
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

// Add a response interceptor to handle global errors, like token expiration
API.interceptors.response.use(
  (response) => response, // Simply return the response for successful requests
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      // The token is invalid or expired.
      // 1. Remove the token from local storage.
      localStorage.removeItem("adminToken");

      // 2. Clear the in-memory data cache.
      clearFetchCache();

      // 2. Redirect the user to the login page.
      // We check to avoid an infinite loop if the login page itself causes a 401.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else {
      // For all other errors, display a toast notification.
      // Try to get a specific message from the server response, otherwise show a generic one.
      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(message);
    }
    
    // For all other errors, just reject the promise to let the calling code handle it.
    return Promise.reject(error);
  }
);

export default API;