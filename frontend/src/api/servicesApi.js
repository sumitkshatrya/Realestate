// services/api.js
const API_BASE_URL = "http://localhost:8080/api";

export const servicesAPI = {
  // Get all services
  getServices: async () => {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    return response.json();
  },

  // Create new service
  createService: async (serviceData) => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });
    if (!response.ok) {
      throw new Error("Failed to create service");
    }
    return response.json();
  },

  // Update service
  updateService: async (id, serviceData) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });
    if (!response.ok) {
      throw new Error("Failed to update service");
    }
    return response.json();
  },

  // Delete service
  deleteService: async (id) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete service");
    }
    return response.json();
  },
};
