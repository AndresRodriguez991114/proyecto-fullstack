import express from "express";
import { auth } from "../middleware/auth.js";
import pool from "../db.js";
import generarPDF from "../utils/generarPDF.js";
import generarExcel from "../utils/generarExcel.js";

const router = express.Router();

const exportarReporte = async (req, res, { titulo, query, columnas, params = [] }) => {
  const formato = (req.query.formato || "json").toLowerCase();

  try {
    const result = await pool.query(query, params);
    const rows = result.rows;

    if (formato === "json") {
      return res.json(rows);
    }

    if (formato === "excel") {
      return await generarExcel(res, titulo, columnas, rows);
    }

    if (formato === "pdf") {
      return generarPDF(res, titulo, columnas, rows);
    }

    return res.json(rows);
  } catch (error) {
    console.error(`❌ Error generando reporte ${titulo}:`, error);
    return res.status(500).json({ error: error.message });
  }
};

router.get("/general", auth, async (req, res) => {
  await exportarReporte(req, res, {
    titulo: "Reporte General",
    query: `
      SELECT es.nombre AS estado, COUNT(*)::int AS total
      FROM equipos e
      JOIN estados es ON e.estado_id = es.id
      GROUP BY es.nombre
      ORDER BY es.nombre;
    `,
    columnas: [
      { header: "Estado", key: "estado" },
      { header: "Total", key: "total" }
    ]
  });
});

router.get("/mantenimientos", auth, async (req, res) => {
  await exportarReporte(req, res, {
    titulo: "Reporte de Mantenimientos",
    query: `
      SELECT
        h.id,
        e.serial,
        e.sn,
        te.nombre AS tipo,
        ma.nombre AS marca,
        mo.nombre AS modelo,
        es.nombre AS estado_final,
        h.fecha,
        u.nombre AS usuario,
        COALESCE(h.comentario, '') AS comentario,
        COALESCE(h.acciones, '') AS acciones,
        COALESCE(h.diagnostico, '') AS diagnostico
      FROM historial h
      JOIN equipos e ON e.id = h.equipo_id
      LEFT JOIN tipos_de_equipos te ON e.tipo_id = te.id
      LEFT JOIN marcas ma ON e.marca_id = ma.id
      LEFT JOIN modelos mo ON e.modelo_id = mo.id
      LEFT JOIN estados es ON h.estado_final_id = es.id
      LEFT JOIN usuarios u ON h.usuario_id = u.id
      WHERE LOWER(h.accion) LIKE '%mantenimiento%'
      ORDER BY h.fecha DESC, h.id DESC;
    `,
    columnas: [
      { header: "ID", key: "id" },
      { header: "Serial", key: "serial" },
      { header: "S/N", key: "sn" },
      { header: "Tipo", key: "tipo" },
      { header: "Marca", key: "marca" },
      { header: "Modelo", key: "modelo" },
      { header: "Estado Final", key: "estado_final" },
      { header: "Fecha", key: "fecha" },
      { header: "Usuario", key: "usuario" },
      { header: "Comentario", key: "comentario" },
      { header: "Acciones", key: "acciones" },
      { header: "Diagnóstico", key: "diagnostico" }
    ]
  });
});

router.get("/reparaciones", auth, async (req, res) => {
  await exportarReporte(req, res, {
    titulo: "Reporte de Reparaciones",
    query: `
      SELECT
        h.id,
        e.serial,
        e.sn,
        te.nombre AS tipo,
        ma.nombre AS marca,
        mo.nombre AS modelo,
        es.nombre AS estado_final,
        h.fecha,
        u.nombre AS usuario,
        COALESCE(h.comentario, '') AS comentario,
        COALESCE(h.acciones, '') AS acciones,
        COALESCE(h.diagnostico, '') AS diagnostico
      FROM historial h
      JOIN equipos e ON e.id = h.equipo_id
      LEFT JOIN tipos_de_equipos te ON e.tipo_id = te.id
      LEFT JOIN marcas ma ON e.marca_id = ma.id
      LEFT JOIN modelos mo ON e.modelo_id = mo.id
      LEFT JOIN estados es ON h.estado_final_id = es.id
      LEFT JOIN usuarios u ON h.usuario_id = u.id
      WHERE LOWER(h.accion) LIKE '%repar%'
      ORDER BY h.fecha DESC, h.id DESC;
    `,
    columnas: [
      { header: "ID", key: "id" },
      { header: "Serial", key: "serial" },
      { header: "S/N", key: "sn" },
      { header: "Tipo", key: "tipo" },
      { header: "Marca", key: "marca" },
      { header: "Modelo", key: "modelo" },
      { header: "Estado Final", key: "estado_final" },
      { header: "Fecha", key: "fecha" },
      { header: "Usuario", key: "usuario" },
      { header: "Comentario", key: "comentario" },
      { header: "Acciones", key: "acciones" },
      { header: "Diagnóstico", key: "diagnostico" }
    ]
  });
});

router.get("/equipos", auth, async (req, res) => {
  const filtros = req.query;
  const whereClauses = [];
  const values = [];

  if (filtros.search) {
    const searchValue = `%${filtros.search.trim()}%`;
    whereClauses.push(`(
      e.serial ILIKE $${values.length + 1}
      OR e.sn ILIKE $${values.length + 1}
      OR t.nombre ILIKE $${values.length + 1}
      OR m.nombre ILIKE $${values.length + 1}
      OR mo.nombre ILIKE $${values.length + 1}
      OR d.nombre ILIKE $${values.length + 1}
      OR es.nombre ILIKE $${values.length + 1}
      OR u.nombre ILIKE $${values.length + 1}
    )`);
    values.push(searchValue);
  }

  if (filtros.usuario_nombre) {
    whereClauses.push(`u.nombre = $${values.length + 1}`);
    values.push(filtros.usuario_nombre);
  }

  if (filtros.departamento) {
    whereClauses.push(`d.nombre = $${values.length + 1}`);
    values.push(filtros.departamento);
  }

  if (filtros.tipo) {
    whereClauses.push(`t.nombre = $${values.length + 1}`);
    values.push(filtros.tipo);
  }

  if (filtros.marca) {
    whereClauses.push(`m.nombre = $${values.length + 1}`);
    values.push(filtros.marca);
  }

  if (filtros.estado) {
    whereClauses.push(`es.nombre = $${values.length + 1}`);
    values.push(filtros.estado);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  await exportarReporte(req, res, {
    titulo: "Reporte de Equipos",
    query: `
      SELECT
        e.id,
        e.serial,
        e.sn,
        e.fecha_ingreso,
        e.proveedor,
        e.observaciones,
        t.nombre AS tipo,
        m.nombre AS marca,
        mo.nombre AS modelo,
        d.nombre AS departamento,
        es.nombre AS estado,
        u.nombre AS usuario_nombre,
        u.email AS usuario_email
      FROM equipos e
      LEFT JOIN tipos_de_equipos t ON e.tipo_id = t.id
      LEFT JOIN marcas m ON e.marca_id = m.id
      LEFT JOIN modelos mo ON e.modelo_id = mo.id
      LEFT JOIN departamentos d ON e.departamento_id = d.id
      LEFT JOIN usuarios u ON e.usuario_asignado = u.id
      LEFT JOIN estados es ON e.estado_id = es.id
      ${whereSql}
      ORDER BY e.id ASC;
    `,
    params: values,
    columnas: [
      { header: "ID", key: "id" },
      { header: "Serial", key: "serial" },
      { header: "S/N", key: "sn" },
      { header: "Tipo", key: "tipo" },
      { header: "Marca", key: "marca" },
      { header: "Modelo", key: "modelo" },
      { header: "Departamento", key: "departamento" },
      { header: "Usuario", key: "usuario_nombre" },
      { header: "Estado", key: "estado" },
      { header: "Fecha Ingreso", key: "fecha_ingreso" },
      { header: "Proveedor", key: "proveedor" },
      { header: "Observaciones", key: "observaciones" }
    ]
  });
});

export default router;
