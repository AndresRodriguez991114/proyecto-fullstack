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

  // 🔥 NUEVO: Modal de detalle
  const [showDetalle, setShowDetalle] = useState(false);
  const [equipoDetalle, setEquipoDetalle] = useState(null);

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

  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);


  useEffect(() => {
    fetchEquipos();
    fetchListas();
  }, []);

  const fetchEquipos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/equipos");
      setEquipos(res.data);
    } catch (err) {
      console.error("Error cargando equipos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListas = async () => {
    try {
      const t = await api.get("/tipos");
      const m = await api.get("/marcas");
      const mo = await api.get("/modelos");
      const u = await api.get("/usuarios"); 
      const d = await api.get("/departamentos"); 

      setTipos(t.data);
      setMarcas(m.data);
      setModelos(mo.data);
      setUsuarios(u.data);
      setDepartamentos(d.data);
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

  // 🚀 NUEVO: Abrir modal de detalle
  const abrirDetalle = (equipo) => {
    setEquipoDetalle(equipo);
    setShowDetalle(true);
  };

  const editarEquipo = (equipo) => {
  alert("Editar equipo ID: " + equipo.id);
};

const eliminarEquipo = async (id) => {
  if (!window.confirm("¿Seguro que deseas eliminar este equipo?")) return;

  try {
    await api.delete(`/equipos/${id}`);
    fetchEquipos();
  } catch (err) {
    console.error("Error eliminando equipo:", err);
    alert("No se pudo eliminar.");
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
          <button
            className="btn-crear"
            onClick={() => { console.log("CLICK: Registrar Equipo"); setShowModal(true); }}
          >
            + Registrar Equipo
          </button>

        </div>

        {/* ========================= */}
        {/* PANEL EQUIPOS ANIMADO     */}
        {/* ========================= */}
        <section className="tabla-contenedor panel-slide">
          <h2>Equipos Registrados</h2>

          {loading ? (
            <p className="cargando">Cargando equipos...</p>
          ) : (
            <table className="tabla-admin">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>S/N</th>
                  <th>Serial</th>
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
                      {/* 👁️ VER DETALLE */}
                      <button
                        className="btn-small btn-view"
                        onClick={() => { console.log("CLICK: Ver detalle", e.id); abrirDetalle(e); }}
                      >
                        <i>
                          <svg width="16" height="16" fill="currentColor">
                            <path d="M8 3.5c-4 0-7 4-7 4s3 4 7 4 7-4 7-4-3-4-7-4zm0 6.5a2.5 2.5 0 1 1 0-5 
                            2.5 2.5 0 0 1 0 5z" />
                          </svg>
                        </i>
                      </button>

                      <button className="btn-small btn-edit" onClick={() => editarEquipo(e)}>
                        <i>
                          <svg width="16" height="16" fill="currentColor">
                            <path d="M12.854.854a.5.5 0 0 0-.708 0L10.5 2.5l2 2L14.146 
                            2.854a.5.5 0 0 0 0-.708l-1.292-1.292zM10 3l-8 
                            8V13h2l8-8-2-2z" />
                          </svg>
                        </i>
                      </button>

                      <button className="btn-small btn-delete" onClick={() => eliminarEquipo(e.id)}>
                        <i>
                          <svg width="16" height="16" fill="currentColor">
                            <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 
                            0 0 1-1 0v-6a.5.5 0 0 1 .5-.5zm5 
                            0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 
                            0v-6a.5.5 0 0 1 .5-.5z" />
                            <path d="M14.5 3a1 1 0 0 1-1 
                            1H13v9a2 2 0 0 1-2 
                            2H5a2 2 0 0 1-2-2V4h-.5a1 1 
                            0 0 1 0-2h3.1a2 2 0 0 1 
                            1.9-1.5h2a2 2 0 0 1 1.9 
                            1.5h3.1a1 1 0 0 1 1 1z" />
                          </svg>
                        </i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ========================= */}
        {/* MODAL CREAR EQUIPO       */}
        {/* ========================= */}
        {showModal && (
          <div className="equipos-overlay" onClick={() => setShowModal(false)}>
            <div className="equipos-modal" onClick={(e) => e.stopPropagation()}>
              
              <h2>Registrar Equipo</h2>

              {/* Serial */}
              <input
                type="text"
                placeholder="Serial"
                value={nuevoEquipo.serial}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, serial: e.target.value })}
              />

              {/* S/N */}
              <input
                type="text"
                placeholder="S/N"
                value={nuevoEquipo.sn}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, sn: e.target.value })}
              />

              {/* Tipo */}
              <select
                value={nuevoEquipo.tipo_id}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tipo_id: e.target.value })}
              >
                <option value="">Seleccione Tipo</option>
                {tipos.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>

              {/* Marca */}
              <select
                value={nuevoEquipo.marca_id}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, marca_id: e.target.value })}
              >
                <option value="">Seleccione Marca</option>
                {marcas.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>

              {/* Modelo */}
              <select
                value={nuevoEquipo.modelo_id}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, modelo_id: e.target.value })}
              >
                <option value="">Seleccione Modelo</option>
                {modelos.map(mo => (
                  <option key={mo.id} value={mo.id}>{mo.nombre}</option>
                ))}
              </select>

              {/* Fecha ingreso */}
              <input
                type="date"
                value={nuevoEquipo.fecha_ingreso || ""}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, fecha_ingreso: e.target.value })}
              />

              {/* Usuario asignado */}
              <select
                value={nuevoEquipo.usuario_asignado}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, usuario_asignado: e.target.value })}
              >
                <option value="">Usuario Asignado</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} — {u.email}
                  </option>
                ))}
              </select>

              {/* Departamento */}
              <select
                value={nuevoEquipo.departamento_id}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, departamento_id: e.target.value })
                }
              >
                <option value="">Seleccione Departamento</option>
                {departamentos.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>

              {/* Estado */}
              <select
                value={nuevoEquipo.estado}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, estado: e.target.value })}
              >
                <option value="activo">Activo</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="retirado">Retirado</option>
              </select>

              {/* Botones */}
              <button className="equipos-btn-save" onClick={crearEquipo}>Guardar</button>
              <button className="equipos-btn-close" onClick={() => setShowModal(false)}>Cancelar</button>

            </div>
          </div>
        )}
        {/* ========================= */}
        {/* MODAL DETALLE EQUIPO     */}
        {/* ========================= */}
        {showDetalle && equipoDetalle && (
          <div className="equipos-overlay" onClick={() => setShowDetalle(false)}>
            <div className="equipos-modal" onClick={(e) => e.stopPropagation()}>
              
              <h2>Detalle del Equipo</h2>

              <div className="detalle-box">

                <p><strong>ID:</strong> {equipoDetalle.id}</p>
                <p><strong>Serial:</strong> {equipoDetalle.serial}</p>
                <p><strong>S/N:</strong> {equipoDetalle.sn}</p>

                <p><strong>Estado:</strong> {equipoDetalle.estado}</p>
                <p><strong>Fecha Ingreso:</strong> 
                  {new Date(equipoDetalle.fecha_ingreso).toLocaleDateString()}
                </p>

                {/* RELACIONES */}
                <p><strong>Tipo:</strong> {equipoDetalle.tipo || "—"}</p>
                <p><strong>Marca:</strong> {equipoDetalle.marca || "—"}</p>
                <p><strong>Modelo:</strong> {equipoDetalle.modelo || "—"}</p>
                <p><strong>Departamento:</strong> {equipoDetalle.departamento || "—"}</p>

                {/* Usuario asignado */}
                <p><strong>Usuario Asignado:</strong> 
                  {equipoDetalle.usuario_nombre 
                    ? `${equipoDetalle.usuario_nombre} (${equipoDetalle.usuario_email})` 
                    : "No asignado"}
                </p>

              </div>

              <button className="equipos-btn-close" onClick={() => setShowDetalle(false)}>
                Cerrar
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
