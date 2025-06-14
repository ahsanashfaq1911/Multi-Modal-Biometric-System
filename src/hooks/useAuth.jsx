// src/hooks/useAuth.js
import { useEffect } from "react";
import apiService from "@/services/ApiService";

const useAuth = () => {
  const tokenKey = "auth_token";

  const login = (token) => {
    localStorage.setItem(tokenKey, token);
    apiService.setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    apiService.clearAuthToken();
  };

  const getToken = () => localStorage.getItem(tokenKey);

  useEffect(() => {
    const token = getToken();
    if (token) apiService.setAuthToken(token);
  }, []);

  return { login, logout, getToken };
};

export default useAuth;
