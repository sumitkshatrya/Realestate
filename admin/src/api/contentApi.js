import API from "./axiosInstance";

export const contentAPI = {
  getAboutContent: async () => {
    const response = await API.get("/content/about");
    return response.data?.data || response.data || {};
  },

  updateAboutContent: async (contentData) => {
    const response = await API.put("/content/about", contentData);
    return response.data;
  },
};

