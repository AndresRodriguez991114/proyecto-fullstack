import React, { useState } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api";




const ReparacionPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [busqueda, setBusqueda] = useState("");
  const [equipo, setEquipo] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const buscarEquipo = async () => {
    setBuscando(true);
    setMensaje("");
    setEquipo(null);

    try {
      const res = await api.get(`/equipos/buscar/${busqueda}`);
      setEquipo(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setMensaje("No se encontró el equipo");
      } else {
        setMensaje("Error al buscar el equipo");
      }
    } finally {
      setBuscando(false);
    }
  };


  
  return (
    <div className="admin-root">
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="admin-main">
          {/* HEADER con overlay incluido */}
         <Header title="Reparación / Mantenimiento" menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> 
        <section className="tabla-contenedor">
          <h2>Buscar equipo</h2>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <input
              type="text"
              placeholder="Serial o S/N del equipo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ flex: 1 }}
            />

            <button
              className="btn-crear"
              disabled={!busqueda || buscando}
              onClick={buscarEquipo}
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {mensaje && (
            <p style={{ marginTop: "12px", opacity: 0.8 }}>{mensaje}</p>
          )}

          {equipo && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                border: "1px solid var(--card-border)",
                borderRadius: "10px",
                background: "var(--card-bg)"
              }}
            >
              <p><strong>Serial:</strong> {equipo.serial}</p>
              <p><strong>Marca:</strong> {equipo.marca || "—"}</p>
              <p><strong>Modelo:</strong> {equipo.modelo || "—"}</p>
            </div>
          )}
        </section>
        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
};

export default ReparacionPage;
