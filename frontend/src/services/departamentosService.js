import api from "../api";

export const obtenerDepartamentos = async () => {
    const { data } = await api.get("/departamentos");
    return data;
};

export const crearDepartamento = async (nombre) => {
    const { data } = await api.post("/departamentos", { nombre });
    return data;
};

export const actualizarDepartamento = async (id, nombre) => {
    const { data } = await api.put(`/departamentos/${id}`, { nombre });
    return data;
};

export const eliminarDepartamento = async (id) => {
    const { data } = await api.delete(`/departamentos/${id}`);
    return data;
};
