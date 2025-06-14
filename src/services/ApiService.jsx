// src/services/ApiService.js
import axios from "axios";

class ApiService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || import.meta.env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response Interceptor (optional)
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.api.defaults.headers.common["Authorization"];
  }

  get(url, config = {}) {
    return this.api.get(url, config);
  }

  post(url, data, config = {}) {
    return this.api.post(url, data, this.getRequestConfig(data, config));
  }

  put(url, data, config = {}) {
    return this.api.put(url, data, this.getRequestConfig(data, config));
  }

  delete(url, config = {}) {
    return this.api.delete(url, config);
  }

  // Helper to auto-detect FormData
  getRequestConfig(data, config) {
    if (data instanceof FormData) {
      return {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      };
    }
    return config;
  }
}

const apiService = new ApiService();
export default apiService;
