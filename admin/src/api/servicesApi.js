const API_BASE_URL = "http://localhost:8080/api";

const normalizeServicesList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

export const servicesAPI = {
  getServices: async () => {
    const response = await fetch(`${API_BASE_URL}/services?includeInactive=true`);

    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }

    const payload = await response.json();
    return normalizeServicesList(payload);
  },

  createService: async (serviceData) => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error("Failed to create service");
    }

    return response.json();
  },

  updateService: async (id, serviceData) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error("Failed to update service");
    }

    return response.json();
  },

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
