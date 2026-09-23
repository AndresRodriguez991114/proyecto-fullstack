import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import "../Styles/InicioPage.css";
import api from "../api"; 

const InicioPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

    // Estados reales de estadísticas
    const [stats, setStats] = useState({
        equipos: "-",
        reparaciones: "-",
        Envios: "-",
        Diademas: 0
        
    });

  // Obtener datos desde el backend
useEffect(() => {
  const fetchStats = async () => {
    try {
      const [resEquipos, resEstados, resEnvios] = await Promise.all([
        api.get("/equipos"),
        api.get("/equipos/resumen-estados"),
        api.get("/equipos/listos-envio")
      ]);

      const equiposTotal = Array.isArray(resEquipos.data) ? resEquipos.data.length : 0;

      let totalReparaciones = 0;
      if (Array.isArray(resEstados.data)) {
        resEstados.data.forEach((e) => {
          totalReparaciones += Number(e.total) || 0;
        });
      }

      const enviosTotal = Array.isArray(resEnvios.data) ? resEnvios.data.length : 0;

      setStats({
        equipos: equiposTotal,
        reparaciones: totalReparaciones,
        Envios: enviosTotal,
        Diademas: 0
      });
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
            <h2>{stats.Envios}</h2>
            <p>Envios</p>
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
            <div className="atajo-card" onClick={() => navigate("/equipos")}>
              <span>🖥️</span>
              <p>Equipos</p>
            </div>

            <div className="atajo-card" onClick={() => navigate("/reparacion")}>
              <span>🛠️</span>
              <p>Reparaciones</p>
            </div>

            <div className="atajo-card" onClick={() => navigate("/diademas")}>
              <span>🎧</span>
              <p>Diademas</p>
            </div>

            <div className="atajo-card" onClick={() => navigate("/envios")}>
              <span>🚚</span>
              <p>Envíos</p>
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
