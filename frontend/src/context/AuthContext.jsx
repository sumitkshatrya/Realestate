import React, { useEffect, useState } from "react";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const login = (userData) => {
    if (!userData) return;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signup = (userData) => {
    if (!userData) return;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
