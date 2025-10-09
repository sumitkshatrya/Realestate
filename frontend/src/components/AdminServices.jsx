// components/AdminServices.js
import React, { useState, useEffect } from "react";
import { servicesAPI } from "../api/servicesApi";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaKey, 
  FaMapMarkerAlt, 
  FaChartLine, 
  FaBuilding,
  FaTools,
  FaHandshake,
  FaCity,
  FaSearchDollar,
  FaClipboardList,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes
} from "react-icons/fa";

const iconOptions = [
  { value: "FaHome", label: "Home", icon: FaHome },
  { value: "FaKey", label: "Key", icon: FaKey },
  { value: "FaMapMarkerAlt", label: "Location", icon: FaMapMarkerAlt },
  { value: "FaChartLine", label: "Chart", icon: FaChartLine },
  { value: "FaBuilding", label: "Building", icon: FaBuilding },
  { value: "FaTools", label: "Tools", icon: FaTools },
  { value: "FaHandshake", label: "Handshake", icon: FaHandshake },
  { value: "FaCity", label: "City", icon: FaCity },
  { value: "FaSearchDollar", label: "Search Dollar", icon: FaSearchDollar },
  { value: "FaClipboardList", label: "Clipboard", icon: FaClipboardList },
];

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "FaHome",
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getServices();
      setServices(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching services:", error);
      alert("Failed to load services. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      
      if (editingService) {
        // Update existing service
        await servicesAPI.updateService(editingService._id, formData);
        alert("Service updated successfully!");
      } else {
        // Create new service
        await servicesAPI.createService(formData);
      
        alert("Service created successfully!");
      }

      resetForm();
      await fetchServices(); // Refresh the list
      
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "FaHome",
      order: 0,
      isActive: true
    });
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      order: service.order || 0,
      isActive: service.isActive !== false
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await servicesAPI.deleteService(id);
      alert("Service deleted successfully!");
      await fetchServices(); // Refresh the list
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (service) => {
    try {
      const updatedService = {
        ...service,
        isActive: !service.isActive
      };
      await servicesAPI.updateService(service._id, updatedService);
      await fetchServices(); // Refresh the list
    } catch (error) {
      console.error("Error updating service status:", error);
      alert("Failed to update service status.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Manage Services
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add, edit, or remove services that will be displayed on the Services page
        </p>
      </div>

      {/* Service Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingService ? "Edit Service" : "Add New Service"}
          </h3>
          {editingService && (
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <FaTimes />
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Property Valuation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              placeholder="Describe the service in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                disabled={loading}
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    disabled={loading}
                  />
                  <div className={`block w-14 h-8 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.isActive ? 'translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                  {formData.isActive ? 'Active' : 'Inactive'}
                </div>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingService ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FaPlus />
                  {editingService ? "Update Service" : "Create Service"}
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Services List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Current Services ({services.length})
          </h3>
        </div>

        {loading && !services.length ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center">
            <FaBuilding className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No services found. Create your first service above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {services.map((service) => {
              const IconComponent = iconOptions.find(opt => opt.value === service.icon)?.icon || FaBuilding;
              
              return (
                <div
                  key={service._id}
                  className={`p-6 transition-colors ${
                    service.isActive === false ? 'bg-gray-50 dark:bg-gray-900/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <IconComponent className="text-blue-600 dark:text-blue-400 text-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold text-lg ${
                            service.isActive === false ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {service.title}
                          </h4>
                          {service.isActive === false && (
                            <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className={`mt-1 ${
                          service.isActive === false ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {service.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>Icon: {service.icon}</span>
                          <span>Order: {service.order}</span>
                          <span>ID: {service._id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleServiceStatus(service)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          service.isActive === false
                            ? 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400'
                            : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-400'
                        }`}
                      >
                        {service.isActive === false ? 'Activate' : 'Deactivate'}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit service"
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete service"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;