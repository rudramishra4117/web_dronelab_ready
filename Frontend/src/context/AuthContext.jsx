import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "";
const FRONTEND_URL = window.location.origin;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");

      if (accessToken && storedUser) {
        try {
          // Validate token by fetching current user
          const response = await api.get("/auth/me");
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          document.cookie = `dronelab_jwt=${accessToken}; path=/; max-age=86400`;
        } catch {
          // Token is invalid — clear storage
          localStorage.removeItem("access_token");
          document.cookie = "dronelab_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, refresh_token, user: userData } = response.data;

      localStorage.setItem("access_token", access_token);
      document.cookie = `dronelab_jwt=${access_token}; path=/; max-age=86400`;
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      const { access_token, refresh_token, user: userData } = response.data;

      localStorage.setItem("access_token", access_token);
      document.cookie = `dronelab_jwt=${access_token}; path=/; max-age=86400`;
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.detail || "Registration failed. Please try again.";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const socialLogin = useCallback(async (provider, code) => {
    setError(null);
    try {
      const response = await api.post(`/auth/${provider}`, { code });
      const { access_token, refresh_token, user: userData } = response.data;

      localStorage.setItem("access_token", access_token);
      document.cookie = `dronelab_jwt=${access_token}; path=/; max-age=86400`;
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        `${provider} login failed. Please try again.`;
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    document.cookie = "dronelab_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  }, []);

  const initiateGoogleLogin = useCallback((nextUrl = "") => {
    const redirectUri = `${FRONTEND_URL}/auth/callback/google`;
    const scope = "openid email profile";
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=offline` +
      `&prompt=consent` +
      (nextUrl ? `&state=${encodeURIComponent(nextUrl)}` : "");

    window.location.href = url;
  }, []);

  const initiateGithubLogin = useCallback((nextUrl = "") => {
    const redirectUri = `${FRONTEND_URL}/auth/callback/github`;
    const scope = "read:user user:email";
    const url =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      (nextUrl ? `&state=${encodeURIComponent(nextUrl)}` : "");

    window.location.href = url;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    socialLogin,
    logout,
    initiateGoogleLogin,
    initiateGithubLogin,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
