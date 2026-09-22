import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Protege rutas que solo pueden ver usuarios con rol 'admin'.
 * Comprueba localStorage.user (lo guardas al login).
 */
const ProtectedRoute = ({ children }) => {
  const raw = localStorage.getItem("user");
  if (!raw) return <Navigate to="/" replace />;

  try {
    const user = JSON.parse(raw);
    if (user?.rol === "administrador" || user?.role === "administrador" || user?.tipo === "Administrador") {
      return children;
    }
    return <Navigate to="/" replace />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
