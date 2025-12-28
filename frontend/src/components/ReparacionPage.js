import React, { useState } from "react";
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

  const [form, setForm] = useState({
    tipo: "Reparación",
    tecnico: "",
    diagnostico: "",
    acciones: "",
    fecha: new Date().toISOString().slice(0, 10),
    estadoFinal: "Operativo",
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

  const guardarReparacion = async (e) => {
    e.preventDefault();
    if (!equipo) return alert("Primero debes seleccionar un equipo");

    try {
      await api.post("/reparaciones", {
      equipoId: equipo.id,
      tipo: form.tipo,
      diagnostico: form.diagnostico,
      acciones: form.acciones,
      fecha: form.fecha,
      estadoFinal: form.estadoFinal
    });

      alert("✅ Reparación / mantenimiento registrado");
      setForm({
        tipo: "Reparación",
        tecnico: "",
        diagnostico: "",
        acciones: "",
        fecha: new Date().toISOString().slice(0, 10),
        estadoFinal: "Operativo",
      });
    } catch (err) {
      alert("❌ Error al guardar");
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
                value={form.estadoFinal}
                onChange={(e) =>
                  setForm({ ...form, estadoFinal: e.target.value })
                }
              >
                <option>Operativo</option>
                <option>En reparación</option>
                <option>Fuera de servicio</option>
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
