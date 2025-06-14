// src/hooks/useApi.js
import { useState, useCallback } from "react";
import apiService from "@/services/ApiService";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService[method](url, data, config);
      setResponse(result.data);
      return result.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Request failed";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    response,
    request,  // use: await request('post', '/api', data)
  };
};

export default useApi;
