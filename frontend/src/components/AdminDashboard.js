import React, { useState, useEffect } from "react";
import UsersPanel from "./UsersPanel";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  // -----------------------------
  // 🔥 TOGGLE MODO OSCURO / CLARO
  // -----------------------------
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={`admin-root ${theme}`}>
      
      <aside className="admin-sidebar">
        <div className="brand">
          <img src="/images/Logo.png" alt="Logo" />
          <h3>Cloud + Inventory</h3>
        </div>

        <nav className="admin-nav">
          <button onClick={() => window.scrollTo(0, 0)}>Dashboard</button>
          <button onClick={() => document.getElementById("users-panel")?.scrollIntoView({ behavior: "smooth" })}>Usuarios</button>
          <button onClick={() => navigate("/admin/reports")}>Reportes</button>
        </nav>

        <div className="sidebar-footer">
          <small>{user?.nombre || user?.email}</small>
          <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="admin-main">
        
        {/* ----------------------  
              HEADER + TOGGLE  
        ---------------------- */}
      <header className="admin-header">
        <h1>Panel de Administrador</h1>

        {/* 🔥 TOGGLE COMPLETO CON TOOLTIP DINÁMICO */}
        <div className="theme-toggle-wrapper">
          <div className="theme-tooltip">
            {theme === "light" ? "Modo oscuro" : "Modo claro"}
          </div>

          <div className="theme-toggle" onClick={toggleTheme}>
            <span className="icon">{theme === "dark" ? "🌙" : "☀️"}</span>
          </div>
        </div>
      </header>

        <section className="cards-row">
          <div className="card">
            <h4>Usuarios</h4>
            <p id="total-users">—</p>
          </div>

          <div className="card">
            <h4>Servicios</h4>
            <p>En línea</p>
          </div>

          <div className="card">
            <h4>Base</h4>
            <p>Postgres</p>
          </div>
        </section>

        <section id="users-panel" className="panel">
          <UsersPanel onTotalChange={(n) => {
            const el = document.getElementById("total-users");
            if (el) el.innerText = String(n);
          }} />
        </section>

        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
