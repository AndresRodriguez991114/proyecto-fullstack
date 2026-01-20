import express from "express";
import { auth } from "../middleware/auth.js";
import pool from "../db.js";

const router = express.Router();

router.get("/general", auth, async (req, res) => {
  try {
    const { formato } = req.query;

    const result = await pool.query(`
      SELECT es.nombre AS estado, COUNT(*) AS total
      FROM equipos e
      JOIN estados es ON e.estado_id = es.id
      GROUP BY es.nombre
      ORDER BY es.nombre;
    `);

    if (formato === "json") {
      return res.json(result.rows);
    }

    res.json({
      reporte: "general",
      total: result.rows.length,
      data: result.rows
    });

  } catch (err) {
    console.error("❌ Error reporte general:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
