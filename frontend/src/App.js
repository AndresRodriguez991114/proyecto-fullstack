import { useEffect, useState } from "react";

const API = "https://proyecto-fullstack-nfai.onrender.com/api/usuarios"; 

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: "", correo: "", edad: "" });
  const [editId, setEditId] = useState(null);

  // Cargar usuarios
  const cargarUsuarios = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => setUsuarios(data));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Agregar o Editar Usuario
  const manejarSubmit = (e) => {
    e.preventDefault();

    if (editId === null) {
      // Crear
      fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }).then(() => {
        setForm({ nombre: "", correo: "", edad: "" });
        cargarUsuarios();
      });
    } else {
      // Editar
      fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }).then(() => {
        setForm({ nombre: "", correo: "", edad: "" });
        setEditId(null);
        cargarUsuarios();
      });
    }
  };

  // Eliminar usuario
  const eliminarUsuario = (id) => {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => cargarUsuarios());
  };

  // Preparar edición
  const editarUsuario = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      correo: usuario.correo,
      edad: usuario.edad
    });
    setEditId(usuario.id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Usuarios</h1>

      {/* Formulario */}
      <form onSubmit={manejarSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Correo"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          required
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Edad"
          value={form.edad}
          onChange={(e) => setForm({ ...form, edad: e.target.value })}
          required
        />

        <button style={styles.button}>
          {editId === null ? "Agregar Usuario" : "Guardar Cambios"}
        </button>
      </form>

      {/* Tabla */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Correo</th>
            <th style={styles.th}>Edad</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td style={styles.td}>{u.nombre}</td>
              <td style={styles.td}>{u.correo}</td>
              <td style={styles.td}>{u.edad}</td>
              <td style={styles.td}>
                <button style={styles.btnEdit} onClick={() => editarUsuario(u)}>
                  Editar
                </button>
                <button style={styles.btnDelete} onClick={() => eliminarUsuario(u.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Arial"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  form: {
    display: "grid",
    gap: 10,
    marginBottom: 20
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  button: {
    padding: 12,
    fontSize: 16,
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    background: "#f4f4f4",
    padding: 10,
    textAlign: "left"
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #ddd"
  },
  btnEdit: {
    marginRight: 10,
    padding: "6px 10px",
    background: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  },
  btnDelete: {
    padding: "6px 10px",
    background: "#E53935",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  }
};

export default App;
