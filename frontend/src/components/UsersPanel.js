import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useForm } from "react-hook-form";

const UsersPanel = ({ onTotalChange, openUserModal, setOpenUserModal }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  // ===========================================================
  //   CREAR / EDITAR
  // ===========================================================
  const onSubmit = async (data) => {
    setServerMsg("");

    try {
      if (editingUser) {
        await api.put(`/usuarios/${editingUser.id}`, data);
        setServerMsg("Usuario actualizado correctamente");
      } else {
        await api.post("/usuarios", data);
        setServerMsg("Usuario creado correctamente");
      }

      reset();
      setEditingUser(null);
      setOpenUserModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error guardando usuario:", err);
      setServerMsg("Error guardando usuario");
    }
  };

  // ===========================================================
  //   EDITAR
  // ===========================================================
  const editarUsuario = (usuario) => {
    setEditingUser(usuario);

    setValue("nombre", usuario.nombre);
    setValue("email", usuario.email);
    setValue("rol", usuario.rol);
    setValue("password", ""); // opcional en edición

    setOpenUserModal(true);
  };

  // ===========================================================
  //   ELIMINAR
  // ===========================================================
  const handleDelete = async (id, rol) => {
    if (rol === "administrador") return;

    const confirmar = window.confirm("¿Eliminar este usuario?");
    if (!confirmar) return;

    try {
      await api.delete(`/usuarios/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error eliminando usuario:", err);
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
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>

                    <td>

                      {/* ================================
                          BOTÓN EDITAR (TU SVG ORIGINAL)
                          ================================ */}
                      <button
                        className="btn-small btn-edit"
                        onClick={() => editarUsuario(u)}
                      >
                        <i>
                          <svg width="16" height="16" fill="currentColor">
                            <path d="M12.854.854a.5.5 0 0 0-.708 0L10.5 2.5l2 2L14.146 
                            2.854a.5.5 0 0 0 0-.708l-1.292-1.292zM10 3l-8 
                            8V13h2l8-8-2-2z" />
                          </svg>
                        </i>
                      </button>

                      {/* ================================
                          BOTÓN ELIMINAR (OCULTO ADMINS)
                          ================================ */}
                      {u.rol !== "administrador" && (
                        <button
                          className="btn-small btn-delete"
                          onClick={() => handleDelete(u.id, u.rol)}
                        >
                          <i>
                            <svg width="16" height="16" fill="currentColor">
                            <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 
                            0 0 1-1 0v-6a.5.5 0 0 1 .5-.5zm5 
                            0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 
                            0v-6a.5.5 0 0 1 .5-.5z" />
                            <path d="M14.5 3a1 1 0 0 1-1 
                            1H13v9a2 2 0 0 1-2 
                            2H5a2 2 0 0 1-2-2V4h-.5a1 1 
                            0 0 1 0-2h3.1a2 2 0 0 1 
                            1.9-1.5h2a2 2 0 0 1 1.9 
                            1.5h3.1a1 1 0 0 1 1 1z" />
                          </svg>
                          </i>
                        </button>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>

      {/* =======================================================
           MODAL DE CREAR / EDITAR
      ======================================================== */}
      {openUserModal && (
        <div className="modal-overlay show">
          <div className="modal-box">

            <div className="modal-header">
              <h2>{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setOpenUserModal(false);
                  reset();
                  setEditingUser(null);
                }}
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
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
                placeholder={editingUser ? "Opcional" : ""}
                {...register("password", editingUser ? {} : { required: true, minLength: 6 })}
              />

              <label>Rol</label>
              <select {...register("rol", { required: true })}>
                <option value="usuario">Usuario</option>
                <option value="administrador">Administrador</option>
              </select>

              {serverMsg && <p className="server-msg">{serverMsg}</p>}

              <button className="modal-save" type="submit" disabled={!isValid}>
                {editingUser ? "Actualizar" : "Crear"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersPanel;
