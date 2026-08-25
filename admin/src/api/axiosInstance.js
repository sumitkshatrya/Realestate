import axios from "axios";
import { toast } from "react-toastify";
import { clearFetchCache } from "./useFetchData";


const rawBase = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const baseURL = rawBase.endsWith("/api") ? rawBase : `${rawBase.replace(/\/+$/, "")}/api`;

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
    
    if (error.response && error.response.status === 401) {
      
      localStorage.removeItem("adminToken");

      
      clearFetchCache();

      
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else {
     
      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(message);
    }
    
    
    return Promise.reject(error);
  }
);

export default API;