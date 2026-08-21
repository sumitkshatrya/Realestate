class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async _fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const token = localStorage.getItem("userToken");
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      credentials: "include",
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // If body is FormData, let the browser set the Content-Type header
    if (config.body instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("API Client Error:", error);
      throw error;
    }
  }

  get(endpoint, options) {
    return this._fetch(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, body, options = {}) {
    return this._fetch(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this._fetch(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this._fetch(endpoint, { ...options, method: "DELETE" });
  }
}

export default ApiClient;
