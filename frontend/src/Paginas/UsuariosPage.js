import React, { useState, useEffect } from "react";
import UsersPanel from "./UsersPanel";
import "./styles.css";
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

  // 🔥 TOAST STATE
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });

  // -----------------------------
  // 🔥 FUNCIONES TOAST
  // -----------------------------

  const showSuccess = (message) => {
    setToast({ show: false, type: "", message: "" });

    setTimeout(() => {
      setToast({
        show: true,
        type: "success",
        message
      });
    }, 150);

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  const showError = (message) => {
    setToast({ show: false, type: "", message: "" });

    setTimeout(() => {
      setToast({
        show: true,
        type: "error",
        message
      });
    }, 150);

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

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

      {/* 🔥 TOAST UI */}
    {toast.show && (
      <div className={`toast-card ${toast.type}`}>
        
        <div className="toast-content">
          <strong>
            {toast.type === "success" ? "Success" : "Error"}
          </strong>
          <p>{toast.message}</p>
        </div>

        <button
          className="toast-close"
          onClick={() => setToast({ show: false, type: "", message: "" })}
        >
          ✖
        </button>

      </div>
    )}

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
            showSuccess={showSuccess}
            showError={showError}
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