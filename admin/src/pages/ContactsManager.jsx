import React, { useMemo, useState } from "react";

import { motion as Motion, AnimatePresence } from "framer-motion";

import {
  FaEnvelope,
  FaPhone,
  FaTrash,
  FaUser,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaCheck,
  FaInbox,
  FaClock,
  FaExclamationCircle,
  FaFilter,
} from "react-icons/fa";

import { contactAPI } from "../api/contactApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";

const ContactsManager = () => {
  const {
    data: contacts = [],
    loading,
    refetch,
  } = useFetchData(contactAPI.getContacts);

  const confirm = useConfirmationModal();

  const [isActionLoading, setIsActionLoading] =
    useState(false);

  const [search, setSearch] = useState("");

  const [subjectFilter, setSubjectFilter] =
    useState("All");

  const [expandedId, setExpandedId] =
    useState(null);

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [copiedValue, setCopiedValue] =
    useState("");

  /* ====================================================================== */
  /* FILTER DATA                                                            */
  /* ====================================================================== */

  const subjects = useMemo(() => {
    const values = contacts
      .map((contact) => contact.subject)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesSearch =
        !query ||
        contact.fullname
          ?.toLowerCase()
          .includes(query) ||
        contact.email
          ?.toLowerCase()
          .includes(query) ||
        contact.phone
          ?.toLowerCase()
          .includes(query) ||
        contact.subject
          ?.toLowerCase()
          .includes(query) ||
        contact.message
          ?.toLowerCase()
          .includes(query);

      const matchesSubject =
        subjectFilter === "All" ||
        contact.subject === subjectFilter;

      return (
        matchesSearch &&
        matchesSubject
      );
    });
  }, [
    contacts,
    search,
    subjectFilter,
  ]);

  /* ====================================================================== */
  /* STATISTICS                                                             */
  /* ====================================================================== */

  const statistics = useMemo(() => {
    const today = new Date();

    const todayCount = contacts.filter(
      (contact) => {
        if (!contact.createdAt) return false;

        const date = new Date(
          contact.createdAt
        );

        return (
          date.toDateString() ===
          today.toDateString()
        );
      }
    ).length;

    const uniqueEmails = new Set(
      contacts
        .map((contact) => contact.email)
        .filter(Boolean)
    ).size;

    return {
      total: contacts.length,
      today: todayCount,
      filtered: filteredContacts.length,
      uniqueEmails,
    };
  }, [contacts, filteredContacts]);

  /* ====================================================================== */
  /* DELETE                                                                  */
  /* ====================================================================== */

  const handleDelete = (id) => {
    confirm({
      title: "Delete Contact Message?",
      message:
        "This inquiry will be permanently removed from the admin workspace. This action cannot be undone.",
      onConfirm: async () => {
        setIsActionLoading(true);

        try {
          await contactAPI.deleteContact(id);

          setSelectedIds((previous) =>
            previous.filter(
              (selectedId) =>
                selectedId !== id
            )
          );

          await refetch();
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  /* ====================================================================== */
  /* BULK DELETE                                                            */
  /* ====================================================================== */

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;

    confirm({
      title: "Delete Selected Messages?",
      message: `You are about to permanently delete ${selectedIds.length} contact ${
        selectedIds.length === 1
          ? "message"
          : "messages"
      }. This action cannot be undone.`,
      onConfirm: async () => {
        setIsActionLoading(true);

        try {
          /*
           * If your backend supports bulk deletion,
           * replace this with:
           *
           * await contactAPI.deleteContacts(selectedIds)
           */

          await Promise.all(
            selectedIds.map((id) =>
              contactAPI.deleteContact(id)
            )
          );

          setSelectedIds([]);

          await refetch();
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  /* ====================================================================== */
  /* SELECTION                                                              */
  /* ====================================================================== */

  const toggleSelection = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter(
            (selectedId) =>
              selectedId !== id
          )
        : [...previous, id]
    );
  };

  const toggleSelectAll = () => {
    if (
      selectedIds.length ===
      filteredContacts.length
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        filteredContacts.map(
          (contact) => contact._id
        )
      );
    }
  };

  /* ====================================================================== */
  /* COPY                                                                    */
  /* ====================================================================== */

  const handleCopy = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopiedValue(value);

      setTimeout(() => {
        setCopiedValue("");
      }, 1500);
    } catch (error) {
      console.error(
        "Unable to copy:",
        error
      );
    }
  };

  /* ====================================================================== */
  /* LOADING                                                                 */
  /* ====================================================================== */

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-32 animate-pulse rounded-3xl border border-white/10 bg-slate-900/70" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-white/10 bg-slate-900/70"
              />
            )
          )}
        </div>

        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-slate-900/70" />
      </section>
    );
  }

  return (
    <Motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="space-y-6"
    >
      {/* ================================================================== */}
      {/* HEADER                                                              */}
      {/* ================================================================== */}

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-500/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
              <FaInbox className="text-red-300" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Contact Inbox
                </h2>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  Live
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage customer inquiries, property
                questions and sales leads from one
                centralized workspace.
              </p>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
              Inbox
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              {statistics.total}
            </p>

            <p className="text-[10px] text-slate-600">
              total inquiries
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* KPI CARDS                                                           */}
      {/* ================================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FaInbox}
          label="Total Messages"
          value={statistics.total}
          description="All inquiries"
        />

        <StatCard
          icon={FaClock}
          label="Today"
          value={statistics.today}
          description="Received today"
        />

        <StatCard
          icon={FaUser}
          label="Contacts"
          value={statistics.uniqueEmails}
          description="Unique email addresses"
        />

        <StatCard
          icon={FaFilter}
          label="Visible"
          value={statistics.filtered}
          description="Current filter"
        />
      </div>

      {/* ================================================================== */}
      {/* TOOLBAR                                                             */}
      {/* ================================================================== */}

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          {/* Search */}

          <div className="relative flex-1">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-600" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, email, phone, subject or message..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-red-400/40"
            />
          </div>

          {/* Subject filter */}

          <div className="relative">
            <FaFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-600" />

            <select
              value={subjectFilter}
              onChange={(event) =>
                setSubjectFilter(
                  event.target.value
                )
              }
              className="w-full min-w-48 appearance-none rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-9 pr-8 text-sm text-slate-300 outline-none focus:border-red-400/40"
            >
              {subjects.map((subject) => (
                <option
                  key={subject}
                  value={subject}
                >
                  {subject === "All"
                    ? "All subjects"
                    : subject}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk action */}

          {selectedIds.length > 0 && (
            <Motion.button
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              onClick={handleBulkDelete}
              disabled={isActionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
            >
              <FaTrash />
              Delete {selectedIds.length}
            </Motion.button>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* EMPTY STATE                                                         */}
      {/* ================================================================== */}

      {filteredContacts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03]">
            <FaInbox className="text-slate-700" />
          </div>

          <p className="mt-4 font-bold text-white">
            {contacts.length === 0
              ? "No Contact Messages"
              : "No Matching Messages"}
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            {contacts.length === 0
              ? "Customer inquiries submitted through the public contact form will appear here."
              : "Try changing your search or subject filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl">
          {/* ================================================================ */}
          {/* TABLE HEADER                                                      */}
          {/* ================================================================ */}

          <div className="hidden border-b border-white/10 bg-white/[0.02] px-5 py-3 lg:grid lg:grid-cols-[40px_minmax(220px,1.2fr)_minmax(180px,1fr)_140px_110px_45px] lg:items-center lg:gap-4">
            <input
              type="checkbox"
              checked={
                filteredContacts.length > 0 &&
                selectedIds.length ===
                  filteredContacts.length
              }
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-gray-700 bg-slate-900 text-red-600 focus:ring-red-500"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
              Contact
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
              Inquiry
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
              Received
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
              Priority
            </span>

            <span />
          </div>

          {/* ================================================================ */}
          {/* CONTACT LIST                                                      */}
          {/* ================================================================ */}

          <div className="divide-y divide-white/[0.05]">
            {filteredContacts.map(
              (contact, index) => {
                const isExpanded =
                  expandedId === contact._id;

                const isSelected =
                  selectedIds.includes(
                    contact._id
                  );

                return (
                  <Motion.article
                    key={contact._id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.025,
                      duration: 0.2,
                    }}
                    className={`group transition ${
                      isSelected
                        ? "bg-red-500/[0.025]"
                        : "hover:bg-white/[0.015]"
                    }`}
                  >
                    {/* ====================================================== */}
                    {/* DESKTOP ROW                                            */}
                    {/* ====================================================== */}

                    <div className="hidden px-5 py-4 lg:grid lg:grid-cols-[40px_minmax(220px,1.2fr)_minmax(180px,1fr)_140px_110px_45px] lg:items-center lg:gap-4">
                      {/* Checkbox */}

                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          toggleSelection(
                            contact._id
                          )
                        }
                        className="h-4 w-4 rounded border-gray-700 bg-slate-900 text-red-600 focus:ring-red-500"
                      />

                      {/* Contact */}

                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-xs font-bold text-red-300">
                            {contact.fullname
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "?"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {contact.fullname ||
                                "Unknown"}
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-slate-600">
                              {contact.email ||
                                "No email"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Inquiry */}

                      <div className="min-w-0">
                        <span className="inline-flex max-w-full items-center rounded-full border border-red-400/10 bg-red-500/5 px-2.5 py-1 text-[9px] font-bold text-red-300">
                          <span className="truncate">
                            {contact.subject ||
                              "General Inquiry"}
                          </span>
                        </span>

                        <p className="mt-1 truncate text-[10px] text-slate-600">
                          {contact.message ||
                            "No message"}
                        </p>
                      </div>

                      {/* Date */}

                      <div>
                        <p className="text-[11px] font-semibold text-slate-400">
                          {contact.createdAt
                            ? new Date(
                                contact.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-700">
                          {contact.createdAt
                            ? new Date(
                                contact.createdAt
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </p>
                      </div>

                      {/* Priority */}

                      <PriorityBadge
                        subject={
                          contact.subject
                        }
                      />

                      {/* Expand */}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            isExpanded
                              ? null
                              : contact._id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
                      >
                        {isExpanded ? (
                          <FaChevronUp className="text-[10px]" />
                        ) : (
                          <FaChevronDown className="text-[10px]" />
                        )}
                      </button>
                    </div>

                    {/* ====================================================== */}
                    {/* MOBILE ROW                                             */}
                    {/* ====================================================== */}

                    <div className="p-4 lg:hidden">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            toggleSelection(
                              contact._id
                            )
                          }
                          className="mt-2 h-4 w-4 rounded border-gray-700 bg-slate-900 text-red-600 focus:ring-red-500"
                        />

                        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-sm font-bold text-red-300">
                              {contact.fullname
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "?"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-white">
                                {contact.fullname ||
                                  "Unknown"}
                              </p>

                              <p className="truncate text-[10px] text-slate-600">
                                {contact.email ||
                                  "No email"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(
                                isExpanded
                                  ? null
                                  : contact._id
                              )
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-slate-500"
                          >
                            {isExpanded ? (
                              <FaChevronUp className="text-[10px]" />
                            ) : (
                              <FaChevronDown className="text-[10px]" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="ml-7 mt-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-red-400/10 bg-red-500/5 px-2.5 py-1 text-[9px] font-bold text-red-300">
                            {contact.subject ||
                              "General Inquiry"}
                          </span>

                          <PriorityBadge
                            subject={
                              contact.subject
                            }
                          />
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                          {contact.message}
                        </p>

                        <p className="mt-2 text-[9px] text-slate-700">
                          {contact.createdAt
                            ? new Date(
                                contact.createdAt
                              ).toLocaleString()
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>

                    {/* ====================================================== */}
                    {/* EXPANDED DETAILS                                        */}
                    {/* ====================================================== */}

                    <AnimatePresence>
                      {isExpanded && (
                        <Motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.05] bg-slate-950/30 px-5 py-5 lg:pl-[84px]">
                            <div className="grid gap-5 xl:grid-cols-[1fr_auto]">
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                                  Message
                                </p>

                                <p className="mt-2 max-w-3xl whitespace-pre-wrap rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-6 text-slate-400">
                                  {contact.message ||
                                    "No message provided."}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  {/* Email */}

                                  {contact.email && (
                                    <>
                                      <a
                                        href={`mailto:${contact.email}`}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
                                      >
                                        <FaEnvelope className="text-red-300" />
                                        Email
                                      </a>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopy(
                                            contact.email
                                          )
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
                                      >
                                        {copiedValue ===
                                        contact.email ? (
                                          <FaCheck className="text-emerald-400" />
                                        ) : (
                                          <FaCopy />
                                        )}

                                        {copiedValue ===
                                        contact.email
                                          ? "Copied"
                                          : "Copy Email"}
                                      </button>
                                    </>
                                  )}

                                  {/* Phone */}

                                  {contact.phone && (
                                    <>
                                      <a
                                        href={`tel:${contact.phone}`}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
                                      >
                                        <FaPhone className="text-red-300" />
                                        Call
                                      </a>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopy(
                                            contact.phone
                                          )
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
                                      >
                                        {copiedValue ===
                                        contact.phone ? (
                                          <FaCheck className="text-emerald-400" />
                                        ) : (
                                          <FaCopy />
                                        )}

                                        {copiedValue ===
                                        contact.phone
                                          ? "Copied"
                                          : "Copy Phone"}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 xl:items-end">
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                                  Actions
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      contact._id
                                    )
                                  }
                                  disabled={
                                    isActionLoading
                                  }
                                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2.5 text-[10px] font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                                >
                                  <FaTrash />
                                  Delete Inquiry
                                </button>
                              </div>
                            </div>
                          </div>
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </Motion.article>
                );
              }
            )}
          </div>
        </div>
      )}
    </Motion.section>
  );
};

/* ======================================================================== */
/* STAT CARD                                                                */
/* ======================================================================== */

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
}) => {
  return (
    <Motion.div
      whileHover={{
        y: -2,
      }}
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-700">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
          <Icon className="text-xs text-red-300" />
        </div>
      </div>
    </Motion.div>
  );
};

/* ======================================================================== */
/* PRIORITY BADGE                                                           */
/* ======================================================================== */

const PriorityBadge = ({ subject }) => {
  const value =
    subject?.toLowerCase() || "";

  const isHigh =
    value.includes("urgent") ||
    value.includes("buy") ||
    value.includes("sale") ||
    value.includes("property");

  if (isHigh) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/10 bg-amber-500/5 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-amber-400">
        <FaExclamationCircle />
        High
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-400/10 bg-white/[0.02] px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-slate-600">
      Normal
    </span>
  );
};

export default ContactsManager;