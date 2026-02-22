import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import Logo from "../images/Logo2.png";

// ICONOS
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

  return (
    <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
      
      {/* LOGO */}
      <Link
        to={user?.rol === "administrador" ? "/Inicio" : "/Dashboard"}
        className="brand"
        onClick={() => setMenuOpen(false)}
      >
        <img src={Logo} alt="Logo" />
        <h3>Cloud + Inventory</h3>
      </Link>

      {/* MENÚ */}
      <nav className="admin-nav">

        <NavLink
          to={user?.rol === "administrador" ? "/Inicio" : "/Dashboard"}
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
        >
          <Home size={18} />
          <span>Inicio</span>
        </NavLink>

        <NavLink
          to="/equipos"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
        >
          <Laptop size={18} />
          <span>Equipos</span>
        </NavLink>

        {user?.rol === "administrador" && (
          <>
            <NavLink
              to="/reportes"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <BarChart2 size={18} />
              <span>Reportes</span>
            </NavLink>

            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <Users size={18} />
              <span>Usuarios</span>
            </NavLink>
          </>
        )}

        <NavLink
          to="/diademas"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
        >
          <Headphones size={18} />
          <span>Diademas</span>
        </NavLink>

        <NavLink
          to="/reparacion"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
        >
          <Wrench size={18} />
          <span>Reparación / Mantenimiento</span>
        </NavLink>

        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
        >
          <UserCircle size={18} />
          <span>Clientes</span>
        </NavLink>

        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
        >
          <Settings size={18} />
          <span>Configuración</span>
        </NavLink>

      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <small>{user?.nombre || user?.email || "Usuario"}</small>

        <button
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;