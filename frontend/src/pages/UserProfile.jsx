import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { userAPI } from "../api/userApi";
import { motion as Motion } from "framer-motion";
import { FaUserPen, FaLock, FaShieldHalved } from "react-icons/fa6";
import toast from "react-hot-toast";

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
    if (!username.trim()) {
      setError({ ...error, username: "Username cannot be empty." });
      return;
    }

    setLoading({ ...loading, username: true });
    setError({ ...error, username: "" });
    setSuccess({ ...success, username: "" });

    try {
      const response = await userAPI.updateUsername({ username });
      updateUser({ username });
      const msg = response.message || "Username updated successfully!";
      setSuccess({ ...success, username: msg });
      toast.success(msg);
    } catch (err) {
      const errMsg = err.message || "Failed to update username.";
      setError({ ...error, username: errMsg });
      toast.error(errMsg);
    } finally {
      setLoading({ ...loading, username: false });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError({ ...error, password: "New passwords do not match." });
      toast.error("New passwords do not match.");
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
      const msg = response.message || "Password changed! Logging out...";
      setSuccess({ ...success, password: msg });
      toast.success(msg);
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err) {
      const errMsg = err.message || "Failed to change password.";
      setError({ ...error, password: errMsg });
      toast.error(errMsg);
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Profile Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl mx-auto mb-4 border-4 border-white">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Account & Security Settings
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage your public username, view account details, and update security credentials.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Update Username Form */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-md border border-slate-200/80 space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                <FaUserPen />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Profile Info</h2>
                <p className="text-xs text-slate-500">Update your account display name</p>
              </div>
            </div>

            {error.username && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error.username}</p>}
            {success.username && <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">{success.username}</p>}

            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Display Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Registered Email (read-only)
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading.username}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition active:scale-98 cursor-pointer"
              >
                {loading.username ? "Saving Changes..." : "Update Profile"}
              </button>
            </form>
          </Motion.div>

          {/* Change Password Form */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-md border border-slate-200/80 space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
                <FaShieldHalved />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Security Credentials</h2>
                <p className="text-xs text-slate-500">Change your password for security</p>
              </div>
            </div>

            {error.password && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error.password}</p>}
            {success.password && <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">{success.password}</p>}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading.password}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition active:scale-98 cursor-pointer"
              >
                {loading.password ? "Updating Password..." : "Change Password"}
              </button>
            </form>
          </Motion.div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;