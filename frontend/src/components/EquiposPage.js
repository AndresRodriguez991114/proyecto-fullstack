import React, { useState, useEffect } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api"; // si ya lo usas para usuarios

const EquiposPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const [equipos, setEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Estado para formulario de nuevo equipo
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    descripcion: "",
    serie: "",
  });

  // Obtener equipos reales del backend
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await api.get("/equipos"); // <-- AJUSTA SEGÚN TU API REAL
        setEquipos(res.data);
      } catch (err) {
        console.error("Error cargando equipos:", err);
      }
    };

    fetchEquipos();
  }, []);

  const crearEquipo = async () => {
    try {
      await api.post("/equipos", nuevoEquipo); // <-- AJUSTA A TU API REAL
      setShowModal(false);
      setNuevoEquipo({ nombre: "", descripcion: "", serie: "" });
      
      // refrescar lista
      const res = await api.get("/equipos");
      setEquipos(res.data);

    } catch (err) {
      console.error("Error creando equipo:", err);
    }
  };

  return (
    <div className="admin-root">

      {/* SIDEBAR */}
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* CONTENIDO */}
      <main className="admin-main">

        <Header title="Equipos" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* TARJETA DE TOTAL */}
        <section className="inicio-stats">
          <div className="stat-card">
            <h2>{equipos.length}</h2>
            <p>Total Equipos</p>
          </div>
        </section>

        {/* BOTÓN NUEVO EQUIPO */}
        <div className="btn-wrap">
          <button className="btn-crear" onClick={() => setShowModal(true)}>
            + Registrar Equipo
          </button>
        </div>

    
        {/* TABLA */}
        <section className="tabla-contenedor">
          <h2>Equipos Registrados</h2>

          <table className="tabla-admin">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Serie</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {equipos.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.nombre}</td>
                  <td>{e.serie}</td>
                  <td>{e.descripcion}</td>
                  <td>
                    <button className="btn-small">Editar</button>
                    <button className="btn-small btn-danger">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Registrar Equipo</h2>

              <input
                type="text"
                placeholder="Nombre del equipo"
                value={nuevoEquipo.nombre}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Número de serie"
                value={nuevoEquipo.serie}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, serie: e.target.value })
                }
              />

              <textarea
                placeholder="Descripción"
                value={nuevoEquipo.descripcion}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, descripcion: e.target.value })
                }
              />

              <button className="btn-crear" onClick={crearEquipo}>
                Guardar
              </button>

              <button className="btn-cerrar" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>

      </main>
    </div>
  );
};

export default EquiposPage;
