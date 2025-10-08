import React, { useEffect, useState } from "react";
import AdminTable from "../components/AdminTable";
import {
  adminFetchAll,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../api/testimonialApi";

const AdminPanel = () => {
  const [testimonials, setTestimonials] = useState([]);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await adminFetchAll(token);   //  pass token
      setTestimonials(res.data);                //  res.data from axios
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem("adminToken");
    await updateTestimonialStatus(id, status, token);   // ✅ pass token
    fetchTestimonials();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    await deleteTestimonial(id, token);                // ✅ pass token
    fetchTestimonials();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminTable
        testimonials={testimonials}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminPanel;
