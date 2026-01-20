import React, { useState } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import "../Styles/ReportesPage.css";


const ReportesPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const descargarReporte = async (url) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Error descargando reporte");
    }

    // 🔎 Modo prueba (JSON)
    const data = await response.json();
    console.log("📊 Reporte:", data);

    alert("Reporte generado correctamente (mira la consola 😄)");

  } catch (error) {
    console.error(error);
    alert("Error al generar el reporte");
  }
};

  return (
    <div className="admin-root">
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="admin-main">
          {/* HEADER con overlay incluido */}
         <Header title="Reportes" menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> 
        <section className="reportes-section">
          
        <h2>📊 Reportes del sistema</h2>

        {/* REPORTE GENERAL */}
        <div className="reporte-card">
          <h3>📄 Reporte General</h3>

          <div className="reporte-actions">
            <button
              className="btn-reporte btn-excel"
              onClick={() =>
                descargarReporte(
                  "https://proyecto-fullstack-nfai.onrender.com/api/reportes/general?formato=excel"
                )
              }
            >
              Excel
            </button>

            <button
              className="btn-reporte btn-pdf"
              onClick={() =>
                descargarReporte(
                  "https://proyecto-fullstack-nfai.onrender.com/api/reportes/general?formato=pdf"
                )
              }
            >
              PDF
            </button>
          </div>
        </div>

        {/* MANTENIMIENTOS */}
        <div className="reporte-card">
          <h3>🔧 Mantenimientos</h3>

          <div className="reporte-actions">
            <button
              className="btn-reporte btn-excel"
              onClick={() =>
                descargarReporte(
                  "https://proyecto-fullstack-nfai.onrender.com/api/reportes/mantenimientos?formato=excel"
                )
              }
            >
              Excel
            </button>

            <button
              className="btn-reporte btn-pdf"
              onClick={() =>
                descargarReporte(
                  "https://proyecto-fullstack-nfai.onrender.com/api/reportes/mantenimientos?formato=pdf"
                )
              }
            >
              PDF
            </button>
          </div>
        </div>

        {/* REPARACIONES */}
        <div className="reporte-card">
          <h3>🛠 Reparaciones</h3>

          <div className="reporte-actions">
            <button
              className="btn-reporte btn-excel"
              onClick={() =>
                descargarReporte(
                  "https://proyecto-fullstack-nfai.onrender.com/api/reportes/reparaciones?formato=excel"
                )
              }
            >
              Excel
            </button>

            <button
              className="btn-reporte btn-pdf"
              onClick={() =>
                descargarReporte(
                  "https://proyecto-fullstack-nfai.onrender.com/api/reportes/reparaciones?formato=pdf"
                )
              }
            >
              PDF
            </button>
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


export default ReportesPage;
