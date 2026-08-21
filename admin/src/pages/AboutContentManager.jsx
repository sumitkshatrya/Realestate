import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaSave } from "react-icons/fa";
import { contentAPI } from "../api/contentApi";
import { useFetchData } from "../api/useFetchData";
import { useForm } from "react-hook-form";

const AboutContentManager = () => {
  const { data: content, loading, refetch } = useFetchData(contentAPI.getAboutContent);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subtitle: "",
      title: "",
      paragraph: "",
      features: [],
      storyTitle: "",
      storyContent: "",
      missionStatement: "",
      visionStatement: "",
    },
  });

  // Populate the form once content is loaded
  React.useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      reset({
        subtitle: content.subtitle || "",
        title: content.title || "",
        paragraph: content.paragraph || "",
        features: Array.isArray(content.features) ? content.features.join("\n") : "",
        storyTitle: content.storyTitle || "",
        storyContent: content.storyContent || "",
        missionStatement: content.missionStatement || "",
        visionStatement: content.visionStatement || "",
      });
    }
  }, [content, reset]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        subtitle: data.subtitle,
        title: data.title,
        paragraph: data.paragraph,
        features: data.features
          ? data.features.split("\n").map((f) => f.trim()).filter(Boolean)
          : [],
        storyTitle: data.storyTitle,
        storyContent: data.storyContent,
        missionStatement: data.missionStatement,
        visionStatement: data.visionStatement,
      };
      await contentAPI.updateAboutContent(payload);
      await refetch();
    } catch (error) {
      /* Errors are handled by the global axios interceptor */
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
        Loading about content...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-2xl font-semibold text-white">About Page Content</h2>
        <p className="mt-2 text-sm text-slate-300">
          Edit the About Us section content shown on the public website. Features
          should be entered one per line.
        </p>
      </Motion.section>

      <Motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Subtitle</label>
            <input
              type="text"
              {...register("subtitle", { required: "Subtitle is required." })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
            />
            {errors.subtitle && <p className="mt-1 text-xs text-red-400">{errors.subtitle.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Title</label>
            <input
              type="text"
              {...register("title", { required: "Title is required." })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">Paragraph</label>
          <textarea
            {...register("paragraph", { required: "Paragraph is required." })}
            rows="4"
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
          />
          {errors.paragraph && <p className="mt-1 text-xs text-red-400">{errors.paragraph.message}</p>}
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">Features (one per line)</label>
          <textarea
            {...register("features")}
            rows="4"
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
          />
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white">Detailed About Page</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Story Title</label>
              <input
                type="text"
                {...register("storyTitle")}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Mission Statement</label>
              <input
                type="text"
                {...register("missionStatement")}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">Story Content</label>
            <textarea
              {...register("storyContent")}
              rows="4"
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
            />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">Vision Statement</label>
            <textarea
              {...register("visionStatement")}
              rows="3"
              className="min-h-20 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
            />
          </div>
        </div>

        <Motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSaving}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500 disabled:opacity-70"
        >
          <FaSave />
          {isSaving ? "Saving..." : "Save Content"}
        </Motion.button>
      </Motion.form>
    </div>
  );
};

export default AboutContentManager;
