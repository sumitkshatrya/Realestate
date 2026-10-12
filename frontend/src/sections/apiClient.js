import axios from "axios";
import { getBackendBaseUrl } from "../utils/backendUrl";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${getBackendBaseUrl()}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;