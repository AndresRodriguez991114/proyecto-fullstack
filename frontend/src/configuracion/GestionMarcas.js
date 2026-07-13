import React, { useEffect, useState } from "react";
import { Tag, Plus, Pencil, Trash2 } from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import {
    obtenerMarcas,
    crearMarca,
    actualizarMarca,
    eliminarMarca
} from "../services/marcasService";

const GestionMarcas = () => {
    const [marca, setMarca] = useState("");
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [toast, setToast] = useState({
        show: false,
        type: "success",
        title: "",
        message: ""
    });

    const [modalEliminar, setModalEliminar] = useState(false);
    const [marcaEliminar, setMarcaEliminar] = useState(null);

    const cargarMarcas = async () => {
        try {
            setLoading(true);
            const data = await obtenerMarcas();
            setMarcas(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const guardarMarca = async () => {
        if (!marca.trim()) return;
        try {
            await crearMarca(marca);
            setMarca("");
            await cargarMarcas();
            setToast({
                show: true,
                type: "success",
                title: "Marca creada",
                message: "La marca fue creada correctamente."
            });
        } catch (error) {
            console.error(error);
            setToast({
                show: true,
                type: "error",
                title: "Error",
                message: error.response?.data?.error || "Ocurrió un error al crear la marca."
            });
        }
    };

    const iniciarEdicion = (marca) => {
        setEditando(marca.id);
        setNuevoNombre(marca.nombre);
    };  

    const guardarEdicion = async () => {
        if (!nuevoNombre.trim()) return;
        try {
            await actualizarMarca(editando, nuevoNombre);
            setEditando(null);
            setNuevoNombre("");
            await cargarMarcas();
            setToast({
                show: true,
                type: "success",
                title: "Marca actualizada",
                message: "La marca fue actualizada correctamente."
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

    const borrarMarca = async () => {
        try {
            await eliminarMarca(marcaEliminar.id);
            setModalEliminar(false);
            setMarcaEliminar(null);
            cargarMarcas();
            setToast({
                show: true,
                type: "success",
                title: "Marca eliminada",
                message: "La marca fue eliminada correctamente."
            });
        } catch (error) {
            setToast({
                show: true,
                type: "error",
                title: "Error",
                message: error.response?.data?.error || "No fue posible eliminar."
            });
        }
    };

    useEffect(() => {
        cargarMarcas();
    }, []);

    return (
        <div className="config-card">
            <div className="config-card-header">
                <Tag size={24} />
                <h2>Gestión de Marcas</h2>
            </div>

            <div className="config-card-body">
                <div className="config-list">
                    {loading ? (
                        <p>Cargando marcas...</p>
                    ) : (
                        marcas.map((item) => (
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
                                        onClick={() => {
                                            setMarcaEliminar(item);
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
                        className="config-input"
                        placeholder="Nueva marca..."
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                guardarMarca();
                            }
                        }}
                    />

                    <button
                        className="config-btn"
                        onClick={guardarMarca}
                    >
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
                onClose={() =>
                    setToast({
                        ...toast,
                        show: false,
                    })
                }
            />

            {/* Modal actualizado con la estructura visual de la imagen */}
            <ConfirmModal
                show={modalEliminar}
                title="Eliminar marca"
                message={
                    marcaEliminar ? (
                        <>
                            ¿Estás seguro de que deseas eliminar la marca <strong>{marcaEliminar.nombre}</strong>?
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
                    setMarcaEliminar(null);
                }}
                onConfirm={borrarMarca}
            />
        </div>
    );
};

export default GestionMarcas;
