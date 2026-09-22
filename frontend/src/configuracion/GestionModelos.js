import React, { useCallback, useEffect, useState } from "react";
import { Laptop, Plus, Pencil, Trash2 } from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import { obtenerModelos, crearModelo, actualizarModelo, eliminarModelo } from "../services/modelosService";
import { obtenerMarcas } from "../services/marcasService";
import api from "../api";

const GestionModelos = () => {
    const [modelo, setModelo] = useState("");
    const [marcaId, setMarcaId] = useState("");
    const [tipoId, setTipoId] = useState("");
    const [marcas, setMarcas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaMarcaId, setNuevaMarcaId] = useState("");
    const [nuevoTipoId, setNuevoTipoId] = useState("");
    const [toast, setToast] = useState({ show: false, type: "success", title: "", message: "" });
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modeloEliminar, setModeloEliminar] = useState(null);

    const obtenerTipos = useCallback(async () => {
        const { data } = await api.get("/tipos");
        return data;
    }, []);

    const cargarDatos = useCallback(async () => {
        try {
            setLoading(true);
            const [marcasData, tiposData, modelosData] = await Promise.all([
                obtenerMarcas(),
                obtenerTipos(),
                obtenerModelos()
            ]);
            setMarcas(marcasData);
            setTipos(tiposData);
            setModelos(modelosData);
        } catch (error) {
            console.error(error);
            setToast({
                show: true,
                type: "error",
                title: "Error",
                message: error.response?.data?.error || "No se pudieron cargar los modelos."
            });
        } finally {
            setLoading(false);
        }
    }, [obtenerTipos]);

    const guardarModelo = async () => {
        if (!modelo.trim() || !marcaId) return;

        try {
            await crearModelo({ nombre: modelo, marca_id: Number(marcaId), tipo_id: tipoId ? Number(tipoId) : null });
            setModelo("");
            setMarcaId("");
            setTipoId("");
            await cargarDatos();
            setToast({
                show: true,
                type: "success",
                title: "Modelo creado",
                message: "El modelo fue creado correctamente."
            });
        } catch (error) {
            console.error(error);
            setToast({
                show: true,
                type: "error",
                title: "Error",
                message: error.response?.data?.error || "Ocurrió un error al crear el modelo."
            });
        }
    };

    const iniciarEdicion = (item) => {
        setEditando(item.id);
        setNuevoNombre(item.nombre);
        setNuevaMarcaId(item.marca_id || "");
        setNuevoTipoId(item.tipo_id || "");
    };

    const guardarEdicion = async () => {
        if (!nuevoNombre.trim() || !nuevaMarcaId) return;

        try {
            await actualizarModelo(editando, {
                nombre: nuevoNombre,
                marca_id: Number(nuevaMarcaId),
                tipo_id: nuevoTipoId ? Number(nuevoTipoId) : null
            });
            setEditando(null);
            setNuevoNombre("");
            setNuevaMarcaId("");
            setNuevoTipoId("");
            await cargarDatos();
            setToast({
                show: true,
                type: "success",
                title: "Modelo actualizado",
                message: "El modelo fue actualizado correctamente."
            });
        } catch (error) {
            console.error(error);
            setToast({
                show: true,
                type: "error",
                title: "Error",
                message: error.response?.data?.error || "Ocurrió un error al actualizar."
            });
        }
    };

    const borrarModelo = async () => {
        try {
            await eliminarModelo(modeloEliminar.id);
            setModalEliminar(false);
            setModeloEliminar(null);
            await cargarDatos();
            setToast({
                show: true,
                type: "success",
                title: "Modelo eliminado",
                message: "El modelo fue eliminado correctamente."
            });
        } catch (error) {
            console.error(error);
            setToast({
                show: true,
                type: "error",
                title: "Error",
                message: error.response?.data?.error || "No fue posible eliminar."
            });
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    return (
        <div className="config-card">
            <div className="config-card-header">
                <Laptop size={24} />
                <h2>Gestión de Modelos</h2>
            </div>

            <div className="config-card-body">
                <div className="config-list">
                    {loading ? (
                        <p>Cargando modelos...</p>
                    ) : modelos.length === 0 ? (
                        <p className="config-empty">No hay modelos registrados.</p>
                    ) : (
                        modelos.map((item) => (
                            <div className="config-item" key={item.id}>
                                {editando === item.id ? (
                                    <div className="config-edit-fields">
                                        <input
                                            className="config-input"
                                            value={nuevoNombre}
                                            onChange={(e) => setNuevoNombre(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    guardarEdicion();
                                                }
                                            }}
                                            autoFocus
                                        />
                                        <select
                                            className="config-select"
                                            value={nuevaMarcaId}
                                            onChange={(e) => setNuevaMarcaId(e.target.value)}
                                        >
                                            <option value="">Seleccione una marca</option>
                                            {marcas.map((m) => (
                                                <option key={m.id} value={m.id}>{m.nombre}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="config-select"
                                            value={nuevoTipoId}
                                            onChange={(e) => setNuevoTipoId(e.target.value)}
                                        >
                                            <option value="">Seleccione un tipo</option>
                                            {tipos.map((t) => (
                                                <option key={t.id} value={t.id}>{t.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div>
                                        <strong>{item.nombre}</strong>
                                        <br />
                                        <small>{item.marca || "Sin marca"}</small>
                                    </div>
                                )}

                                <div className="config-actions">
                                    <button
                                        className="config-icon-btn"
                                        title={editando === item.id ? "Guardar modelo" : "Editar modelo"}
                                        aria-label={editando === item.id ? "Guardar modelo" : "Editar modelo"}
                                        onClick={() => {
                                            if (editando === item.id) {
                                                guardarEdicion();
                                            } else {
                                                iniciarEdicion(item);
                                            }
                                        }}
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        className="config-icon-btn delete"
                                        title="Eliminar modelo"
                                        aria-label="Eliminar modelo"
                                        onClick={() => {
                                            setModeloEliminar(item);
                                            setModalEliminar(true);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="config-form-column">
                    <select
                        className="config-select"
                        value={marcaId}
                        onChange={(e) => setMarcaId(e.target.value)}
                    >
                        <option value="">Seleccione una marca</option>
                        {marcas.map((m) => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>

                    <select
                        className="config-select"
                        value={tipoId}
                        onChange={(e) => setTipoId(e.target.value)}
                    >
                        <option value="">Seleccione un tipo</option>
                        {tipos.map((t) => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        className="config-input"
                        placeholder="Nombre del modelo..."
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                guardarModelo();
                            }
                        }}
                    />

                    <button className="config-btn" onClick={guardarModelo} disabled={!modelo.trim() || !marcaId}>
                        <Plus size={18} />
                        Agregar Modelo
                    </button>
                </div>
            </div>

            <Toast
                show={toast.show}
                type={toast.type}
                title={toast.title}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <ConfirmModal
                show={modalEliminar}
                title="Eliminar modelo"
                message={
                    modeloEliminar ? (
                        <>
                            ¿Estás seguro de que deseas eliminar el modelo <strong>{modeloEliminar.nombre}</strong>?
                            <span
                                style={{
                                    display: "block",
                                    marginTop: "12px",
                                    fontSize: "0.9em",
                                    opacity: 0.8
                                }}
                            >
                                Esta acción no se puede deshacer.
                            </span>
                        </>
                    ) : null
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                onCancel={() => {
                    setModalEliminar(false);
                    setModeloEliminar(null);
                }}
                onConfirm={borrarModelo}
            />
        </div>
    );
};

export default GestionModelos;