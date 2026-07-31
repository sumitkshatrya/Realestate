import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const adminLogin = async (credentials) => {
  const response = await API.post("/admin/login", credentials);
  return response.data;
};
