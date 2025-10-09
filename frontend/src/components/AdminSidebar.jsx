// components/AdminSidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCog, FaList, FaCommentDots, FaSignOutAlt, FaBars } from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-red-700 text-white"
        : "text-red-100 hover:bg-red-600 hover:text-white"
    }`;

  return (
    <div
      className={`h-screen bg-red-800 text-red-100 flex flex-col justify-between shadow-lg transition-width duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          {!isCollapsed && <h1 className="text-2xl font-bold text-white">Admin Panel</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white text-xl p-1 rounded hover:bg-red-600"
          >
            <FaBars />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-2">
          <NavLink to="/adminservices" className={linkClasses}>
            <FaCog />
            {!isCollapsed && <span>Admin Services</span>}
          </NavLink>

          <NavLink to="/adminserviceslist" className={linkClasses}>
            <FaList />
            {!isCollapsed && <span>Admin Services List</span>}
          </NavLink>

          <NavLink to="/admin" className={linkClasses}>
            <FaCommentDots />
            {!isCollapsed && <span>Testimonial Manage</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-red-100 hover:bg-red-600 hover:text-white transition-colors duration-200 w-full"
          >
            <FaSignOutAlt />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-6 text-sm text-red-200 text-center">
          &copy; {new Date().getFullYear()} Admin Dashboard
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
