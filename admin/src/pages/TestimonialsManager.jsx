import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import AdminTable from "../components/AdminTable";
import {
  adminFetchAll,
  deleteTestimonial,
  updateTestimonialStatus,
} from "../api/testimonialApi";

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await adminFetchAll();
      setTestimonials(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateTestimonialStatus(id, status);
    fetchTestimonials();
  };

  const handleDelete = async (id) => {
    await deleteTestimonial(id);
    fetchTestimonials();
  };

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Testimonials</h2>
        <p className="mt-2 text-sm text-slate-300">
          Review submissions, approve valid reviews, reject bad ones, and remove
          anything you do not want to publish.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
          Loading testimonials...
        </div>
      ) : (
        <AdminTable
          testimonials={testimonials}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </Motion.section>
  );
};

export default TestimonialsManager;
