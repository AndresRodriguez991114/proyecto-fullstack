const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

const generarExcel = require("../utils/generarExcel");
const generarPDF = require("../utils/generarPDF");

router.get("/general",/* auth, */async (req, res) => {
  const { formato } = req.query;

  const result = await pool.query(`
    SELECT es.nombre AS estado, COUNT(*) AS total
    FROM equipos e
    JOIN estados es ON e.estado_id = es.id
    GROUP BY es.nombre
    ORDER BY es.nombre
  `);

  const columnas = [
    { header: "Estado", key: "estado" },
    { header: "Total", key: "total" }
  ];

  if (formato === "excel")
    return generarExcel(res, "Reporte_General", columnas, result.rows);

  if (formato === "pdf")
    return generarPDF(res, "Reporte General de Equipos", columnas, result.rows);

  res.json(result.rows);
});


router.get("/mantenimientos", auth, async (req, res) => {
  const { formato } = req.query;

  const result = await pool.query(`
    SELECT
      e.serial,
      e.sn,
      h.fecha,
      u.nombre AS tecnico,
      h.diagnostico,
      h.acciones,
      es.nombre AS estado_final
    FROM historial h
    JOIN equipos e ON h.equipo_id = e.id
    LEFT JOIN usuarios u ON h.usuario_id = u.id
    LEFT JOIN estados es ON h.estado_final_id = es.id
    WHERE h.accion = 'Mantenimiento'
    ORDER BY h.fecha DESC
  `);

  const columnas = [
    { header: "Serial", key: "serial" },
    { header: "SN", key: "sn" },
    { header: "Fecha", key: "fecha" },
    { header: "Técnico", key: "tecnico" },
    { header: "Diagnóstico", key: "diagnostico" },
    { header: "Acciones", key: "acciones" },
    { header: "Estado Final", key: "estado_final" }
  ];

  if (formato === "excel")
    return generarExcel(res, "Mantenimientos", columnas, result.rows);

  if (formato === "pdf")
    return generarPDF(res, "Reporte de Mantenimientos", columnas, result.rows);

  res.json(result.rows);
});

router.get("/reparaciones", auth, async (req, res) => {
  const { formato } = req.query;

  const result = await pool.query(`
    SELECT
      e.serial,
      e.sn,
      h.fecha,
      u.nombre AS tecnico,
      h.diagnostico,
      h.acciones,
      es.nombre AS estado_final
    FROM historial h
    JOIN equipos e ON h.equipo_id = e.id
    LEFT JOIN usuarios u ON h.usuario_id = u.id
    LEFT JOIN estados es ON h.estado_final_id = es.id
    WHERE h.accion = 'Reparacion'
    ORDER BY h.fecha DESC
  `);

  const columnas = [
    { header: "Serial", key: "serial" },
    { header: "SN", key: "sn" },
    { header: "Fecha", key: "fecha" },
    { header: "Técnico", key: "tecnico" },
    { header: "Diagnóstico", key: "diagnostico" },
    { header: "Acciones", key: "acciones" },
    { header: "Estado Final", key: "estado_final" }
  ];

  if (formato === "excel")
    return generarExcel(res, "Reparaciones", columnas, result.rows);

  if (formato === "pdf")
    return generarPDF(res, "Reporte de Reparaciones", columnas, result.rows);

  res.json(result.rows);
});

router.get("/fechas", auth, async (req, res) => {
  const { desde, hasta, formato } = req.query;

  if (!desde || !hasta)
    return res.status(400).json({ error: "Debe indicar fechas" });

  const result = await pool.query(`
    SELECT
      e.serial,
      h.accion,
      h.fecha,
      u.nombre AS tecnico,
      h.diagnostico,
      es.nombre AS estado_final
    FROM historial h
    JOIN equipos e ON h.equipo_id = e.id
    LEFT JOIN usuarios u ON h.usuario_id = u.id
    LEFT JOIN estados es ON h.estado_final_id = es.id
    WHERE h.fecha BETWEEN $1 AND $2
    ORDER BY h.fecha DESC
  `, [desde, hasta]);

  const columnas = [
    { header: "Serial", key: "serial" },
    { header: "Acción", key: "accion" },
    { header: "Fecha", key: "fecha" },
    { header: "Técnico", key: "tecnico" },
    { header: "Diagnóstico", key: "diagnostico" },
    { header: "Estado Final", key: "estado_final" }
  ];

  if (formato === "excel")
    return generarExcel(res, "Reporte_por_Fechas", columnas, result.rows);

  if (formato === "pdf")
    return generarPDF(res, "Reporte por Fechas", columnas, result.rows);

  res.json(result.rows);
});

