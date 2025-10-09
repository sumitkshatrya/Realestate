// components/AdminServicesList.js
import React, { useState, useEffect } from "react";
import { servicesAPI } from "../api/servicesApi";

const AdminServicesList = () => {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    icon: "FaBuilding",
    order: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getServices();
      setServices(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const startEdit = (service) => {
    setEditingId(service._id);
    setEditData({ ...service });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      title: "",
      description: "",
      icon: "FaBuilding",
      order: 0,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await servicesAPI.updateService(id, editData);
      cancelEdit();
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await servicesAPI.deleteService(id);
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Services List (Manage)</h2>

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
          >
            {editingId === service._id ? (
              // EDIT MODE
              <div className="flex flex-col md:flex-row gap-2 w-full md:items-center">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <select
                  value={editData.icon}
                  onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="FaHome">Home Icon</option>
                  <option value="FaKey">Key Icon</option>
                  <option value="FaMapMarkerAlt">Location Icon</option>
                  <option value="FaChartLine">Chart Icon</option>
                  <option value="FaBuilding">Building Icon</option>
                </select>
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="border rounded-lg p-2 flex-1"
                />
                <input
                  type="number"
                  value={editData.order}
                  onChange={(e) => setEditData({ ...editData, order: +e.target.value })}
                  className="border rounded-lg p-2 w-24"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(service._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full md:gap-4">
                <div>
                  <h4 className="font-semibold">{service.title}</h4>
                  <p className="text-gray-600">{service.description}</p>
                  <p className="text-sm text-gray-400">Order: {service.order}</p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() => startEdit(service)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServicesList;
