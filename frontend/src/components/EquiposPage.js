import React, { useState, useEffect } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api";
import "../Styles/EquiposPage.css";


const EquiposPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [showModal, setShowModal] = useState(false);

  // Formulario real
  const [nuevoEquipo, setNuevoEquipo] = useState({
    serial: "",
    sn: "",
    tipo_id: "",
    marca_id: "",
    modelo_id: "",
    estado: "activo",
    usuario_asignado: null,
    departamento_id: null,
  });

  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    fetchEquipos();
    fetchListas();
  }, []);

  const fetchEquipos = async () => {
    setLoading(true); // mostrar cargando
    try {
      const res = await api.get("/equipos");
      setEquipos(res.data);
    } catch (err) {
      console.error("Error cargando equipos:", err);
    } finally {
      setLoading(false); // ocultar cargando
    }
  };

  const fetchListas = async () => {
    try {
      const t = await api.get("/tipos");
      const m = await api.get("/marcas");
      const mo = await api.get("/modelos");

      setTipos(t.data);
      setMarcas(m.data);
      setModelos(mo.data);
    } catch (err) {
      console.error("Error listas:", err);
    }
  };

  const crearEquipo = async () => {
    try {
      await api.post("/equipos", nuevoEquipo);

      setShowModal(false);

      setNuevoEquipo({
        serial: "",
        sn: "",
        tipo_id: "",
        marca_id: "",
        modelo_id: "",
        estado: "activo",
        usuario_asignado: null,
        departamento_id: null,
      });

      fetchEquipos();
    } catch (err) {
      console.error("Error creando equipo:", err);
      alert("Error creando equipo: " + err.response?.data?.message);
    }
  };

  return (
    <div className="admin-root">

      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="admin-main">

        <Header title="Equipos" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <section className="inicio-stats">
          <div className="stat-card">
            <h2>{equipos.length}</h2>
            <p>Total Equipos</p>
          </div>
        </section>

        <div className="btn-wrap">
          <button className="btn-crear" onClick={() => setShowModal(true)}>
            + Registrar Equipo
          </button>
        </div>

        {/* ========================= */}
        {/* PANEL EQUIPOS ANIMADO     */}
        {/* ========================= */}
        <section className="tabla-contenedor panel-slide">
          <h2>Equipos Registrados</h2>

          {/* LOADING */}
          {loading ? (
            <p className="cargando">Cargando equipos...</p>
          ) : (
            <table className="tabla-admin">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Serial</th>
                  <th>S/N</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {equipos.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.serial}</td>
                    <td>{e.sn}</td>
                    <td>{e.tipo}</td>
                    <td>{e.marca}</td>
                    <td>{e.modelo}</td>
                    <td>{e.estado}</td>
                    <td>
                      <button className="btn-small btn-edit">
                        <i><svg width="16" height="16" fill="currentColor"><path d="M12.854.854a.5.5 0 0 0-.708 0L10.5 2.5l2 2L14.146 2.854a.5.5 0 0 0 0-.708l-1.292-1.292zM10 3l-8 8V13h2l8-8-2-2z"/></svg></i>
                      </button>

                      <button className="btn-small btn-delete">
                        <i><svg width="16" height="16" fill="currentColor"><path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3.1a2 2 0 0 1 1.9-1.5h2a2 2 0 0 1 1.9 1.5h3.1a1 1 0 0 1 1 1z"/></svg></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ========================= */}
        {/* MODAL MEJORADO           */}
        {/* ========================= */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal modal-anim" onClick={(e) => e.stopPropagation()}>

              <h2>Registrar Equipo</h2>

              <input
                type="text"
                placeholder="Serial del equipo"
                value={nuevoEquipo.serial}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, serial: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="S/N"
                value={nuevoEquipo.sn}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, sn: e.target.value })
                }
              />

              {/* SELECTS */}
              <select
                value={nuevoEquipo.tipo_id}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, tipo_id: e.target.value })
                }
              >
                <option value="">Seleccione tipo</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>

              <select
                value={nuevoEquipo.marca_id}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, marca_id: e.target.value })
                }
              >
                <option value="">Seleccione marca</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>

              <select
                value={nuevoEquipo.modelo_id}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, modelo_id: e.target.value })
                }
              >
                <option value="">Seleccione modelo</option>
                {modelos.map((mo) => (
                  <option key={mo.id} value={mo.id}>{mo.nombre}</option>
                ))}
              </select>

              <select
                value={nuevoEquipo.estado}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, estado: e.target.value })
                }
              >
                <option value="activo">Activo</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="retirado">Retirado</option>
              </select>

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
