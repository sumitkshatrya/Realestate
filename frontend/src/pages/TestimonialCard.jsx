import React from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';

const TestimonialCard = ({ testimonial }) => {
  const rating = Math.min(5, Math.max(0, Number(testimonial.rating) || 0));

  return (
    <div className="h-full flex flex-col bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
      <div className="flex-grow mb-4">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
            />
          ))}
        </div>
        <p className="text-slate-600 italic">"{testimonial.feedback}"</p>
      </div>
      <div className="flex items-center gap-4 border-t border-slate-200 pt-4">
        {testimonial.profilePicture ? (
          <img src={testimonial.profilePicture} alt={testimonial.fullName} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <FaUserCircle className="w-12 h-12 text-slate-300" />
        )}
        <div>
          <p className="font-bold text-slate-800">{testimonial.fullName}</p>
          <p className="text-sm text-slate-500">{testimonial.companyName || 'Client'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;