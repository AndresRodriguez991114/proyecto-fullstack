import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import Sidebar from "../módulos/Sidebar";
import ThemeToggle from "../módulos/ThemeToggle";
import { useForm } from "react-hook-form";
import "./styles.css";

// Aplicar tema antes de renderizar
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

const EquiposPage = () => {

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const [theme, setTheme] = useState(savedTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  // ---- ESTADOS DEL PANEL ----
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEquipoModal, setOpenEquipoModal] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  // FORMULARIO
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  // ---- THEME ----
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---- TOGGLE MENU ----
  const toggleMenu = () => setMenuOpen(prev => !prev);

  // ---- FETCH EQUIPOS ----
  const fetchEquipos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/equipos");
      setEquipos(res.data || []);
    } catch (err) {
      console.error("Error obteniendo equipos:", err);
      setServerMsg("No se pudo obtener la lista de equipos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipos();
  }, [fetchEquipos]);

  // ---- CREAR EQUIPO ----
  const onCreate = async (data) => {
    setServerMsg("");
    try {
      await api.post("/equipos", data);
      setServerMsg("Equipo creado correctamente");
      reset();
      fetchEquipos();
      setOpenEquipoModal(false);
    } catch (err) {
      console.error(err);
      setServerMsg("Error creando equipo");
    }
  };

  return (
    <div className={`admin-root ${theme}`}>

      {/* SIDEBAR */}
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* MAIN */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">
          <span className="hamburger" onClick={toggleMenu}>☰</span>
          <h1>Equipos</h1>
          <ThemeToggle />
        </header>

        {/* STATS */}
        <section className="cards-row">
          <div className="card">
            <h4>Total Equipos</h4>
            <p>{equipos.length}</p>
          </div>
        </section>

        {/* ================================ */}
        {/* PANEL - LISTA + BOTÓN + MODAL */}
        {/* ================================ */}

        <section className="panel panel-slide-in">

          {/* BOTÓN NUEVO */}
          <button
            className="btn-agregar-usuario"
            style={{ marginBottom: "20px" }}
            onClick={() => setOpenEquipoModal(true)}
          >
            + Registrar Equipo
          </button>

          {/* LISTA DE EQUIPOS */}
          {loading ? (
            <p className="cargando">Cargando...</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Serial</th>
                  <th>Marca</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map(eq => (
                  <tr key={eq.id}>
                    <td>{eq.id}</td>
                    <td>{eq.serial}</td>
                    <td>{eq.marca}</td>
                    <td>{eq.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </section>

        {/* ================================ */}
        {/* MODAL */}
        {/* ================================ */}
        {openEquipoModal && (
          <div className="modal-overlay show">
            <div className="modal-box">

              <div className="modal-header">
                <h2>Registrar Equipo</h2>
                <button className="modal-close" onClick={() => setOpenEquipoModal(false)}>✖</button>
              </div>

              <form onSubmit={handleSubmit(onCreate)} className="modal-form">

                <label>Serial</label>
                <input {...register("serial", { required: true })} />
                {errors.serial && <small className="err">Requerido</small>}

                <label>Marca</label>
                <input {...register("marca", { required: true })} />
                {errors.marca && <small className="err">Requerido</small>}

                <label>Estado</label>
                <select {...register("estado")} defaultValue="Disponible">
                  <option>Disponible</option>
                  <option>Asignado</option>
                  <option>Dañado</option>
                </select>

                {serverMsg && <p className="server-msg">{serverMsg}</p>}

                <button className="modal-save" type="submit" disabled={!isValid}>
                  Guardar
                </button>
              </form>

            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="admin-legal">
          © 2025 Cloud + Inventory. Todos los derechos reservados.
        </footer>

      </main>
    </div>
  );
};

export default EquiposPage;
