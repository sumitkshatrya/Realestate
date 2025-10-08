import React from "react";

const BASE_URL = "http://localhost:5000"; // Backend base URL

const AdminTable = ({ testimonials, onStatusChange, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-sm text-gray-700">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-center">Rating</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Feedback</th>
            <th className="p-3 text-center">Media</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t, index) => (
            <tr
              key={t._id}
              className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
            >
              {/* Name */}
              <td className="p-3 font-medium">{t.fullName}</td>

              {/* Email */}
              <td className="p-3 text-gray-500">{t.email}</td>

              {/* Rating */}
              <td className="p-3 text-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${t.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </td>

              {/* Title */}
              <td className="p-3">{t.title}</td>

              {/* Feedback */}
              <td className="p-3 max-w-xs truncate">{t.feedback}</td>

              {/* Media field */}
              <td className="p-3 text-center">
                {t.mediaUrl ? (
                  t.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                    <img
                      src={`${BASE_URL}${t.mediaUrl}`}
                      alt="testimonial media"
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  ) : t.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={`${BASE_URL}${t.mediaUrl}`}
                      controls
                      className="w-20 h-16 object-cover rounded mx-auto"
                    />
                  ) : (
                    <a
                      href={`${BASE_URL}${t.mediaUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      View Media
                    </a>
                  )
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>

              {/* Status */}
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    t.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : t.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.status}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => onStatusChange(t._id, "Approved")}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs"
                >
                  Approve
                </button>
                <button
                  onClick={() => onStatusChange(t._id, "Rejected")}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-xs"
                >
                  Reject
                </button>
                <button
                  onClick={() => onDelete(t._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
