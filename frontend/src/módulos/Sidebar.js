import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import Logo from "../images/Logo2.webp";

// ICONOS
import {
  Home,
  Laptop,
  BarChart2,
  Users,
  Headphones,
  Wrench,
  Truck,
  Settings,
  LogOut
} from "lucide-react";

const Sidebar = ({ user, menuOpen, setMenuOpen }) => {
  const navigate = useNavigate();
  const isAdmin = user?.rol === "administrador" || user?.rol === "admin";

  return (
    <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
      <Link
        to={isAdmin ? "/inicio" : "/dashboard"}
        className="brand"
        onClick={() => setMenuOpen(false)}
      >
        <img src={Logo} alt="Logo" />
        <h3>Cloud + Inventory</h3>
      </Link>

      <nav className="admin-nav">
        <NavLink
          to={isAdmin ? "/inicio" : "/dashboard"}
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
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

        {isAdmin && (
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
          to="/envios"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
        >
          <Truck size={18} />
          <span>Envíos</span>
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

      <div className="sidebar-footer">
        <small>{user?.nombre || user?.email || "Usuario"}</small>

        <button
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem("token");
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