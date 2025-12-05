import React, { useState, useEffect } from "react";
import UsersPanel from "./UsersPanel";
import "./AdminDashboard.css";
import Sidebar from "../módulos/Sidebar"
import ThemeToggle from "../módulos/ThemeToggle";

// Aplicar tema ANTES de renderizar
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

const UsuariosPage = () => {
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


  // -----------------------------
  // 📱 CONTROL DEL MENÚ MÓVIL
  // -----------------------------

  const toggleMenu = () => setMenuOpen(prev => !prev);


  return (
    <div className={`admin-root ${theme}`}>

       {/*===== SIDEBAR =====*/}
         <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
         
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
          <h1>Usuarios</h1>
          <ThemeToggle />
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

export default UsuariosPage;
