// src/módulos/Sidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo2.png";

// ICONOS BONITOS 😎
import {
  Home,
  Laptop,
  BarChart2,
  Users,
  Headphones,
  Wrench,
  UserCircle,
  Settings,
  LogOut
} from "lucide-react";

const Sidebar = ({ user, menuOpen, setMenuOpen }) => {
  const navigate = useNavigate();

  const go = (ruta) => {
    navigate(ruta);
    setMenuOpen(false);
  };

  return (
    <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
      {/* LOGO */}
      <div className="brand">
        <img src={Logo} alt="Logo" />
        <h3>Cloud + Inventory</h3>
      </div>

      {/* MENÚ */}
      <nav className="admin-nav">

        <button onClick={() => go("/inicio")}>
          <Home size={18} /> <span>Inicio</span>
        </button>

        <button onClick={() => go("/equipos")}>
          <Laptop size={18} /> <span>Equipos</span>
        </button>

        <button onClick={() => go("/reportes")}>
          <BarChart2 size={18} /> <span>Reportes</span>
        </button>

        <button onClick={() => go("/usuarios")}>
          <Users size={18} /> <span>Usuarios</span>
        </button>

        <button onClick={() => go("/diademas")}>
          <Headphones size={18} /> <span>Diademas</span>
        </button>

        <button onClick={() => go("/reparacion")}>
          <Wrench size={18} /> <span>Reparación / Mantenimiento</span>
        </button>

        <button onClick={() => go("/clientes")}>
          <UserCircle size={18} /> <span>Clientes</span>
        </button>

        <button onClick={() => go("/configuracion")}>
          <Settings size={18} /> <span>Configuración</span>
        </button>
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <small>{user?.nombre || user?.email || "Usuario"}</small>

        <button className="btn-logout" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
