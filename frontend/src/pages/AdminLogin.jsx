import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/adminApi";
import React from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await adminLogin({ email, password });
      localStorage.setItem("adminToken", token);
      navigate("/admindashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 w-full rounded hover:bg-red-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
