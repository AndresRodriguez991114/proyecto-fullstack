import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "./middleware/auth.js";

dotenv.config();

// --- FORZAR IPv4 ---
dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

// --- CONEXIÓN A POSTGRES ---
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
  keepAlive: true
});

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
//              🟢 HEALTH CHECK (SIN AUTENTICACIÓN)
// -------------------------------------------------------------
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/db-check", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: r.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//                🟢      LOGIN (LIBRE)
// -------------------------------------------------------------
app.post("/api/usuarios/login", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const result = await pool.query(
      "SELECT id, nombre, email, rol, password FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Upss!! Credenciales incorrectas" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Upss!! Credenciales incorrectas" });
    }

    // 🟢 GENERAR TOKEN JWT
    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -------------------------------------------------------------
//                🟢      CREAR USUARIO (LIBRE)
// -------------------------------------------------------------
app.post("/api/usuarios", async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const rol = req.body.rol || "usuario";

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1,$2,$3,$4)",
      [nombre, email, hashed, rol]
    );

    res.json({ msg: "Usuario creado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//     🟢 LISTAR ESTADOS (PROTEGIDO)
// -------------------------------------------------------------
app.get("/api/estados", auth, async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT id, nombre FROM estados ORDER BY id ASC"
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -------------------------------------------------------------
//     🟢 LISTAR EQUIPOS (PROTEGIDO)
// -------------------------------------------------------------
app.get("/api/equipos", auth, async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id,
        e.serial,
        e.sn,
        e.fecha_ingreso,
        e.proveedor,
        e.observaciones,

        -- IDs (IMPORTANTES PARA EDITAR)
        e.tipo_id,
        e.marca_id,
        e.modelo_id,
        e.departamento_id,
        e.usuario_asignado AS usuario_id,
        e.estado_id,

        -- Nombres para mostrar
        t.nombre  AS tipo,
        m.nombre  AS marca,
        mo.nombre AS modelo,
        d.nombre  AS departamento,
        es.nombre AS estado,

        u.nombre AS usuario_nombre,
        u.email  AS usuario_email

      FROM equipos e
      LEFT JOIN tipos_de_equipos t ON e.tipo_id = t.id
      LEFT JOIN marcas m ON e.marca_id = m.id
      LEFT JOIN modelos mo ON e.modelo_id = mo.id
      LEFT JOIN departamentos d ON e.departamento_id = d.id
      LEFT JOIN usuarios u ON e.usuario_asignado = u.id
      LEFT JOIN estados es ON e.estado_id = es.id
      ORDER BY e.id ASC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);

  } catch (err) {
  console.error("❌ ERROR SQL:", err); 
  res.status(500).json({ 
    error: err.message,
    detail: err.detail,
    hint: err.hint 
  });
}
});

// -------------------------------------------------------------
// 🟢 BUSCAR EQUIPO POR SERIAL O S/N (PROTEGIDO)
// -------------------------------------------------------------
app.get("/api/equipos/buscar/:valor", auth, async (req, res) => {
  try {
    const { valor } = req.params;

    const query = `
      SELECT 
        e.id,
        e.serial,
        e.sn,
        e.estado_id,
        es.nombre AS estado,
        e.fecha_ingreso,
        e.proveedor,
        e.observaciones,

        -- IDs
        e.tipo_id,
        e.marca_id,
        e.modelo_id,
        e.departamento_id,
        e.usuario_asignado AS usuario_id,

        -- Nombres
        t.nombre AS tipo,
        m.nombre AS marca,
        mo.nombre AS modelo,
        d.nombre AS departamento,

        u.nombre AS usuario_nombre,
        u.email AS usuario_email

      FROM equipos e
      LEFT JOIN tipos_de_equipos t ON e.tipo_id = t.id
      LEFT JOIN marcas m ON e.marca_id = m.id
      LEFT JOIN modelos mo ON e.modelo_id = mo.id
      LEFT JOIN estados es ON e.estado_id = es.id
      LEFT JOIN departamentos d ON e.departamento_id = d.id
      LEFT JOIN usuarios u ON e.usuario_asignado = u.id
      WHERE e.serial ILIKE $1 OR e.sn ILIKE $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [`%${valor}%`]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("❌ Error buscando equipo:", err);
    res.status(500).json({ error: "Error buscando equipo" });
  }
});


// -------------------------------------------------------------
//     🟢 CREAR EQUIPO (PROTEGIDO)
// -------------------------------------------------------------
app.post("/api/equipos", auth, async (req, res) => {
  try {
    const {
      serial,
      sn,
      estado_id,
      fecha_ingreso,   
      tipo_id,
      marca_id,
      modelo_id,
      departamento_id,
      usuario_asignado,
      proveedor,
      observaciones  
    } = req.body;

    // VALIDACIONES BÁSICAS
    if (!serial || !sn ) {
      return res.status(400).json({
        error: "serial, sn y estado son obligatorios"
      });
    }

    // Insertar en base de datos
    const query = `
      INSERT INTO equipos 
        (serial, sn, estado_id, fecha_ingreso, tipo_id, marca_id, modelo_id, departamento_id, usuario_asignado, proveedor , observaciones)
      VALUES 
        ($1,$2,$3,COALESCE($4, CURRENT_DATE),$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `;

    const values = [
      serial,
      sn,
      estado_id,
      fecha_ingreso || null,
      tipo_id || null,
      marca_id || null,
      modelo_id || null,
      departamento_id || null,
      usuario_asignado || null,
      proveedor || null,
      observaciones || null
    ];

    const result = await pool.query(query, values);

    res.json({
      msg: "Equipo creado correctamente",
      equipo: result.rows[0]
    });

  } catch (err) {
    console.error("❌ ERROR SQL AL CREAR EQUIPO:", err.message, err.detail, err.hint);

    // Manejo de errores comunes (duplicado de SN)
    if (err.code === "23505") {
      return res.status(409).json({
        error: "El SN ya está registrado (constraint equipos_serial_key)"
      });
    }

    res.status(500).json({
      error: err.message,
      detail: err.detail,
      hint: err.hint
    });
  }
});

// -------------------------------------------------------------
//     🟢 ACTUALIZAR EQUIPO (PROTEGIDO)
// -------------------------------------------------------------

app.put("/api/equipos/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serial,
      sn,
      estado_id,
      fecha_ingreso,
      tipo_id,
      marca_id,
      modelo_id,
      departamento_id,
      usuario_asignado,
      proveedor,
      observaciones
    } = req.body;

    const query = `
      UPDATE equipos
      SET serial = $1,
          sn = $2,
          estado_id = $3,
          fecha_ingreso = $4,
          tipo_id = $5,
          marca_id = $6,
          modelo_id = $7,
          departamento_id = $8,
          usuario_asignado = $9,
          proveedor = $10,
          observaciones = $11
      WHERE id = $12
      RETURNING *;
    `;

    const values = [
      serial,
      sn,
      estado_id,
      fecha_ingreso || null,
      tipo_id || null,
      marca_id || null,
      modelo_id || null,
      departamento_id || null,
      usuario_asignado || null,
      proveedor || null,
      observaciones || null,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    res.json({
      msg: "Equipo actualizado correctamente",
      equipo: result.rows[0]
    });

  } catch (err) {
    console.error("❌ ERROR SQL AL ACTUALIZAR EQUIPO:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//     🟢 ELIMINAR EQUIPO (PROTEGIDO)
// -------------------------------------------------------------

app.delete("/api/equipos/:id", auth, async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM equipos WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Equipo no encontrado" });
  }

  res.json({ msg: "Equipo eliminado correctamente" });
});

// -------------------------------------------------------------
//     🟢 LISTAR USUARIOS (PROTEGIDO)
// -------------------------------------------------------------
app.get("/api/usuarios", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, email, rol FROM usuarios ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//     🟢 ACTUALIZAR USUARIO (PROTEGIDO)
// -------------------------------------------------------------
app.put("/api/usuarios/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, password } = req.body;

    let query = "";
    let values = [];

    // Si viene contraseña → se actualiza con hash
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);

      query = `
        UPDATE usuarios 
        SET nombre = $1, email = $2, rol = $3, password = $4
        WHERE id = $5
      `;
      values = [nombre, email.toLowerCase(), rol, hashed, id];
    } else {
      // Si NO viene contraseña → no se toca la password
      query = `
        UPDATE usuarios 
        SET nombre = $1, email = $2, rol = $3
        WHERE id = $4
      `;
      values = [nombre, email.toLowerCase(), rol, id];
    }

    await pool.query(query, values);

    res.json({ msg: "Usuario actualizado correctamente" });

  } catch (err) {
    console.error("❌ Error actualizando usuario:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//     🟢 ELIMINAR USUARIO (PROTEGIDO)
// -------------------------------------------------------------
app.delete("/api/usuarios/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const check = await pool.query(
      "SELECT id, rol FROM usuarios WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = check.rows[0];

    // Prohibir borrar administradores
    if (user.rol === "administrador") {
      return res.status(403).json({ error: "No puedes eliminar un administrador" });
    }

    // Eliminar
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);

    res.json({ msg: "Usuario eliminado correctamente" });

  } catch (err) {
    console.error("❌ ERROR SQL AL ELIMINAR:", err.message, err.detail, err.hint);
    res.status(500).json({
      error: err.message,
      detail: err.detail,
      hint: err.hint
    });
  }
});


// -------------------------------------------------------------
//     🟢 LISTAR TIPOS
// -------------------------------------------------------------
app.get("/api/tipos", auth, async (req, res) => {
  try {
    const r = await pool.query("SELECT id, nombre FROM tipos_de_equipos ORDER BY id ASC");
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//     🟢 LISTAR MARCAS
// -------------------------------------------------------------
app.get("/api/marcas", auth, async (req, res) => {
  try {
    const r = await pool.query("SELECT id, nombre FROM marcas ORDER BY id ASC");
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//     🟢 LISTAR MODELOS
// -------------------------------------------------------------
app.get("/api/modelos", auth, async (req, res) => {
  try {
    const r = await pool.query("SELECT id, nombre FROM modelos ORDER BY id ASC");
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//     🟢 LISTAR DEPARTAMENTOS
// -------------------------------------------------------------
app.get("/api/departamentos", auth, async (req, res) => {
  try {
    const r = await pool.query("SELECT id, nombre FROM departamentos ORDER BY id ASC");
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 🟢 REGISTRAR REPARACIÓN / MANTENIMIENTO (HISTORIAL)
// -------------------------------------------------------------
app.post("/api/reparaciones", auth, async (req, res) => {
  try {
    const {
      equipoId,
      estadoFinalId,
      acciones,
      diagnostico
    } = req.body;

    if (!equipoId || !estadoFinalId) {
      return res.status(400).json({
        error: "equipoId y estadoFinalId son obligatorios"
      });
    }

    // 1️⃣ Guardar en historial
    await pool.query(
      `INSERT INTO historial 
        (equipo_id, accion, comentario, estado_final_id, acciones, diagnostico)
       VALUES ($1, 'REPARACION', NULL, $2, $3, $4)`,
      [equipoId, estadoFinalId, acciones, diagnostico]
    );

    // 2️⃣ Actualizar estado actual del equipo
    await pool.query(
      "UPDATE equipos SET estado_id = $1 WHERE id = $2",
      [estadoFinalId, equipoId]
    );

    res.json({ msg: "Reparación registrada correctamente" });

  } catch (err) {
    console.error("❌ Error creando reparación:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//                     🟢    PUERTO
// -------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API iniciada en puerto ${PORT}`));
