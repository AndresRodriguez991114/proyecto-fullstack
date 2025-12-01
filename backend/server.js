import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns"; 
import bcrypt from "bcrypt";

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
//              🟢        ENDPOINT TEST CONEXIÓN
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
//                🟢      LOGIN DE USUARIO
// -------------------------------------------------------------
app.post("/api/usuarios/login", async (req, res) => {

  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    // Buscar usuario por email
    const result = await pool.query(
      "SELECT id, nombre, email, rol, password FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Comparar contraseña encriptada
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Retornar datos sin password
    res.json({
      userId: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//                🟢      CREAR USUARIO
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
      [nombre, email, hashed, rol || "usuario"]
    );

    res.json({ msg: "Usuario creado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
//             🟢     LISTAR TODOS LOS USUARIOS
// -------------------------------------------------------------
app.get("/api/usuarios", async (req, res) => {
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
//                     🟢    PUERTO
// -------------------------------------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`API iniciada en puerto ${PORT}`));
