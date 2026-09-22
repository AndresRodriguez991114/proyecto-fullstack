import React, { useState } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import "../Styles/ReportesPage.css";
import api from "../api";


const ReportesPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const urlReporte = (reporte, formato) =>
    `${api.defaults.baseURL}/reportes/${reporte}?formato=${formato}`;

  const descargarReporte = async (url, nombreArchivo) => {
    try {
      setDescargando(true);
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorTexto = await response.text();
        throw new Error(errorTexto || "Error descargando reporte");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(objectUrl);
      alert("Reporte descargado correctamente");
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Error al generar el reporte");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="admin-root">
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="admin-main">
        <Header title="Reportes" menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> 
        <section className="reportes-section">
          
          <h2>📊 Reportes del sistema</h2>

          {/* REPORTE GENERAL */}
          <div className="reporte-card">
            <h3>📄 Reporte General</h3>
            <p className="reporte-descripcion">Estado de todos los equipos en el sistema</p>

            <div className="reporte-actions">
              <button
                className="btn-reporte btn-excel"
                onClick={() =>
                  descargarReporte(
                    urlReporte("general", "excel"),
                    `Reporte_General_${new Date().toISOString().split('T')[0]}.xlsx`
                  )
                }
                disabled={descargando}
              >
                {descargando ? "⏳ Descargando..." : "📊 Excel"}
              </button>

              <button
                className="btn-reporte btn-pdf"
                onClick={() =>
                  descargarReporte(
                    urlReporte("general", "pdf"),
                    `Reporte_General_${new Date().toISOString().split('T')[0]}.pdf`
                  )
                }
                disabled={descargando}
              >
                {descargando ? "⏳ Descargando..." : "📄 PDF"}
              </button>
            </div>
          </div>

          {/* MANTENIMIENTOS */}
          <div className="reporte-card">
            <h3>🔧 Mantenimientos</h3>
            <p className="reporte-descripcion">Histórico de mantenimientos realizados</p>

            <div className="reporte-actions">
              <button
                className="btn-reporte btn-excel"
                onClick={() =>
                  descargarReporte(
                    urlReporte("mantenimientos", "excel"),
                    `Reporte_Mantenimientos_${new Date().toISOString().split('T')[0]}.xlsx`
                  )
                }
                disabled={descargando}
              >
                {descargando ? "⏳ Descargando..." : "📊 Excel"}
              </button>

              <button
                className="btn-reporte btn-pdf"
                onClick={() =>
                  descargarReporte(
                    urlReporte("mantenimientos", "pdf"),
                    `Reporte_Mantenimientos_${new Date().toISOString().split('T')[0]}.pdf`
                  )
                }
                disabled={descargando}
              >
                {descargando ? "⏳ Descargando..." : "📄 PDF"}
              </button>
            </div>
          </div>

          {/* REPARACIONES */}
          <div className="reporte-card">
            <h3>🛠️ Reparaciones</h3>
            <p className="reporte-descripcion">Histórico de reparaciones realizadas</p>

            <div className="reporte-actions">
              <button
                className="btn-reporte btn-excel"
                onClick={() =>
                  descargarReporte(
                    urlReporte("reparaciones", "excel"),
                    `Reporte_Reparaciones_${new Date().toISOString().split('T')[0]}.xlsx`
                  )
                }
                disabled={descargando}
              >
                {descargando ? "⏳ Descargando..." : "📊 Excel"}
              </button>

              <button
                className="btn-reporte btn-pdf"
                onClick={() =>
                  descargarReporte(
                    urlReporte("reparaciones", "pdf"),
                    `Reporte_Reparaciones_${new Date().toISOString().split('T')[0]}.pdf`
                  )
                }
                disabled={descargando}
              >
                {descargando ? "⏳ Descargando..." : "📄 PDF"}
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
