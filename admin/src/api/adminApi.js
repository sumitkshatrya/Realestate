import API from "./axiosInstance"; 

export const adminLogin = async (credentials) => {
  const response = await API.post("/admin/login", credentials);
  return response.data;
};

export const forgotPassword = async (credentials) => {
  const response = await API.post("/admin/forgot-password", credentials);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await API.post("/admin/reset-password", data);
  return response.data;
};
