import api from "../api";

// Obtener todas las marcas
export const obtenerMarcas = async () => {
    const { data } = await api.get("/marcas");
    return data;
};

// Crear marca
export const crearMarca = async (nombre) => {
    const { data } = await api.post("/marcas", { nombre });
    return data;
};

// Actualizar marca
export const actualizarMarca = async (id, nombre) => {
    const { data } = await api.put(`/marcas/${id}`, { nombre });
    return data;
};

// Eliminar marca
export const eliminarMarca = async (id) => {
    const { data } = await api.delete(`/marcas/${id}`);
    return data;
};