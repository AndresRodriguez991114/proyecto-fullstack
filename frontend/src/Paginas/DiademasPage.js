import React, { useState } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";



const DiademasPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="admin-root">
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="admin-main">
          {/* HEADER con overlay incluido */}
         <Header title="Recepción de Diademas" menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> 
        <p>Registro de Diademas recibidas.</p>
        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
};

export default DiademasPage;
