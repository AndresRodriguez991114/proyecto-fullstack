import axios from "axios";

const getDefaultApiUrl = () => {
  if (typeof window === "undefined") return "http://localhost:4000/api";

  const host = window.location.hostname;
  const isLocalNetworkHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    /^192\.168\./.test(host) ||
    /^10\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);

  if (isLocalNetworkHost) {
    return `http://${host}:4000/api`;
  }

  return process.env.REACT_APP_API_URL || "https://proyecto-fullstack-nfai.onrender.com/api";
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || getDefaultApiUrl(),
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest?.url !== "/usuarios/login"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
