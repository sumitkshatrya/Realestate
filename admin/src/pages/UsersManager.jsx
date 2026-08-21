import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaTrash,
  FaUser,
  FaUserCheck,
  FaUserSlash,
} from "react-icons/fa";
import { userAPI } from "../api/userApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";

const UsersManager = () => {
  const { data: users, loading, refetch } = useFetchData(userAPI.getUsers);
  const confirm = useConfirmationModal();
  const [isActionLoading, setIsActionLoading] = useState(false);

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
      title: "Delete User?",
      message: "Are you sure you want to delete this user? This action cannot be undone and will remove all their account data.",
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

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Users</h2>
        <p className="mt-2 text-sm text-slate-300">
          Manage registered user accounts. Verify, unverify, or remove accounts
          as needed.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center">
          <p className="font-semibold text-white">No Users Found</p>
          <p className="mt-1 text-sm text-slate-400">
            Registered user accounts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user, index) => (
            <Motion.article
              key={user._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.24 }}
              className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl p-4 ${user.accountVerified ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700/40 text-slate-400"}`}>
                  <FaUser className="text-lg" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        user.accountVerified
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {user.accountVerified ? <FaShieldAlt /> : <FaUserSlash />}
                      {user.accountVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <FaEnvelope className="text-red-300" />
                      {user.email}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FaPhone className="text-red-300" />
                      {user.phone}
                    </span>
                    <span className="text-slate-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleToggleStatus(user._id)}
                  disabled={isActionLoading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {user.accountVerified ? <FaUserSlash /> : <FaUserCheck />}
                  {user.accountVerified ? "Unverify" : "Verify"}
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  disabled={isActionLoading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </Motion.article>
          ))}
        </div>
      )}
    </Motion.section>
  );
};

export default UsersManager;
