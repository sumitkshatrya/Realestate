import React, { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./authContextValue";
import { authAPI } from "../api/authApi";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleStoredUser = useCallback(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      setUser(null);
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, []);

  const saveSession = useCallback((userData, responseData) => {
    if (!userData) return;
    const token =
      responseData?.token ||
      responseData?.accessToken ||
      userData?.token ||
      userData?.accessToken;
    if (token) {
      localStorage.setItem("userToken", token);
    }
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Failed to save user in localStorage:", err);
    }
    setUser(userData);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    const verifyUser = async () => {
      try {
        const response = await authAPI.verify();
        const userData = response?.data || response?.user || null;
        if (userData) {
          saveSession(userData, response);
          return;
        }
      } catch {
        console.log("No active session or token is invalid.");
      }
      handleStoredUser();
    };
    verifyUser();

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [handleStoredUser, saveSession]);

  const login = useCallback(
    async (credentials) => {
      const response = await authAPI.login(credentials);
      const userData = response?.data || response?.user || null;
      if (userData) {
        saveSession(userData, response);
      }
      return response;
    },
    [saveSession]
  );

  const signup = useCallback(
    (userData, responseData) => {
      if (!userData) return;
      saveSession(userData, responseData);
    },
    [saveSession]
  );

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
    }
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prevUser) => {
      if (!prevUser) return updatedFields || null;
      const newUser = { ...prevUser, ...updatedFields };
      try {
        localStorage.setItem("user", JSON.stringify(newUser));
      } catch (err) {
        console.error("Failed to update user in localStorage:", err);
      }
      return newUser;
    });
  }, []);

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

