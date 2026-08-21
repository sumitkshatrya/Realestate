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

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await authAPI.verify();
        const userData = response?.data || response?.user || null;
        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          return;
        }
      } catch {
        console.log("No active session or token is invalid.");
      }
      handleStoredUser();
    };
    verifyUser();
  }, [handleStoredUser]);

  const login = useCallback(async (credentials) => {
    const response = await authAPI.login(credentials);
    const userData = response?.data || response?.user || null;
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response;
  }, []);

  const signup = useCallback((userData) => {
    if (!userData) return;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

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

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

