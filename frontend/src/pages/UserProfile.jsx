import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { userAPI } from "../api/userApi";
import { motion as Motion } from "framer-motion";
import { FaUserEdit, FaLock } from "react-icons/fa";

const UserProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState({ username: false, password: false });
  const [error, setError] = useState({ username: "", password: "" });
  const [success, setSuccess] = useState({ username: "", password: "" });

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, username: true });
    setError({ ...error, username: "" });
    setSuccess({ ...success, username: "" });

    try {
      const response = await userAPI.updateUsername({ username });
      updateUser({ username }); // Update context state
      setSuccess({ ...success, username: response.message || "Username updated successfully!" });
    } catch (err) {
      setError({ ...error, username: err.message || "Failed to update username." });
    } finally {
      setLoading({ ...loading, username: false });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError({ ...error, password: "New passwords do not match." });
      return;
    }

    setLoading({ ...loading, password: true });
    setError({ ...error, password: "" });
    setSuccess({ ...success, password: "" });

    try {
      const response = await userAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess({ ...success, password: response.message || "Password changed successfully! Please log in again." });
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err) {
      setError({ ...error, password: err.message || "Failed to change password." });
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  return (
    <div className="section-shell py-12">
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-10">
        My Profile
      </h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Update Username Form */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"><FaUserEdit className="text-rose-500" /> Update Profile</h2>
          {error.username && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error.username}</p>}
          {success.username && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4">{success.username}</p>}
          
          <form onSubmit={handleUpdateUsername} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-600">Username</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="w-full px-4 py-3 rounded-md border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-600">Email (read-only)</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-md border-2 border-slate-300 bg-slate-100 cursor-not-allowed"
              />
            </div>
            <button type="submit" disabled={loading.username} className="btn btn-primary w-full">
              {loading.username ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </Motion.div>

        {/* Change Password Form */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"><FaLock className="text-rose-500" /> Change Password</h2>
          {error.password && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error.password}</p>}
          {success.password && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4">{success.password}</p>}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-600">Current Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 rounded-md border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-600">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 rounded-md border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-600">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 rounded-md border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            <button type="submit" disabled={loading.password} className="btn btn-primary w-full">
              {loading.password ? "Updating..." : "Update Password"}
            </button>
          </form>
        </Motion.div>
      </div>
    </div>
  );
};

export default UserProfile;