import api from "../api";

export const obtenerModelos = async () => {
    const { data } = await api.get("/modelos");
    return data;
};

export const crearModelo = async (payload) => {
    const { data } = await api.post("/modelos", payload);
    return data;
};

export const actualizarModelo = async (id, payload) => {
    const { data } = await api.put(`/modelos/${id}`, payload);
    return data;
};

export const eliminarModelo = async (id) => {
    const { data } = await api.delete(`/modelos/${id}`);
    return data;
};
