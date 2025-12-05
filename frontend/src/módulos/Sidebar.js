import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo2.png";

const Sidebar = ({ user, menuOpen, setMenuOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>

      <div className="brand">
        <img src={Logo} alt="Logo" />
        <h3>Cloud + Inventory</h3>
      </div>

      <nav className="admin-nav">
        <button onClick={() => { navigate("/inicio"); setMenuOpen(false); }}>
          Inicio
        </button>

        <button onClick={() => { navigate("/equipos"); setMenuOpen(false); }}>
          Equipos
        </button>

        <button onClick={() => { navigate("/reportes"); setMenuOpen(false); }}>
          Reportes
        </button>

        <button onClick={() => { navigate("/usuarios"); setMenuOpen(false); }}>
          Usuarios
        </button>

        <button onClick={() => { navigate("/recepcion"); setMenuOpen(false); }}>
          Recepción
        </button>

        <button onClick={() => { navigate("/reparacion"); setMenuOpen(false); }}>
          Reparación / Mantenimiento
        </button>

        <button onClick={() => { navigate("/clientes"); setMenuOpen(false); }}>
          Clientes
        </button>

        <button onClick={() => { navigate("/configuracion"); setMenuOpen(false); }}>
          Configuración
        </button>
      </nav>

      <div className="sidebar-footer">
        <small>{user?.nombre || user?.email}</small>
        <button className="btn-logout" onClick={handleLogout}>
          Sign out
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
