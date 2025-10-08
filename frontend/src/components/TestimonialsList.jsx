import React, { useEffect, useState } from "react";
import TestimonialCard from "../components/TestimonialCard";
import { fetchApprovedTestimonials } from "../api/testimonialApi"; // updated API service

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetchApprovedTestimonials();
        setTestimonials(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message || "Error fetching testimonials");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (loading)
    return (
      <p className="p-4 text-center text-gray-500 text-lg">
        Loading testimonials...
      </p>
    );

  if (error)
    return (
      <p className="p-4 text-center text-red-500 text-lg">{error}</p>
    );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Testimonials</h1>

      {testimonials.length === 0 ? (
        <p className="text-center text-gray-600">No testimonials yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t._id} testimonial={t} />
          ))}
        </div>
      )}
    </div>
  );
}