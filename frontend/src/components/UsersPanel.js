import React, { useEffect, useState } from "react";
import api from "../api";
import { useForm } from "react-hook-form";

/**
 * Panel para listar usuarios y crear nuevos usuarios.
 * - GET /usuarios  -> listado (ya lo tienes en tu backend)
 * - POST /usuarios -> crear (ya existe)
 *
 * Nota: si quieres eliminar/editar, baja más abajo el snippet de servidor propuesto.
 */
const UsersPanel = ({ onTotalChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: "onChange" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/usuarios");
      setUsers(res.data || []);
      if (typeof onTotalChange === "function") onTotalChange(res.data?.length || 0);
    } catch (err) {
      console.error("Error fetch users:", err);
      setServerMsg("No se pudo obtener la lista de usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const onCreate = async (data) => {
    setServerMsg("");
    try {
      await api.post("/usuarios", data);
      setServerMsg("Usuario creado correctamente");
      reset();
      fetchUsers();
    } catch (err) {
      console.error("Error crear usuario:", err);
      setServerMsg("Error creando usuario");
    }
  };

  return (
    <div className="users-panel">
      <h2>Usuarios</h2>

      <div className="users-grid">
        <div className="users-list">
          {loading ? <p>Cargando...</p> : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="users-create">
          <h3>Crear usuario</h3>
          <form onSubmit={handleSubmit(onCreate)} className="create-form">
            <label>Nombre</label>
            <input {...register("nombre", { required: true })} />
            {errors.nombre && <small className="err">Requerido</small>}

            <label>Email</label>
            <input {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} />
            {errors.email && <small className="err">Email inválido</small>}

            <label>Contraseña</label>
            <input type="password" {...register("password", { required: true, minLength: 6 })} />
            {errors.password && <small className="err">Mín 6 caracteres</small>}

            <label>Rol</label>
            <select {...register("rol", { required: true })} defaultValue="usuario">
              <option value="usuario">usuario</option>
              <option value="administrador">admin</option>
            </select>

            <button type="submit" disabled={!isValid}>Crear</button>
            {serverMsg && <p className="server-msg">{serverMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsersPanel;
