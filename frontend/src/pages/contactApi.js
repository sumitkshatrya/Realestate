import API from "./axiosInstance";

export const contactAPI = {
  contactAgent: (formData) => {
    return API.post("/contact/agent", formData);
  },
};

export default contactAPI;