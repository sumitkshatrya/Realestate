import React, { useEffect, useMemo, useState } from "react";

import { motion as Motion } from "framer-motion";

import {
  FaCheck,
  FaEye,
  FaFileAlt,
  FaPlus,
  FaSave,
  FaTrash,
  FaUndo,
} from "react-icons/fa";

import { contentAPI } from "../api/contentApi";
import { useFetchData } from "../api/useFetchData";

import { useForm, useFieldArray } from "react-hook-form";

const defaultValues = {
  subtitle: "",
  title: "",
  paragraph: "",

  features: [
    {
      value: "",
    },
  ],

  storyTitle: "",
  storyContent: "",

  missionStatement: "",
  visionStatement: "",
};

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-red-400/50 focus:bg-slate-950";

const labelClasses =
  "mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500";

const AboutContentManager = () => {
  const {
    data: content,
    loading,
    refetch,
  } = useFetchData(contentAPI.getAboutContent);

  const [isSaving, setIsSaving] = useState(false);

  const [saveState, setSaveState] = useState("idle");

  const [lastSavedAt, setLastSavedAt] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isDirty,
    },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const {
    fields: featureFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "features",
  });

  const watchedValues = watch();

  /* ====================================================================== */
  /* LOAD CONTENT                                                           */
  /* ====================================================================== */

  useEffect(() => {
    if (!content || Object.keys(content).length === 0) {
      return;
    }

    reset({
      subtitle: content.subtitle || "",

      title: content.title || "",

      paragraph: content.paragraph || "",

      features:
        Array.isArray(content.features) &&
        content.features.length > 0
          ? content.features.map((feature) => ({
              value: feature,
            }))
          : [
              {
                value: "",
              },
            ],

      storyTitle: content.storyTitle || "",

      storyContent: content.storyContent || "",

      missionStatement:
        content.missionStatement || "",

      visionStatement:
        content.visionStatement || "",
    });

    setSaveState("idle");
  }, [content, reset]);

  /* ====================================================================== */
  /* FORM DATA                                                              */
  /* ====================================================================== */

  const previewFeatures = useMemo(() => {
    return (watchedValues.features || [])
      .map((feature) =>
        typeof feature === "string"
          ? feature
          : feature?.value
      )
      .filter(Boolean);
  }, [watchedValues.features]);

  /* ====================================================================== */
  /* SAVE                                                                    */
  /* ====================================================================== */

  const onSubmit = async (data) => {
    setIsSaving(true);
    setSaveState("saving");

    try {
      const payload = {
        subtitle: data.subtitle.trim(),

        title: data.title.trim(),

        paragraph: data.paragraph.trim(),

        features: (data.features || [])
          .map((feature) =>
            typeof feature === "string"
              ? feature.trim()
              : feature.value.trim()
          )
          .filter(Boolean),

        storyTitle: data.storyTitle.trim(),

        storyContent: data.storyContent.trim(),

        missionStatement:
          data.missionStatement.trim(),

        visionStatement:
          data.visionStatement.trim(),
      };

      await contentAPI.updateAboutContent(payload);

      await refetch();

      setSaveState("saved");

      setLastSavedAt(new Date());

      /*
       * Reset dirty state after successful save.
       */

      reset({
        ...data,
      });
    } catch (error) {
      console.error(
        "Failed to save about content:",
        error
      );

      setSaveState("error");
    } finally {
      setIsSaving(false);
    }
  };

  /* ====================================================================== */
  /* RESET                                                                   */
  /* ====================================================================== */

  const handleReset = () => {
    if (!content) return;

    reset({
      subtitle: content.subtitle || "",

      title: content.title || "",

      paragraph: content.paragraph || "",

      features:
        Array.isArray(content.features) &&
        content.features.length > 0
          ? content.features.map((feature) => ({
              value: feature,
            }))
          : [
              {
                value: "",
              },
            ],

      storyTitle: content.storyTitle || "",

      storyContent: content.storyContent || "",

      missionStatement:
        content.missionStatement || "",

      visionStatement:
        content.visionStatement || "",
    });

    setSaveState("idle");
  };

  /* ====================================================================== */
  /* LOADING                                                                 */
  /* ====================================================================== */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-3xl border border-white/10 bg-slate-900/70" />

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="h-[650px] animate-pulse rounded-3xl border border-white/10 bg-slate-900/70" />

          <div className="h-[500px] animate-pulse rounded-3xl border border-white/10 bg-slate-900/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* PAGE HEADER                                                         */}
      {/* ================================================================== */}

      <Motion.section
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20"
      >
        {/* Background glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-500/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
              <FaFileAlt className="text-red-300" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  About Page Content
                </h2>

                {isDirty && (
                  <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                    Unsaved changes
                  </span>
                )}

                {saveState === "saved" &&
                  !isDirty && (
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                      <FaCheck className="text-[8px]" />
                      Published
                    </span>
                  )}
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the content displayed on your
                public About page. Changes are saved to
                the live website after publishing.
              </p>
            </div>
          </div>

          {/* Save metadata */}

          <div className="text-left lg:text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
              Content Status
            </p>

            <p
              className={`mt-1 text-xs font-semibold ${
                isDirty
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {isDirty
                ? "Changes pending"
                : "All changes published"}
            </p>
          </div>
        </div>
      </Motion.section>

      {/* ================================================================== */}
      {/* EDITOR + PREVIEW                                                    */}
      {/* ================================================================== */}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* ================================================================== */}
        {/* EDITOR                                                             */}
        {/* ================================================================== */}

        <Motion.form
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.05,
            duration: 0.3,
          }}
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl"
        >
          {/* ================================================================ */}
          {/* FORM HEADER                                                       */}
          {/* ================================================================ */}

          <div className="border-b border-white/10 px-5 py-4 sm:px-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-400/70">
              Content Editor
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              Main About Section
            </h3>
          </div>

          <div className="space-y-8 p-5 sm:p-6">
            {/* ============================================================ */}
            {/* HERO CONTENT                                                   */}
            {/* ============================================================ */}

            <section>
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white">
                  Hero Content
                </h4>

                <p className="mt-1 text-xs text-slate-600">
                  The primary content visitors see on
                  the About page.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Subtitle */}

                <div>
                  <label className={labelClasses}>
                    Subtitle
                  </label>

                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Who we are"
                    {...register("subtitle", {
                      required:
                        "Subtitle is required.",
                      maxLength: {
                        value: 100,
                        message:
                          "Subtitle cannot exceed 100 characters.",
                      },
                    })}
                    className={inputClasses}
                  />

                  <div className="mt-1 flex justify-between">
                    {errors.subtitle ? (
                      <p className="text-[10px] text-rose-400">
                        {errors.subtitle.message}
                      </p>
                    ) : (
                      <span />
                    )}

                    <span className="text-[9px] text-slate-700">
                      {watchedValues.subtitle?.length ||
                        0}
                      /100
                    </span>
                  </div>
                </div>

                {/* Title */}

                <div>
                  <label className={labelClasses}>
                    Main Title
                  </label>

                  <input
                    type="text"
                    maxLength={150}
                    placeholder="Building better futures"
                    {...register("title", {
                      required:
                        "Title is required.",
                      maxLength: {
                        value: 150,
                        message:
                          "Title cannot exceed 150 characters.",
                      },
                    })}
                    className={inputClasses}
                  />

                  <div className="mt-1 flex justify-between">
                    {errors.title ? (
                      <p className="text-[10px] text-rose-400">
                        {errors.title.message}
                      </p>
                    ) : (
                      <span />
                    )}

                    <span className="text-[9px] text-slate-700">
                      {watchedValues.title?.length ||
                        0}
                      /150
                    </span>
                  </div>
                </div>
              </div>

              {/* Paragraph */}

              <div className="mt-4">
                <label className={labelClasses}>
                  Introduction
                </label>

                <textarea
                  rows={5}
                  maxLength={1000}
                  placeholder="Write a concise introduction about your company..."
                  {...register("paragraph", {
                    required:
                      "Introduction is required.",
                    maxLength: {
                      value: 1000,
                      message:
                        "Introduction cannot exceed 1000 characters.",
                    },
                  })}
                  className={`${inputClasses} min-h-32 resize-y`}
                />

                <div className="mt-1 flex justify-between">
                  {errors.paragraph ? (
                    <p className="text-[10px] text-rose-400">
                      {errors.paragraph.message}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span className="text-[9px] text-slate-700">
                    {watchedValues.paragraph?.length ||
                      0}
                    /1000
                  </span>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* FEATURES                                                       */}
            {/* ============================================================ */}

            <section className="border-t border-white/10 pt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Company Features
                  </h4>

                  <p className="mt-1 text-xs text-slate-600">
                    Highlight the main benefits or
                    differentiators of your company.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    append({
                      value: "",
                    })
                  }
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-300 transition hover:bg-red-500/15"
                >
                  <FaPlus className="text-[8px]" />
                  Add
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {featureFields.map(
                  (field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-[10px] font-bold text-slate-600">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder={`Feature ${index + 1}`}
                        {...register(
                          `features.${index}.value`,
                          {
                            maxLength: {
                              value: 150,
                              message:
                                "Feature is too long.",
                            },
                          }
                        )}
                        className={`${inputClasses} py-2.5`}
                      />

                      {featureFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            remove(index)
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-400/10 bg-rose-500/[0.05] text-rose-400/60 transition hover:bg-rose-500/10 hover:text-rose-300"
                          aria-label={`Remove feature ${
                            index + 1
                          }`}
                        >
                          <FaTrash className="text-[10px]" />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>

            {/* ============================================================ */}
            {/* COMPANY STORY                                                  */}
            {/* ============================================================ */}

            <section className="border-t border-white/10 pt-7">
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white">
                  Company Story
                </h4>

                <p className="mt-1 text-xs text-slate-600">
                  Tell visitors about your company's
                  journey and background.
                </p>
              </div>

              <div>
                <label className={labelClasses}>
                  Story Title
                </label>

                <input
                  type="text"
                  maxLength={150}
                  placeholder="Our journey"
                  {...register("storyTitle")}
                  className={inputClasses}
                />
              </div>

              <div className="mt-4">
                <label className={labelClasses}>
                  Story Content
                </label>

                <textarea
                  rows={7}
                  maxLength={3000}
                  placeholder="Tell your company story..."
                  {...register("storyContent")}
                  className={`${inputClasses} resize-y`}
                />

                <div className="mt-1 text-right text-[9px] text-slate-700">
                  {watchedValues.storyContent?.length ||
                    0}
                  /3000
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* MISSION + VISION                                               */}
            {/* ============================================================ */}

            <section className="border-t border-white/10 pt-7">
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white">
                  Mission & Vision
                </h4>

                <p className="mt-1 text-xs text-slate-600">
                  Define the purpose and long-term
                  direction of the company.
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className={labelClasses}>
                    Mission Statement
                  </label>

                  <textarea
                    rows={4}
                    maxLength={1000}
                    placeholder="Our mission is..."
                    {...register(
                      "missionStatement"
                    )}
                    className={`${inputClasses} resize-y`}
                  />

                  <div className="mt-1 text-right text-[9px] text-slate-700">
                    {watchedValues.missionStatement
                      ?.length || 0}
                    /1000
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>
                    Vision Statement
                  </label>

                  <textarea
                    rows={4}
                    maxLength={1000}
                    placeholder="Our vision is..."
                    {...register(
                      "visionStatement"
                    )}
                    className={`${inputClasses} resize-y`}
                  />

                  <div className="mt-1 text-right text-[9px] text-slate-700">
                    {watchedValues.visionStatement
                      ?.length || 0}
                    /1000
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================================================================ */}
          {/* FORM FOOTER                                                       */}
          {/* ================================================================ */}

          <div className="sticky bottom-0 border-t border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Status */}

              <div className="text-[10px] text-slate-600">
                {saveState === "saving" && (
                  <span className="text-amber-400">
                    Saving changes...
                  </span>
                )}

                {saveState === "error" && (
                  <span className="text-rose-400">
                    Failed to save changes.
                  </span>
                )}

                {saveState === "saved" &&
                  lastSavedAt && (
                    <span className="text-emerald-400">
                      Saved successfully at{" "}
                      {lastSavedAt.toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  )}

                {saveState === "idle" &&
                  !isDirty && (
                    <span>
                      No unsaved changes
                    </span>
                  )}
              </div>

              {/* Actions */}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={
                    !isDirty || isSaving
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FaUndo className="text-[9px]" />
                  Reset
                </button>

                <Motion.button
                  whileHover={
                    !isSaving
                      ? {
                          scale: 1.01,
                        }
                      : undefined
                  }
                  whileTap={
                    !isSaving
                      ? {
                          scale: 0.99,
                        }
                      : undefined
                  }
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaSave
                    className={
                      isSaving
                        ? "animate-pulse"
                        : ""
                    }
                  />

                  {isSaving
                    ? "Saving..."
                    : "Publish Changes"}
                </Motion.button>
              </div>
            </div>
          </div>
        </Motion.form>

        {/* ================================================================== */}
        {/* LIVE PREVIEW                                                        */}
        {/* ================================================================== */}

        <Motion.aside
          initial={{
            opacity: 0,
            x: 15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.3,
          }}
          className="xl:sticky xl:top-24"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl">
            {/* Preview header */}

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <FaEye className="text-xs text-red-300" />

                <span className="text-xs font-bold text-white">
                  Live Preview
                </span>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                Preview
              </span>
            </div>

            {/* Preview content */}

            <div className="p-5">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
                {/* Subtitle */}

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-400">
                  {watchedValues.subtitle ||
                    "Your subtitle"}
                </p>

                {/* Title */}

                <h3 className="mt-3 text-2xl font-black leading-tight text-white">
                  {watchedValues.title ||
                    "Your About Page Title"}
                </h3>

                {/* Paragraph */}

                <p className="mt-4 text-xs leading-6 text-slate-500">
                  {watchedValues.paragraph ||
                    "Your introduction will appear here."}
                </p>

                {/* Features */}

                {previewFeatures.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {previewFeatures.map(
                      (feature, index) => (
                        <div
                          key={`${feature}-${index}`}
                          className="flex items-center gap-2"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                            <FaCheck className="text-[7px] text-emerald-400" />
                          </div>

                          <span className="text-[10px] text-slate-400">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Divider */}

                <div className="my-6 h-px bg-white/10" />

                {/* Story */}

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-700">
                    Our Story
                  </p>

                  <h4 className="mt-2 text-sm font-bold text-white">
                    {watchedValues.storyTitle ||
                      "Our Story"}
                  </h4>

                  <p className="mt-2 text-[10px] leading-5 text-slate-600">
                    {watchedValues.storyContent ||
                      "Your story content will appear here."}
                  </p>
                </div>

                {/* Mission */}

                <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-red-400/70">
                    Mission
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500">
                    {watchedValues.missionStatement ||
                      "Your mission statement."}
                  </p>
                </div>

                {/* Vision */}

                <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-red-400/70">
                    Vision
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500">
                    {watchedValues.visionStatement ||
                      "Your vision statement."}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview footer */}

            <div className="border-t border-white/10 px-5 py-3">
              <p className="text-center text-[9px] text-slate-700">
                Preview updates automatically as you
                edit.
              </p>
            </div>
          </div>
        </Motion.aside>
      </div>
    </div>
  );
};

export default AboutContentManager;