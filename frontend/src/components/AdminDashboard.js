import React, { useState, useEffect } from "react";
import UsersPanel from "./UsersPanel";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo2.png";

// Aplicar tema ANTES de renderizar
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const [theme, setTheme] = useState(savedTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);

  // -----------------------------
  // 🔥 TOGGLE MODO OSCURO / CLARO
  // -----------------------------

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

  // -----------------------------
  // 📱 CONTROL DEL MENÚ MÓVIL
  // -----------------------------

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={`admin-root ${theme}`}>

      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <img src={Logo} alt="Logo" />
          <h3>Cloud + Inventory</h3>
        </div>

        <nav className="admin-nav">
          <button onClick={() => {
          window.scrollTo(0, 0);
          setMenuOpen(false);
        }}>Dashboard</button>

          <button onClick={() => {
          document.getElementById("users-panel")?.scrollIntoView({ behavior: "smooth" });
          setMenuOpen(false);
        }}>Usuarios</button>

          <button onClick={() => {
          navigate("/admin/reports");
          setMenuOpen(false);
        }}>Reportes</button>
        
        </nav>

        <div className="sidebar-footer">
          <small>{user?.nombre || user?.email}</small>
          <button className="btn-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* 🔥 Overlay para cerrar menú al tocar afuera */}
      <div
        className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main className="admin-main">

        {/* Header */}
        <header className="admin-header">
          <span className="hamburger" onClick={toggleMenu}>☰</span>
          <h1>Panel de Administrador</h1>

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
        </section>

        {/* 🔥 BOTÓN + PANEL */}
        <section id="users-panel" className="panel">

          {/* BOTÓN PARA ABRIR MODAL */}
          <button
            className="btn-agregar-usuario"
            style={{ marginBottom: "20px" }}
            onClick={() => setOpenUserModal(true)}
          >
            + Crear Usuario
          </button>

          <UsersPanel
            onTotalChange={(n) => {
              const el = document.getElementById("total-users");
              if (el) el.innerText = String(n);
            }}
            openUserModal={openUserModal}
            setOpenUserModal={setOpenUserModal}
          />
        </section>

        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
