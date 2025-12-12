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
//     🟢 LISTAR EQUIPOS (PROTEGIDO)
// -------------------------------------------------------------
app.get("/api/equipos", auth, async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id,
        e.serial,
        e.sn,
        e.estado,
        e.fecha_ingreso,
        
        -- Relaciones
        t.nombre  AS tipo,
        m.nombre  AS marca,
        mo.nombre  AS modelo,
        d.nombre  AS departamento,

        -- Usuario asignado
        u.id AS usuario_id,
        u.nombre AS usuario_nombre,
        u.email AS usuario_email

      FROM equipos e
      LEFT JOIN tipos_de_equipos t ON e.tipo_id = t.id
      LEFT JOIN marcas m ON e.marca_id = m.id
      LEFT JOIN modelos mo ON e.modelo_id = mo.id
      LEFT JOIN departamentos d ON e.departamento_id = d.id
      LEFT JOIN usuarios u ON e.usuario_asignado = u.id
      
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
//     🔴 ELIMINAR USUARIO (PROTEGIDO)
// -------------------------------------------------------------
app.delete("/api/usuarios/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Verificar si el usuario existe
    const check = await pool.query(
      "SELECT id, rol FROM usuarios WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = check.rows[0];

    // 2️⃣ Prohibir borrar administradores
    if (user.rol === "administrador") {
      return res.status(403).json({ error: "No puedes eliminar un administrador" });
    }

    // 3️⃣ Eliminar
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
//                     🟢    PUERTO
// -------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API iniciada en puerto ${PORT}`));
