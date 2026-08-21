import ApiClient from "./ApiClient";

const apiClient = new ApiClient(import.meta.env.VITE_BACKEND_URL);

export const authAPI = {
  /**
   * Logs in a user.
   * @param {object} credentials - The user's login credentials.
   */
  login: (credentials) => apiClient.post("/api/login", credentials),
  /**
   * Registers a new user.
   * @param {object} userData - The user's registration data.
   */
  register: (userData) => apiClient.post("/api/create", userData),

  /**
   * Verifies a user's OTP.
   * @param {object} verificationData - The OTP verification data.
   */
  verifyOtp: (verificationData) => apiClient.post("/api/verify-otp", verificationData),

  /**
   * Requests a password reset code.
   * @param {object} emailData - The user's email.
   */
  requestPasswordReset: (emailData) => apiClient.post("/api/request-password-reset", emailData),

  /**
   * Resets the password using a code.
   * @param {object} resetData - The password reset data.
   */
  resetPassword: (resetData) => apiClient.post("/api/reset-password", resetData),

  /**
   * Logs out the current user.
   */
  logout: () => apiClient.post("/api/logout"),

  /**
   * Verifies the current user's token and returns user data.
   */
  verify: () => apiClient.get("/api/verify-user"),
};