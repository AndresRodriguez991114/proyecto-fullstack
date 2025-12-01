import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useForm } from "react-hook-form";


const UsersPanel = ({ onTotalChange, openUserModal, setOpenUserModal }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/usuarios");
      setUsers(res.data || []);
      if (typeof onTotalChange === "function")
        onTotalChange(res.data?.length || 0);
    } catch (err) {
      console.error("Error fetch users:", err);
      setServerMsg("No se pudo obtener la lista de usuarios");
    } finally {
      setLoading(false);
    }
  }, [onTotalChange]);


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const onCreate = async (data) => {
    setServerMsg("");
    try {
      await api.post("/usuarios", data);
      setServerMsg("Usuario creado correctamente");
      reset();
      fetchUsers();
      setOpenUserModal(false);
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
          {loading ? (
            <p>Cargando...</p>
          ) : (
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
                {users.map((u) => (
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
      </div>

      {/* =====================================================
          🔥 MODAL CON ESTILO UNIFICADO
      ====================================================== */}
      {openUserModal && (
        <div className="modal-overlay show">
          <div className="modal-box">

            {/* HEADER */}
            <div className="modal-header">
              <h2>Crear Nuevo Usuario</h2>
              <button
                className="modal-close"
                onClick={() => setOpenUserModal(false)}
              >
                ✖
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onCreate)} className="modal-form">

              <label>Nombre</label>
              <input {...register("nombre", { required: true })} />
              {errors.nombre && <small className="err">Requerido</small>}

              <label>Email</label>
              <input
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
              />
              {errors.email && <small className="err">Email inválido</small>}

              <label>Contraseña</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
              />
              {errors.password && (
                <small className="err">Mín 6 caracteres</small>
              )}

              <label>Rol</label>
              <select {...register("rol", { required: true })} defaultValue="usuario">
                <option value="usuario">Usuario</option>
                <option value="administrador">Administrador</option>
              </select>

              {serverMsg && <p className="server-msg">{serverMsg}</p>}

              <button className="modal-save" type="submit" disabled={!isValid}>
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPanel;
