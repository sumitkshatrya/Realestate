import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaTrash, FaUser } from "react-icons/fa";
import { contactAPI } from "../api/contactApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";

const ContactsManager = () => {
  const { data: contacts, loading, refetch } = useFetchData(contactAPI.getContacts);
  const confirm = useConfirmationModal();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Contact Message?",
      message: "Are you sure you want to delete this contact message? This action cannot be undone.",
      onConfirm: async () => {
        setIsActionLoading(true);
        try {
          await contactAPI.deleteContact(id);
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
        <h2 className="text-2xl font-semibold text-white">Contact Messages</h2>
        <p className="mt-2 text-sm text-slate-300">
          View inquiries submitted through the public contact form and remove
          messages that no longer need attention.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
          Loading contact messages...
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center">
          <p className="font-semibold text-white">No Contact Messages</p>
          <p className="mt-1 text-sm text-slate-400">
            Messages submitted through the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <Motion.article
              key={contact._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.24 }}
              className="rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{contact.fullname}</h3>
                    <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
                      {contact.subject}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <FaEnvelope className="text-red-300" />
                      {contact.email || "N/A"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FaPhone className="text-red-300" />
                      {contact.phone || "N/A"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FaUser className="text-red-300" />
                      {contact.user?.username || "Unknown"}
                    </span>
                    <span className="text-slate-500">
                      {new Date(contact.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-4 rounded-2xl border border-white/5 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
                    {contact.message}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(contact._id)}
                  disabled={isActionLoading}
                  className="inline-flex items-center gap-2 self-start rounded-2xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-50"
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

export default ContactsManager;
