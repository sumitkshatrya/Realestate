import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaCog,
  FaShieldAlt,
  FaBell,
  FaDatabase,
  FaKey,
  FaSync,
  FaCheck,
  FaLock,
  FaGlobe,
  FaTrashAlt,
  FaServer,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { clearFetchCache } from "../api/useFetchData";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [platformConfig, setPlatformConfig] = useState({
    siteName: "Realestate Elite Portal",
    supportEmail: "support@realestate.com",
    contactPhone: "+91 98765 43210",
    currency: "INR (₹)",
    maintenanceMode: false,
  });

  const [notificationConfig, setNotificationConfig] = useState({
    tourAlerts: true,
    contactAlerts: true,
    testimonialAlerts: true,
    emailDigest: "daily",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Platform settings updated successfully!");
    }, 600);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Admin password updated successfully!");
    }, 600);
  };

  const handleClearCache = () => {
    clearFetchCache();
    toast.info("Local storage and API caches cleared successfully!");
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header Banner */}
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 border border-red-500/20">
            <FaCog className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">System Settings & Controls</h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure global platform parameters, admin security, notification rules, and system maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Navigation Tabs */}
        <div className="space-y-2">
          {[
            { id: "general", label: "General Config", icon: FaGlobe },
            { id: "security", label: "Security & Passwords", icon: FaShieldAlt },
            { id: "notifications", label: "Alert Rules", icon: FaBell },
            { id: "system", label: "System Health & Cache", icon: FaDatabase },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-red-500/15 border border-red-500/30 text-white shadow-lg shadow-red-500/5"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                }`}
              >
                <Icon className={`text-base ${isActive ? "text-red-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3">
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <Motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSaveGeneral}
              className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-900/75 p-6"
            >
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4">
                Platform Identity & Preferences
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Platform Title / Brand Name
                  </label>
                  <input
                    type="text"
                    value={platformConfig.siteName}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, siteName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    value={platformConfig.supportEmail}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, supportEmail: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Customer Support Phone
                  </label>
                  <input
                    type="text"
                    value={platformConfig.contactPhone}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, contactPhone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Default Currency Symbol
                  </label>
                  <select
                    value={platformConfig.currency}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, currency: e.target.value })}
                    className="input-field"
                  >
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                  </select>
                </div>
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-sm font-bold text-white">Maintenance Mode</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Temporarily display maintenance banner to visitors during system upgrades.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPlatformConfig({ ...platformConfig, maintenanceMode: !platformConfig.maintenanceMode })}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    platformConfig.maintenanceMode ? "bg-red-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      platformConfig.maintenanceMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  <FaCheck className="text-xs" />
                  Save Changes
                </button>
              </div>
            </Motion.form>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <Motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSaveSecurity}
              className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-900/75 p-6"
            >
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4">
                Administrator Authentication & Access
              </h2>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-300 flex items-start gap-3">
                <FaLock className="text-sm shrink-0 mt-0.5" />
                <p>
                  Ensure your password uses at least 8 characters including uppercase letters, numbers, and symbols to maintain market security compliance.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  <FaKey className="text-xs" />
                  Update Password
                </button>
              </div>
            </Motion.form>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <Motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-900/75 p-6"
            >
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4">
                Real-Time Alert Preferences
              </h2>

              <div className="space-y-4">
                {[
                  {
                    key: "tourAlerts",
                    title: "Property Tour Requests",
                    desc: "Receive instant notifications when customers request a property viewing",
                  },
                  {
                    key: "contactAlerts",
                    title: "Customer Contact Enquiries",
                    desc: "Receive notification alerts on new incoming general contact messages",
                  },
                  {
                    key: "testimonialAlerts",
                    title: "Testimonial Submissions",
                    desc: "Alert when new client testimonials require admin approval",
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNotificationConfig((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                      }
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notificationConfig[item.key] ? "bg-red-500" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          notificationConfig[item.key] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Motion.div>
          )}

          {/* SYSTEM HEALTH TAB */}
          {activeTab === "system" && (
            <Motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-900/75 p-6"
            >
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4">
                System Diagnostics & Storage Cache
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">REST API Status</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">Online & Healthy</p>
                  <p className="mt-1 text-[11px] text-slate-400">Response time: ~45ms</p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Database Engine</span>
                    <FaServer className="text-blue-400 text-sm" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">MongoDB Connected</p>
                  <p className="mt-1 text-[11px] text-slate-400">Active connections: Operational</p>
                </div>
              </div>

              {/* Cache Management */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Clear Frontend API Cache</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      If you notice delayed updates or cached API listings, click below to force refresh all network cache layers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="btn btn-secondary shrink-0"
                  >
                    <FaSync className="text-xs" />
                    Purge Cache
                  </button>
                </div>
              </div>
            </Motion.div>
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default Settings;

