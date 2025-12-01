import axios from "axios";

const api = axios.create({
  baseURL: "https://proyecto-fullstack-nfai.onrender.com/api",
  timeout: 10000,
});

// Añadir token automáticamente a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Manejo global de errores
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Token vencido o inválido
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirige al login si estamos en un navegador
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
