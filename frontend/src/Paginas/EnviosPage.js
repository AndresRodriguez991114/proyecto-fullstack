import React, { useState, useEffect, useCallback } from "react";
import {FiSend} from "react-icons/fi";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import api from "../api";
import "../Styles/EnviosPage.css";

const EnviosPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  const [filtros, setFiltros] = useState({
    search: "",
    usuario_nombre: "",
    departamento: "",
    tipo: "",
    marca: "",
    estado: ""
  });

  const [modalCerrar, setModalCerrar] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  // 🆕 selección múltiple
  const [seleccionados, setSeleccionados] = useState([]);

  const [formCerrar, setFormCerrar] = useState({
    comentario: ""
  });

  /* ============================
     🔄 CARGAR EQUIPOS EN PROCESO
  ============================ */
  const cargarEquipos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/equipos/listos-envio");
      setEquipos(res.data);
    } catch (err) {
      console.error("Error cargando equipos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  /* ============================
     🔍 FILTROS
  ============================ */
  const equiposFiltrados = equipos.filter(e => {
    const texto = filtros.search.toLowerCase();

    return (
      (!texto ||
        e.serial?.toLowerCase().includes(texto) ||
        e.sn?.toLowerCase().includes(texto) ||
        e.tipo?.toLowerCase().includes(texto) ||
        e.marca?.toLowerCase().includes(texto) ||
        e.modelo?.toLowerCase().includes(texto) ||
        e.departamento?.toLowerCase().includes(texto) ||
        e.estado?.toLowerCase().includes(texto) ||
        e.usuario_nombre?.toLowerCase().includes(texto)
      ) &&
      (!filtros.usuario_nombre || 
        e.usuario_nombre?.toLowerCase() === filtros.usuario_nombre.toLowerCase()) &&

      (!filtros.departamento || 
        e.departamento?.toLowerCase() === filtros.departamento.toLowerCase()) &&

      (!filtros.tipo || 
        e.tipo?.toLowerCase() === filtros.tipo.toLowerCase()) &&

      (!filtros.marca || 
        e.marca?.toLowerCase() === filtros.marca.toLowerCase()) &&

      (!filtros.estado || 
        e.estado?.toLowerCase() === filtros.estado.toLowerCase())
    );
  });

  const obtenerOpciones = (array, campo) => {
    return [...new Set(array.map(item => item[campo]).filter(Boolean))];
  };

const usuariosAsignados = obtenerOpciones(equipos, "usuario_nombre");
const departamentosFiltro = obtenerOpciones(equipos, "departamento");
const tiposFiltro = obtenerOpciones(equipos, "tipo");
const marcasFiltro = obtenerOpciones(equipos, "marca");
const estadosFiltro = obtenerOpciones(equipos, "estado");


  const limpiarFiltros = () => {
    setFiltros({
    search: "",
    usuario_nombre: "",
    departamento: "",
    tipo: "",
    marca: "",
    estado: ""
    });
  };

  /* ============================
     🆕 SELECCIÓN
  ============================ */
  const toggleSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(e => e !== id)
        : [...prev, id]
    );
  };

  const seleccionarTodos = () => {
    if (seleccionados.length === equiposFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(equiposFiltrados.map(e => e.id));
    }
  };

  /* ============================
     🚚 ENVÍO INDIVIDUAL
  ============================ */
  const cerrarProceso = async () => {
    try {
      await api.put(`/equipos/${equipoSeleccionado.id}/enviar`, {
        ...formCerrar
      });

      setModalCerrar(false);
      setEquipoSeleccionado(null);
      setSeleccionados([]);
      setFormCerrar({ comentario: "" });

      cargarEquipos();
    } catch (err) {
      console.error("Error cerrando proceso:", err);
      alert("Error al cerrar el proceso");
    }
  };

  /* ============================
     🚀 ENVÍO MASIVO
  ============================ */
  const envioMasivo = async () => {
    try {
      for (let id of seleccionados) {
        await api.put(`/equipos/${id}/enviar`, {
          comentario: formCerrar.comentario
        });
      }

      setModalCerrar(false);
      setSeleccionados([]);
      setFormCerrar({ comentario: "" });

      cargarEquipos();
    } catch (err) {
      console.error("Error en envío masivo:", err);
      alert("Error en envío masivo");
    }
  };

  return (
    <div className="admin-root">
      <Sidebar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="admin-main">
        <Header title="Envíos / Procesos" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* STATS */}
        <section className="inicio-stats">
          <div className="stat-card">
            <h2>{equiposFiltrados.length}</h2>
            <p>Equipos en proceso</p>
          </div>
        </section>

        {/* TOOLBAR */}
        <div className="equipos-toolbar">
          <div className="toolbar-left">
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={filtros.search}
              onChange={(e) =>
                setFiltros({ ...filtros, search: e.target.value })
              }
            />
            {/* 🆕 BOTÓN MASIVO */}
              {seleccionados.length > 0 && (
              <button
                className="btn-gold btn-envio-masivo"
                onClick={() => setModalCerrar(true)}
              >
                Enviar ({seleccionados.length})
              </button>
            )}
          </div>

          <div className="toolbar-right">


            <button
              className="btn-filter"
              onClick={() => setMostrarFiltro(!mostrarFiltro)}
              title="Filtrar"
            >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z"/>
            </svg>
            </button>

            {mostrarFiltro && (
              <div
                className="filtro-overlay"
                onClick={() => setMostrarFiltro(false)}
              >
                <div
                  className="filtro-panel"
                  onClick={(e) => e.stopPropagation()}
                >           
                <select
                  value={filtros.usuario_nombre}
                  onChange={(e) =>
                    setFiltros({ ...filtros, usuario_nombre: e.target.value })
                  }
                >
                  <option value="">Usuario asignado</option>

                  {usuariosAsignados.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>

                <select
                  value={filtros.departamento}
                  onChange={(e) =>
                    setFiltros({ ...filtros, departamento: e.target.value })
                  }
                >
                  <option value="">Departamento</option>
                  {departamentosFiltro.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={filtros.tipo}
                  onChange={(e) =>
                    setFiltros({ ...filtros, tipo: e.target.value })
                  }
                >
                  <option value="">Tipo</option>
                  {tiposFiltro.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <select
                  value={filtros.marca}
                  onChange={(e) =>
                    setFiltros({ ...filtros, marca: e.target.value })
                  }
                >
                  <option value="">Marca</option>
                  {marcasFiltro.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select
                  value={filtros.estado}
                  onChange={(e) =>
                    setFiltros({ ...filtros, estado: e.target.value })
                  }
                >
                  <option value="">Estado</option>
                  {estadosFiltro.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>

                <div className="filtro-actions">
                  <button onClick={() => {setMostrarFiltro(false);}}
                    > Aplicar
                  </button>
                  
                  <button
                    className="ghost"
                    onClick={limpiarFiltros}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLA */}
        <section className="tabla-contenedor panel-slide">
          <h2>Equipos Disponibles para envio</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className="tabla-admin">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={seleccionarTodos}
                      checked={
                        seleccionados.length === equiposFiltrados.length &&
                        equiposFiltrados.length > 0
                      }
                    />
                  </th>
                  <th>ID</th>
                  <th>Serial</th>
                  <th>S/N</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {equiposFiltrados.map(e => (
                  <tr key={e.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(e.id)}
                        onChange={() => toggleSeleccion(e.id)}
                      />
                    </td>
                    <td>{e.id}</td>
                    <td>{e.serial}</td>
                    <td>{e.sn}</td>
                    <td>{e.tipo}</td>
                    <td>{e.marca}</td>
                    <td>{e.modelo}</td>
                    <td>{e.estado}</td>

                    <td>
                      <button
                        className="btn-small btn-edit"
                        title="Enviar"
                        onClick={() => {
                          setEquipoSeleccionado(e);
                          setModalCerrar(true);
                        }}
                      >
                        <FiSend/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* MODAL */}
        {modalCerrar && (
          <div className="envio-overlay" onClick={() => setModalCerrar(false)}>
            <div className="envio-modal" onClick={(e) => e.stopPropagation()}>

              <div className="envio-icon">
                <svg viewBox="0 0 24 24" style={{ transform: 'rotate(140deg)' }}>
                  <path d="M2 12l19-9-5 9 5 9-19-9z"/>
                </svg>
              </div>

              <h2>Confirmar envío</h2>

              <p className="envio-sub">
                ¿Estás seguro que deseas enviar el equipo?
                El equipo pasará a <b>Activos</b>
              </p>

              <textarea
                placeholder="Comentario (opcional)"
                value={formCerrar.comentario}
                onChange={(e) =>
                  setFormCerrar({ comentario: e.target.value })
                }
              />

              <div className="envio-actions">
                <button
                  className="btn-gold"
                  onClick={() =>
                    equipoSeleccionado ? cerrarProceso() : envioMasivo()
                  }
                >
                  Confirmar
                </button>

                <button
                  className="btn-cancel"
                  onClick={() => setModalCerrar(false)}
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

export default EnviosPage;