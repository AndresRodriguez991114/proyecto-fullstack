import React, { useState, useEffect } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api";

const EquiposPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const [equipos, setEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Formulario acorde a la tabla real
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    serial: "",
    tipo_id: "",
    marca_id: "",
    modelo_id: "",
    estado: "activo",
    usuario_asignado: null,
    departamento_id: null,
  });

  // Listas para selects
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    fetchEquipos();
    fetchListas();
  }, []);

  const fetchEquipos = async () => {
    try {
      const res = await api.get("/equipos");
      setEquipos(res.data);
    } catch (err) {
      console.error("Error cargando equipos:", err);
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
        nombre: "",
        serial: "",
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

        {/* TABLA */}
        <section className="tabla-contenedor">
          <h2>Equipos Registrados</h2>

          <table className="tabla-admin">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
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
                  <td>{e.nombre}</td>
                  <td>{e.serial}</td>
                  <td>{e.tipo}</td>
                  <td>{e.marca}</td>
                  <td>{e.modelo}</td>
                  <td>{e.estado}</td>
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
                placeholder="Serial"
                value={nuevoEquipo.serial}
                onChange={(e) =>
                  setNuevoEquipo({ ...nuevoEquipo, serial: e.target.value })
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

              {/* ESTADO */}
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
