import React, { useState, useEffect } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import "../Styles/InicioPage.css";
import api from "../api"; 

const InicioPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

    // Estados reales de estadísticas
    const [stats, setStats] = useState({
        equipos: "-",
        reparaciones: "-",
        Diademas: 0
    });

  // Obtener datos desde el backend
useEffect(() => {
  const fetchStats = async () => {
    try {
              // 🔹 Obtener equipos existentes
      const resEquipos = await api.get("/equipos"); // O "/api/equipos" según tu configuración
      const equiposTotal = Array.isArray(resEquipos.data) ? resEquipos.data.length : 0;

      setStats(prev => ({
        ...prev,
        equipos: equiposTotal
      }));
      
      // 🔹 Obtener reparaciones y mantenimientos activos
      const resEstados = await api.get("/equipos/resumen-estados");
      let totalReparaciones = 0;
      if (Array.isArray(resEstados.data)) {
        resEstados.data.forEach(e => {
          totalReparaciones += e.total;
        });
      }

      setStats(prev => ({
        ...prev,
        reparaciones: totalReparaciones
      })); 

    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    }
  };

  fetchStats();
}, []);


  return (
    <div className="admin-root">
      
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="admin-main">
        <Header title="Inicio" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* HERO */}
        <section className="inicio-hero">
          <h1>¡Hola {user?.nombre || "Usuario"}! 👋</h1>
          <p>Bienvenido al  panel de Cloud + Inventory.</p>
        </section>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <section className="inicio-stats">
          <div className="stat-card">
            <h2>{stats.equipos}</h2>
            <p>Equipos registrados</p>
          </div>

          <div className="stat-card">
            <h2>{stats.reparaciones}</h2>
            <p>Reparaciones activas</p>
          </div>

          <div className="stat-card">
            <h2>{stats.Diademas}</h2>
            <p>Diademas</p>
          </div>
        </section>

        {/* ACCESOS RÁPIDOS */}
        <section className="inicio-atajos">
          <h2>Accesos rápidos</h2>

          <div className="atajos-grid">
            <div className="atajo-card" onClick={() => window.location.href = "/equipos"}>
              <span>🖥️</span>
              <p>Equipos</p>
            </div>

            <div className="atajo-card" onClick={() => window.location.href = "/reparacion"}>
              <span>🛠️</span>
              <p>Reparaciones</p>
            </div>

            <div className="atajo-card" onClick={() => window.location.href = "/Diademas"}>
              <span>🎧</span>
              <p>Diademas</p>
            </div>
          </div>
        </section>

        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>

      </main>
    </div>
  );
};

export default InicioPage;
