import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const raw = localStorage.getItem("user");
  if (!raw) return <Navigate to="/" replace />;

  try {
    const user = JSON.parse(raw);
    const role = user?.rol || user?.role || user?.tipo;
    const allowedRoles = ["administrador", "admin", "Administrador", "ADMIN"];

    if (allowedRoles.includes(role)) {
      return children;
    }

    return <Navigate to="/dashboard" replace />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
