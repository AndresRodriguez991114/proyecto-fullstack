import React, { useState, useEffect } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api";
import "../Styles/EquiposPage.css";

const EquiposPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const [formError, setFormError] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [equipoDetalle, setEquipoDetalle] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipoToDelete, setEquipoToDelete] = useState(null);


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
    proveedor: "",
    observaciones: "",
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

  const guardarEquipo = async () => {
    setFormError("");

    // 🛑 Validación visual / lógica antes de enviar
    if (!validarFormulario()) return;

    try {
      // ✏️ EDITAR
      if (modoEdicion && equipoEditando) {
        await api.put(`/equipos/${equipoEditando.id}`, nuevoEquipo);
      } 
      // ➕ CREAR
      else {
        await api.post("/equipos", nuevoEquipo);
      }

      // ✅ Cerrar modal y limpiar estados
      setShowModal(false);
      setModoEdicion(false);
      setEquipoEditando(null);

      // 🧼 Reset del formulario
      setNuevoEquipo({
        serial: "",
        sn: "",
        tipo_id: "",
        marca_id: "",
        modelo_id: "",
        estado: "activo",
        usuario_asignado: null,
        departamento_id: null,
        proveedor: "",
        observaciones: ""
      });

      // 🔄 Refrescar listado
      fetchEquipos();

    } catch (err) {
      console.error("❌ Error guardando equipo:", err);

      // 📩 Mostrar mensaje real del backend
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Error inesperado al guardar el equipo";

      setFormError(msg);
    }
  };

  // 🚀 NUEVO: Abrir modal de detalle
  const abrirDetalle = (equipo) => {
    setEquipoDetalle(equipo);
    setShowDetalle(true);
  };

 const editarEquipo = (equipo) => {
  setModoEdicion(true);
  setEquipoEditando(equipo);

  setNuevoEquipo({
    serial: equipo.serial ?? "",
    sn: equipo.sn ?? "",
    tipo_id: equipo.tipo_id ?? "",
    marca_id: equipo.marca_id ?? "",
    modelo_id: equipo.modelo_id ?? "",
    estado: equipo.estado ?? "activo",
    fecha_ingreso: equipo.fecha_ingreso
      ? equipo.fecha_ingreso.slice(0, 10)
      : "",
    usuario_asignado: equipo.usuario_id ?? null,
    departamento_id: equipo.departamento_id ?? null,
    proveedor: equipo.proveedor ?? "",
    observaciones: equipo.observaciones ?? ""
  });

  setFormError("");
  setShowModal(true);
};

const confirmarEliminarEquipo = (equipo) => {
  setEquipoToDelete(equipo);
  setShowDeleteModal(true);
};

const eliminarEquipo = async () => {
  if (!equipoToDelete) return;

  try {
    await api.delete(`/equipos/${equipoToDelete.id}`);

    setShowDeleteModal(false);
    setEquipoToDelete(null);

    fetchEquipos(); // refresca la tabla
  } catch (err) {
    console.error("Error eliminando equipo:", err);
    alert(
      err.response?.data?.error ||
      "No se pudo eliminar el equipo"
    );
  }
};

const validarFormulario = () => {
  if (!nuevoEquipo.serial.trim()) {
    setFormError("El serial es obligatorio");
    return false;
  }

  if (!nuevoEquipo.sn.trim()) {
    setFormError("El S/N es obligatorio");
    return false;
  }

  if (!nuevoEquipo.estado) {
    setFormError("Debe seleccionar un estado");
    return false;
  }

  return true;
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

                      <button className="btn-small btn-delete" onClick={() => confirmarEliminarEquipo(e.id)}>
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

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Serial"
                  value={nuevoEquipo.serial}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, serial: e.target.value })}
                />

                <input
                  type="text"
                  placeholder="S/N"
                  value={nuevoEquipo.sn}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, sn: e.target.value })}
                />
              </div>

              <div className="form-row">
                <select
                  value={nuevoEquipo.tipo_id}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tipo_id: e.target.value })}
                >
                  <option value="">Seleccione Tipo</option>
                  {tipos.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>

                <select
                  value={nuevoEquipo.marca_id}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, marca_id: e.target.value })}
                >
                  <option value="">Seleccione Marca</option>
                  {marcas.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <select
                  value={nuevoEquipo.modelo_id}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, modelo_id: e.target.value })}
                >
                  <option value="">Seleccione Modelo</option>
                  {modelos.map(mo => (
                    <option key={mo.id} value={mo.id}>{mo.nombre}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Proveedor (donde se compró)"
                  value={nuevoEquipo.proveedor || ""}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, proveedor: e.target.value })}
                />
              </div>

              <div className="form-row">
                <input
                  type="date"
                  value={nuevoEquipo.fecha_ingreso || ""}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, fecha_ingreso: e.target.value })}
                />

                <select
                  value={nuevoEquipo.estado}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, estado: e.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="retirado">Retirado</option>
                </select>
              </div>

              <div className="form-row">
                <select
                  value={nuevoEquipo.usuario_asignado || ""}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, usuario_asignado: e.target.value })}
                >
                  <option value="">Usuario Asignado</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} — {u.email}
                    </option>
                  ))}
                </select>

                <select
                  value={nuevoEquipo.departamento_id || ""}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, departamento_id: e.target.value })}
                >
                  <option value="">Seleccione Departamento</option>
                  {departamentos.map(d => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-row full">
                <textarea
                  placeholder="Observaciones del equipo"
                  value={nuevoEquipo.observaciones || ""}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, observaciones: e.target.value })}
                />
              </div>

                {formError && (
                  <div className="form-error-box">
                    {formError}
                  </div>
                )}

              {/* Botones */}
              <button className="equipos-btn-save" onClick={guardarEquipo}>Guardar</button>
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
                <p>
                  <strong>Proveedor:</strong>{" "}
                  {equipoDetalle.proveedor || "—"}
                </p>
                <p>
                  <strong>Observaciones:</strong><br />
                  {equipoDetalle.observaciones || "Sin observaciones"}
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

        {showDeleteModal && (
          <div className="modal-overlay show">
            <div className="modal-box" style={{ padding: "28px" }}>

              {/* ICONO */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <svg width="85" height="85" viewBox="0 0 16 16" fill="#ff4a4a">
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
              </div>

              <h2 style={{ textAlign: "center", fontSize: "22px" }}>
                Eliminar equipo
              </h2>

              <p style={{ textAlign: "center", marginTop: "10px" }}>
                ¿Estás seguro que deseas eliminar el equipo?
                <br />
                <b>{equipoToDelete?.serial} / {equipoToDelete?.sn}</b>
                <br /><br />
                <span style={{ opacity: 0.8 }}>
                  Esta acción no se puede deshacer.
                </span>
              </p>

              <div style={{ display: "flex", gap: "12px", marginTop: "26px" }}>
                <button
                  className="modal-save"
                  onClick={eliminarEquipo}
                  style={{ background: "#ff4a4a", fontWeight: "600" }}
                >
                  Eliminar
                </button>

                <button
                  className="modal-save"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    background: "var(--input-bg)",
                    color: "var(--text)",
                    border: "1px solid var(--input-border)",
                    fontWeight: "600"
                  }}
                >
                  Cancelar
                </button>
              </div>

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
