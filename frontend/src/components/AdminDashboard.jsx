// pages/AdminDashboard.jsx
import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminServices from "./AdminServices";
import AdminServicesList from "./AdminServicesList";
import AdminPanel from "../pages/AdminPanel";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-auto">
        <Outlet />
        <AdminServices/>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
