import React, { useState, useEffect } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api";
import "../Styles/ReparacionPage.css";
import { createPortal } from "react-dom";



const ReparacionPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [busqueda, setBusqueda] = useState("");
  const [equipo, setEquipo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [estados, setEstados] = useState([]);
  const [equiposEnProceso, setEquiposEnProceso] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [equipoHistorial, setEquipoHistorial] = useState([]);
  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);


  const verHistorial = async (equipo) => {
    try {
      const res = await api.get(`/historial/${equipo.id}`);
      setEquipoHistorial(res.data);
      setModalHistorialOpen(true);
    } catch (err) {
      console.error("Error cargando historial:", err);
      setToast({ show: true, type: "error", message: "Error cargando historial" });
    }
  };

  const [form, setForm] = useState({
    tipo: "Reparación",
    tecnico: "",
    diagnostico: "",
    acciones: "",
    fecha: new Date().toISOString().slice(0, 10),
    estadoFinalId: "",
  });

  const [toast, setToast] = useState({
    show: false,
    type: "success", // success | error
    message: ""
  });


  const buscarEquipo = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return;

    setBuscando(true);
    setMensaje("");
    setEquipo(null);

    try {
      const res = await api.get(`/equipos/buscar/${busqueda}`);
      setEquipo(res.data);
      setMostrarLista(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setMensaje("❌ Equipo no encontrado. Puedes registrarlo antes de continuar.");
      } else {
        setMensaje("⚠️ Error al buscar el equipo");
      }
    } finally {
      setBuscando(false);
    }
  };

  const [modalCerrarOpen, setModalCerrarOpen] = useState(false);
  const [equipoCerrar, setEquipoCerrar] = useState(null);

  const [cierre, setCierre] = useState({
    acciones: "",
    fecha: new Date().toISOString().slice(0, 10),
  });

  const abrirModalCerrar = (eq) => {
  setEquipoCerrar(eq);      // equipo que voy a cerrar
  setModalCerrarOpen(true); // abrir modal
  };

  const cerrarModal = () => {
    setModalCerrarOpen(false);
    setEquipoCerrar(null);
    setCierre({
      acciones: "",
      fecha: new Date().toISOString().slice(0, 10),
    });
  };

const finalizarReparacion = async () => {
  if (!equipoCerrar) return;

  if (!cierre.acciones.trim()) {
    setToast({
      show: true,
      type: "error",
      message: "Debes ingresar las acciones realizadas",
    });
    return;
  }

  try {
    await api.put(`/equipos/${equipoCerrar.id}/cerrar`, {
      estado_id: 1,
      tipo: cierre.tipo,              
      acciones: cierre.acciones,
      diagnostico: cierre.diagnostico || null,
      comentario: `${cierre.tipo} finalizada`,
      fecha: cierre.fecha,
    });

    setToast({
      show: true,
      type: "success",
      message: "Reparación finalizada correctamente",
    });

    cerrarModal();
    cargarEquiposEnProceso();
  } catch (error) {
    setToast({
      show: true,
      type: "error",
      message: "Error al finalizar la reparación",
    });
  }
};

  const cargarEquiposEnProceso = async () => {
    try {
      const res = await api.get("/equipos/en-proceso");
      setEquiposEnProceso(res.data);
    } catch (err) {
      console.error("Error cargando equipos en reparación/mantenimiento", err);
    }
  };

  useEffect(() => {
    const cargarEstados = async () => {
      try {
        const res = await api.get("/estados");
        setEstados(res.data);
      } catch (err) {
        console.error("Error cargando estados", err);
      }
    };

    cargarEstados();
    cargarEquiposEnProceso();
  }, []);

  const guardarReparacion = async (e) => {
    e.preventDefault();
    if (!equipo) {
      setToast({
        show: true,
        type: "error",
        message: "Primero debes seleccionar un equipo"
      });
      return;
    }

    if (!form.estadoFinalId) {
      setToast({
        show: true,
        type: "error",
        message: "Selecciona el estado final del equipo"
      });
      return;
    }

    try {
    await api.post("/reparaciones", {
      equipoId: equipo.id,
      estadoFinalId: form.estadoFinalId,
      tipo: form.tipo, 
      acciones: form.acciones,
      diagnostico: form.diagnostico
    });

    setToast({ show: false, type: "", message: "" });
    setTimeout(() => {
      setToast({
        show: true,
        type: "success",
        message: "Reparación registrada correctamente"
      });
    }, 150);

    // ocultar solo después de 3 segundos
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);

      // CERRAR FORMULARIO
      setEquipo(null);
      setBusqueda("");

      // volver a mostrar la lista
      setMostrarLista(true);

      // refrescar equipos en reparación/mantenimiento
      cargarEquiposEnProceso();

      // 🔄 RESET FORM
      setForm({
        tipo: "Reparación",
        tecnico: "",
        diagnostico: "",
        acciones: "",
        fecha: new Date().toISOString().slice(0, 10),
        estadoFinalId: ""
      });
    } catch (err) {
      setToast({
        show: true,
        type: "error",
        message: "Error al guardar la reparación"
      });
    }
  };

  return (
    <div className="admin-root">
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="admin-main">
        <Header
          title="Reparación / Mantenimiento"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
          {modalCerrarOpen &&
            createPortal(
              <div className="modal-overlay show" onClick={cerrarModal}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Finalizar reparación</h2>
                    <button className="modal-close" onClick={cerrarModal}>×</button>
                  </div>

                  <div className="modal-form">
                    <textarea
                      className="modal-textarea"
                      placeholder=" Acciones realizadas"
                      value={cierre.acciones}
                      onChange={(e) =>
                        setCierre({ ...cierre, acciones: e.target.value })
                      }
                      required
                    />

                    <input
                      type="date"
                      value={cierre.fecha}
                      onChange={(e) =>
                        setCierre({ ...cierre, fecha: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-buttons">
                    <button className="btn-secondary" onClick={cerrarModal}>
                      Cancelar
                    </button>

                    <button className="modal-save" onClick={finalizarReparacion}>
                      Finalizar
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )
          }

        {toast.show && (
          <div className={`toast-card ${toast.type}`}>
            <div className="toast-content">
              <strong>
                {toast.type === "success" && "Success"}
                {toast.type === "error" && "Error"}
              </strong>
              <p>{toast.message}</p>
            </div>

            <button
              className="toast-close"
              onClick={() => setToast({ show: false, type: "", message: "" })}
            >
              ×
            </button>
          </div>
        )}

        {/* BUSCAR EQUIPO */}
        <form className="card search-card" onSubmit={buscarEquipo}>
          <h3>Buscar equipo</h3>

          <div className="search-row">
            <input
              type="text"
              placeholder="Código, serial o nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button type="submit" disabled={buscando}>
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {mensaje && <div className="alert error">{mensaje}</div>}
        </form>

        {mostrarLista && equiposEnProceso.length > 0 && (
          <section className="tabla-contenedor panel-slide">
            <h3>Equipos en Reparación / Mantenimiento</h3>

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
                {equiposEnProceso.map((eq) => (
                  <tr key={eq.id}>
                    <td>{eq.id}</td>
                    <td>{eq.serial}</td>
                    <td>{eq.sn}</td>
                    <td>{eq.tipo}</td>
                    <td>{eq.marca}</td>
                    <td>{eq.modelo}</td>
                    <td>{eq.estado}</td>
                    <td className="acciones-col">
                      <button
                        type="button"
                        className="botn-small botn-finish"
                        title="Finalizar reparación"
                        onClick={() => abrirModalCerrar(eq)}
                      >
                        <i>
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.7 6.3a5 5 0 00-6.4 6.4L3 18v3h3l5.3-5.3a5 5 0 006.4-6.4l-2.2 2.2-2.2-2.2 2.2-2.2z"/>
                        </svg>
                        </i>
                      </button>

                      <button
                        className="btn-small btn-view"
                        title="Ver historial"
                        onClick={() => verHistorial(eq)}
                      >
                        <i>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1.75a10.25 10.25 0 1010.25 10.25A10.262 10.262 0 0012 1.75zM12 
                        20.25a8.25 8.25 0 118.25-8.25A8.26 8.26 0 0112 20.25z"/>
                        <path d="M12 6.75a.75.75 0 00-.75.75v4.5l3.25 1.95a.75.75 0 10.75-1.3l-2.75-1.65V7.5A.75.75 0 0012 6.75z"/>
                      </svg>
                        </i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </section>
        )}

        {modalHistorialOpen && (
          <div className="equipos-overlay">
            <div className="equipos-modal-historial">
              <h2>Historial del equipo</h2>

              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {equipoHistorial.length === 0 ? (
                  <p>No hay historial disponible.</p>
                ) : (
                  <table className="tabla-admin">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Acción</th>
                        <th>Usuario</th>
                        <th>Diagnóstico</th>
                        <th>Acciones</th>
                        <th>Estado final</th>
                        <th>Comentario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipoHistorial.map((h) => (
                        <tr key={h.id}>
                          <td>{new Date(h.fecha).toLocaleString()}</td>
                          <td>{h.accion}</td>
                          <td>{h.usuario || h.usuario_id}</td>
                          <td>{h.diagnostico}</td>
                          <td>{h.acciones}</td>
                          <td>{h.estado_final}</td>
                          <td>{h.comentario}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <button
                className="historial-btn-close"
                onClick={() => setModalHistorialOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* EQUIPO ENCONTRADO */}
        {equipo && (
          <div className="card equipo-card success">
            <h3>Equipo encontrado</h3>

            <div className="equipo-grid">
              <span><b>Serial:</b> {equipo.serial}</span>
              <span><b>S/N:</b> {equipo.sn}</span>
              <span><b>Marca:</b> {equipo.marca}</span>
              <span><b>Modelo:</b> {equipo.modelo}</span>
              <span><b>Estado:</b> {equipo.estado}</span>
            </div>
          </div>
        )}

        {/* FORMULARIO */}
        {equipo && (
          <form className="card form-card" onSubmit={guardarReparacion}>
            <h3>Registrar reparación / mantenimiento</h3>

            <div className="form-grid">
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                <option>Reparación</option>
                <option>Mantenimiento</option>
              </select>

              <input
                placeholder="Técnico responsable"
                value={form.tecnico}
                onChange={(e) => setForm({ ...form, tecnico: e.target.value })}
              />

              <textarea
                placeholder="Diagnóstico"
                value={form.diagnostico}
                onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
              />

              <textarea
                placeholder="Acciones realizadas"
                value={form.acciones}
                onChange={(e) => setForm({ ...form, acciones: e.target.value })}
              />

              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />

              <select
              value={form.estadoFinalId}
              onChange={(e) =>
                setForm({ ...form, estadoFinalId: e.target.value })
              }
              required
            >
              <option value="">Estado final</option>

              {estados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
            </div>

            <button className="btn-primary" type="submit">
              Guardar
            </button>
          </form>
        )}

        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
};

export default ReparacionPage;
