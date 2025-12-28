import React, { useState, useEffect } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api";
import "../Styles/ReparacionPage.css";


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
          <div className="card">
            <h3>Equipos en reparación / mantenimiento</h3>

            <table className="tabla-equipos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Serial</th>
                  <th>S/N</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Estado</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
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
              Guardar reparación
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
