import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DatabaseBackup,
  RotateCcw,
  SlidersHorizontal,
  FileText,
  ChevronRight,
} from "lucide-react";
import Toast from "../components/Toast";
import api from "../api";
import { crearMarca } from "../services/marcasService";
import { crearModelo } from "../services/modelosService";
import { crearDepartamento } from "../services/departamentosService";

const AccesosRapidos = () => {
  const navigate = useNavigate();
  const archivoRef = useRef(null);
  const [toast, setToast] = useState({ show: false, type: "success", title: "", message: "" });

  const mostrarToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
  };

  const descargarCopia = async () => {
    try {
      const [marcas, modelos, departamentos] = await Promise.all([
        api.get("/marcas"),
        api.get("/modelos"),
        api.get("/departamentos")
      ]);

      const copia = {
        version: 1,
        fecha: new Date().toISOString(),
        marcas: marcas.data,
        modelos: modelos.data,
        departamentos: departamentos.data
      };
      const blob = new Blob([JSON.stringify(copia, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `cloud-inventory-configuracion-${new Date().toISOString().slice(0, 10)}.json`;
      enlace.click();
      URL.revokeObjectURL(url);
      mostrarToast("success", "Copia creada", "La configuración se descargó correctamente.");
    } catch (error) {
      console.error(error);
      mostrarToast("error", "Error", error.response?.data?.error || "No se pudo crear la copia.");
    }
  };

  const restaurarCopia = async (event) => {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo) return;

    try {
      const contenido = JSON.parse(await archivo.text());
      if (!Array.isArray(contenido.marcas) || !Array.isArray(contenido.modelos) || !Array.isArray(contenido.departamentos)) {
        throw new Error("El archivo no tiene el formato de una copia válida.");
      }

      const marcasCreadas = new Map();
      for (const marca of contenido.marcas) {
        try {
          const creada = await crearMarca(marca.nombre);
          marcasCreadas.set(marca.id, creada.id);
        } catch (error) {
          if (error.response?.status !== 409) throw error;
        }
      }

      for (const departamento of contenido.departamentos) {
        try {
          await crearDepartamento(departamento.nombre);
        } catch (error) {
          if (error.response?.status !== 409) throw error;
        }
      }

      for (const modelo of contenido.modelos) {
        try {
          const marcaId = marcasCreadas.get(modelo.marca_id) || modelo.marca_id;
          await crearModelo({
            nombre: modelo.nombre,
            marca_id: Number(marcaId),
            tipo_id: modelo.tipo_id ? Number(modelo.tipo_id) : null
          });
        } catch (error) {
          if (error.response?.status !== 409) throw error;
        }
      }

      mostrarToast("success", "Sistema restaurado", "La configuración se importó correctamente. Recarga la página para ver los cambios.");
    } catch (error) {
      console.error(error);
      mostrarToast("error", "Error", error.message || "No se pudo restaurar la copia.");
    }
  };

  return (
    <div className="config-card">

      <div className="config-card-header">
        <SlidersHorizontal size={24} />
        <h2>Accesos Rápidos</h2>
      </div>

      <div className="config-card-body">

        <button className="config-shortcut" type="button" onClick={descargarCopia}>
          <div className="config-shortcut-left">
            <DatabaseBackup size={20} />
            <span>Copia de Seguridad</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button className="config-shortcut" type="button" onClick={() => archivoRef.current?.click()}>
          <div className="config-shortcut-left">
            <RotateCcw size={20} />
            <span>Restaurar Sistema</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button className="config-shortcut" type="button" onClick={() => document.getElementById("ajustes-generales")?.scrollIntoView({ behavior: "smooth" })}>
          <div className="config-shortcut-left">
            <SlidersHorizontal size={20} />
            <span>Parámetros del Sistema</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button className="config-shortcut" type="button" onClick={() => navigate("/reportes")}>
          <div className="config-shortcut-left">
            <FileText size={20} />
            <span>Registro de Actividad</span>
          </div>

          <ChevronRight size={18} />
        </button>

      </div>

      <input
        ref={archivoRef}
        type="file"
        accept="application/json,.json"
        onChange={restaurarCopia}
        hidden
      />

      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

    </div>
  );
};

export default AccesosRapidos;  