import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

const app = express();
app.use(cors());
app.use(express.json());

// GET todos los usuarios
app.get("/api/usuarios", async (req, res) => {
  const result = await pool.query("SELECT * FROM usuarios");
  res.json(result.rows);
});

// Crear usuario
app.post("/api/usuarios", async (req, res) => {
  const { nombre, correo, edad } = req.body;
  await pool.query(
    "INSERT INTO usuarios (nombre, correo, edad) VALUES ($1,$2,$3)",
    [nombre, correo, edad]
  );
  res.json({ msg: "Usuario creado" });
});

app.listen(3000, () => console.log("API iniciada en puerto 3000"));
