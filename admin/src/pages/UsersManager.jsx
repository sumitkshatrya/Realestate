import React, { useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaTrash,
  FaUser,
  FaUserCheck,
  FaUserSlash,
  FaSearch,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { userAPI } from "../api/userApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";

const UsersManager = () => {
  const { data: users, loading, refetch } = useFetchData(userAPI.getUsers);
  const confirm = useConfirmationModal();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerified, setFilterVerified] = useState("all"); // "all" | "verified" | "unverified"

  const handleToggleStatus = async (id) => {
    setIsActionLoading(true);
    try {
      await userAPI.toggleUserStatus(id);
      await refetch();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete User Account?",
      message: "Are you sure you want to delete this user? This action cannot be undone and will permanently remove all account data.",
      onConfirm: async () => {
        setIsActionLoading(true);
        try {
          await userAPI.deleteUser(id);
          await refetch();
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const name = (u.username || u.fullName || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const phone = (u.phone || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || email.includes(query) || phone.includes(query);
      const matchesFilter =
        filterVerified === "all" ||
        (filterVerified === "verified" && u.accountVerified) ||
        (filterVerified === "unverified" && !u.accountVerified);

      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, filterVerified]);

  const verifiedCount = (users || []).filter((u) => u.accountVerified).length;
  const unverifiedCount = (users || []).length - verifiedCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <Motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Account Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">User Accounts & Roles</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage platform users, verify account credentials, and moderate access privileges.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Verified</span>
            <span className="text-lg font-extrabold text-emerald-400">{verifiedCount}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Pending</span>
            <span className="text-lg font-extrabold text-amber-400">{unverifiedCount}</span>
          </div>
        </div>
      </Motion.div>

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username, email, phone..."
            className="input-field pl-10"
          />
        </div>

        <select
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
          className="input-field w-full sm:w-auto text-xs py-2"
        >
          <option value="all">All Accounts ({users.length})</option>
          <option value="verified">Verified Only ({verifiedCount})</option>
          <option value="unverified">Pending Verification ({unverifiedCount})</option>
        </select>
      </div>

      {/* USER LISTING */}
      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
          Loading user database...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-16 text-center">
          <FaUser className="text-3xl text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white">No Accounts Found</p>
          <p className="text-xs text-slate-400 mt-1">No user account matches your current query or filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user, index) => (
            <Motion.article
              key={user._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl hover:border-white/20 transition space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                    user.accountVerified
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/15 text-amber-400"
                  }`}
                >
                  <FaUser className="text-base" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-base font-bold text-white">{user.username || "User"}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        user.accountVerified
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                      }`}
                    >
                      {user.accountVerified ? <FaCheckCircle className="text-[9px]" /> : <FaClock className="text-[9px]" />}
                      {user.accountVerified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1.5">
                    <FaEnvelope className="text-red-400 text-[10px] shrink-0" />
                    {user.email || "No email"}
                  </p>

                  {user.phone && (
                    <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                      <FaPhone className="text-slate-500 text-[10px] shrink-0" />
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Joined Date */}
              <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(user._id)}
                    disabled={isActionLoading}
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                      user.accountVerified
                        ? "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20"
                    }`}
                  >
                    {user.accountVerified ? <FaUserSlash /> : <FaUserCheck />}
                    {user.accountVerified ? "Unverify" : "Verify"}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={isActionLoading}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition disabled:opacity-50"
                    title="Delete User"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </Motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersManager;
