import React, { useState } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api";
import "../Styles/ReparacionPage.css";



const ReparacionPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =============================
  // BÚSQUEDA DE EQUIPO
  // =============================
  const [busqueda, setBusqueda] = useState("");
  const [equipo, setEquipo] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const buscarEquipo = async (e) => {
    e.preventDefault();

    if (!busqueda) return;

    setBuscando(true);
    setMensaje("");
    setEquipo(null);

    try {
      const res = await api.get(`/equipos/buscar/${busqueda}`);
      setEquipo(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setMensaje("No se encontró el equipo");
      } else {
        setMensaje("Error al buscar el equipo");
      }
    } finally {
      setBuscando(false);
    }
  };

  // =============================
  // FORMULARIO REPARACIÓN
  // =============================
  const [reparacion, setReparacion] = useState({
    tipo: "reparacion",
    diagnostico: "",
    acciones: "",
    tecnico: "",
    fecha: new Date().toISOString().slice(0, 10),
    estado_final: "operativo",
  });

  const guardarReparacion = async () => {
    if (!reparacion.tecnico || !reparacion.diagnostico) {
      alert("Completa los campos obligatorios");
      return;
    }

    try {
      await api.post("/reparaciones", {
        ...reparacion,
        equipo_id: equipo.id,
      });

      alert("Reparación registrada correctamente");

      // reset
      setReparacion({
        tipo: "reparacion",
        diagnostico: "",
        acciones: "",
        tecnico: "",
        fecha: new Date().toISOString().slice(0, 10),
        estado_final: "operativo",
      });

      setEquipo(null);
      setBusqueda("");

    } catch (err) {
      console.error(err);
      alert("Error guardando la reparación");
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

        {/* ============================= */}
        {/* BUSCAR EQUIPO */}
        {/* ============================= */}
        <section className="panel-card">
          <h2>Buscar equipo</h2>

          <form className="search-row" onSubmit={buscarEquipo}>
            <input
              type="text"
              placeholder="Serial o S/N del equipo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <button
              type="submit"
              className="btn-crear"
              disabled={!busqueda || buscando}
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </form>

          {mensaje && <p className="form-msg">{mensaje}</p>}
        </section>

        {/* ============================= */}
        {/* EQUIPO ENCONTRADO */}
        {/* ============================= */}
        {equipo && (
          <section className="panel-card">
            <h3>Equipo encontrado</h3>

            <div className="info-grid">
              <p><strong>Serial:</strong> {equipo.serial}</p>
              <p><strong>S/N:</strong> {equipo.sn}</p>
              <p><strong>Marca:</strong> {equipo.marca || "—"}</p>
              <p><strong>Modelo:</strong> {equipo.modelo || "—"}</p>
              <p><strong>Estado actual:</strong> {equipo.estado}</p>
            </div>
          </section>
        )}

        {/* ============================= */}
        {/* REGISTRAR REPARACIÓN */}
        {/* ============================= */}
        {equipo && (
          <section className="panel-card">
            <h3>Registrar reparación / mantenimiento</h3>

            <div className="form-grid">
              <select
                value={reparacion.tipo}
                onChange={(e) =>
                  setReparacion({ ...reparacion, tipo: e.target.value })
                }
              >
                <option value="reparacion">Reparación</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>

              <input
                type="text"
                placeholder="Técnico responsable"
                value={reparacion.tecnico}
                onChange={(e) =>
                  setReparacion({ ...reparacion, tecnico: e.target.value })
                }
              />

              <textarea
                placeholder="Diagnóstico"
                value={reparacion.diagnostico}
                onChange={(e) =>
                  setReparacion({ ...reparacion, diagnostico: e.target.value })
                }
              />

              <textarea
                placeholder="Acciones realizadas"
                value={reparacion.acciones}
                onChange={(e) =>
                  setReparacion({ ...reparacion, acciones: e.target.value })
                }
              />

              <input
                type="date"
                value={reparacion.fecha}
                onChange={(e) =>
                  setReparacion({ ...reparacion, fecha: e.target.value })
                }
              />

              <select
                value={reparacion.estado_final}
                onChange={(e) =>
                  setReparacion({ ...reparacion, estado_final: e.target.value })
                }
              >
                <option value="operativo">Operativo</option>
                <option value="en_reparacion">En reparación</option>
                <option value="baja">Baja</option>
              </select>

              <button
                className="btn-crear full"
                onClick={guardarReparacion}
              >
                Guardar reparación
              </button>
            </div>
          </section>
        )}

        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
};

export default ReparacionPage;
