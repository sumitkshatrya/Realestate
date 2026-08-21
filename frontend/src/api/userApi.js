import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const userAPI = {
  /**
   * Toggles a property in the user's favorites.
   * @param {string} propertyId - The ID of the property to toggle.
   */
  toggleFavorite: (propertyId) => apiClient.post(`/api/favorites/${propertyId}`),

  /**
   * Fetches the user's favorite properties.
   */
  getFavorites: () => apiClient.get("/api/favorites"),

  /**
   * Updates the user's username.
   * @param {{ username: string }} usernameData - The new username.
   */
  updateUsername: (usernameData) => apiClient.put("/api/update-username", usernameData),

  /**
   * Changes the user's password.
   * @param {{ oldPassword, newPassword }} passwordData - The old and new password.
   */
  changePassword: (passwordData) => apiClient.put("/api/change-password", passwordData),
};