import React, { useEffect, useState } from "react";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import {
    obtenerDepartamentos,
    crearDepartamento,
    actualizarDepartamento,
    eliminarDepartamento
} from "../services/departamentosService";

const GestionDepartamentos = () => {
    const [departamento, setDepartamento] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [toast, setToast] = useState({ show: false, type: "success", title: "", message: "" });
    const [modalEliminar, setModalEliminar] = useState(false);
    const [departamentoEliminar, setDepartamentoEliminar] = useState(null);

    const cargarDepartamentos = async () => {
        try {
            setLoading(true);
            const data = await obtenerDepartamentos();
            setDepartamentos(data);
        } catch (error) {
            console.error(error);
            setToast({
                show: true,
                type: "error",
                title: "Error",
                message: error.response?.data?.error || "No se pudieron cargar los departamentos."
            });
        } finally {
            setLoading(false);
        }
    };

    const guardarDepartamento = async () => {
        if (!departamento.trim()) return;

        try {
            await crearDepartamento(departamento);
            setDepartamento("");
            await cargarDepartamentos();
            setToast({
                show: true,
                type: "success",
                title: "Departamento creado",
                message: "El departamento fue creado correctamente."
            });
        } catch (error) {
            console.error(error);
            setToast({
                show: true,
                type: "error",
                title: "Error",
                message: error.response?.data?.error || "Ocurrió un error al crear el departamento."
            });
        }
    };

    const iniciarEdicion = (item) => {
        setEditando(item.id);
        setNuevoNombre(item.nombre);
    };

    const guardarEdicion = async () => {
        if (!nuevoNombre.trim()) return;

        try {
            await actualizarDepartamento(editando, nuevoNombre);
            setEditando(null);
            setNuevoNombre("");
            await cargarDepartamentos();
            setToast({
                show: true,
                type: "success",
                title: "Departamento actualizado",
                message: "El departamento fue actualizado correctamente."
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

    const borrarDepartamento = async () => {
        try {
            await eliminarDepartamento(departamentoEliminar.id);
            setModalEliminar(false);
            setDepartamentoEliminar(null);
            await cargarDepartamentos();
            setToast({
                show: true,
                type: "success",
                title: "Departamento eliminado",
                message: "El departamento fue eliminado correctamente."
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
        cargarDepartamentos();
    }, []);

    return (
        <div className="config-card">
            <div className="config-card-header">
                <Building2 size={24} />
                <h2>Gestión de Departamentos</h2>
            </div>

            <div className="config-card-body">
                <div className="config-list">
                    {loading ? (
                        <p>Cargando departamentos...</p>
                    ) : departamentos.length === 0 ? (
                        <p className="config-empty">No hay departamentos registrados.</p>
                    ) : (
                        departamentos.map((item) => (
                            <div className="config-item" key={item.id}>
                                {editando === item.id ? (
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
                                ) : (
                                    <span>{item.nombre}</span>
                                )}

                                <div className="config-actions">
                                    <button
                                        className="config-icon-btn"
                                        title={editando === item.id ? "Guardar departamento" : "Editar departamento"}
                                        aria-label={editando === item.id ? "Guardar departamento" : "Editar departamento"}
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
                                        title="Eliminar departamento"
                                        aria-label="Eliminar departamento"
                                        onClick={() => {
                                            setDepartamentoEliminar(item);
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

                <div className="config-form">
                    <input
                        type="text"
                        className="config-input"
                        placeholder="Nuevo departamento..."
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                guardarDepartamento();
                            }
                        }}
                    />

                    <button className="config-btn" onClick={guardarDepartamento} disabled={!departamento.trim()}>
                        <Plus size={18} />
                        Agregar
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
                title="Eliminar departamento"
                message={
                    departamentoEliminar ? (
                        <>
                            ¿Estás seguro de que deseas eliminar el departamento <strong>{departamentoEliminar.nombre}</strong>?
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
                    setDepartamentoEliminar(null);
                }}
                onConfirm={borrarDepartamento}
            />
        </div>
    );
};

export default GestionDepartamentos;