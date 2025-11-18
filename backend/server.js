import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns"; // ← Necesario para forzar IPv4

dotenv.config();

// --- FORZAR IPv4 (evita el ENETUNREACH) ---
dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

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

// --- TEST DE CONEXIÓN ---
app.get("/api/db-check", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: r.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET todos los usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear usuario
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre, correo, edad } = req.body;
    await pool.query(
      "INSERT INTO usuarios (nombre, correo, edad) VALUES ($1,$2,$3)",
      [nombre, correo, edad]
    );
    res.json({ msg: "Usuario creado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// USAR PUERTO DE RENDER SI EXISTE
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`API iniciada en puerto ${PORT}`));
