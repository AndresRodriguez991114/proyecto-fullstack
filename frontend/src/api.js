import axios from "axios";


const api = axios.create({
  baseURL: "https://proyecto-fullstack-nfai.onrender.com/api",
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
    // SOLO redirigir si 401 y NO es login
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/usuarios/login"
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
