import React, { useState } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";



const EquiposPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  return (
    <div className="admin-root">
      
      {/* SIDEBAR */}
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* CONTENIDO */}
      <main className="admin-main">
        <Header title="Equipos" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <p>Aquí puedes gestionar equipos.</p>
        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>
      </main>

    </div>
  );
};

export default EquiposPage;
