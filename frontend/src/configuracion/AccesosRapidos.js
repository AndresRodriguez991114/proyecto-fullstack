import React from "react";
import {
  DatabaseBackup,
  RotateCcw,
  SlidersHorizontal,
  FileText,
  ChevronRight,
} from "lucide-react";

const AccesosRapidos = () => {
  return (
    <div className="config-card">

      <div className="config-card-header">
        <SlidersHorizontal size={24} />
        <h2>Accesos Rápidos</h2>
      </div>

      <div className="config-card-body">

        <button className="config-shortcut">
          <div className="config-shortcut-left">
            <DatabaseBackup size={20} />
            <span>Copia de Seguridad</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button className="config-shortcut">
          <div className="config-shortcut-left">
            <RotateCcw size={20} />
            <span>Restaurar Sistema</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button className="config-shortcut">
          <div className="config-shortcut-left">
            <SlidersHorizontal size={20} />
            <span>Parámetros del Sistema</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button className="config-shortcut">
          <div className="config-shortcut-left">
            <FileText size={20} />
            <span>Registro de Actividad</span>
          </div>

          <ChevronRight size={18} />
        </button>

      </div>

    </div>
  );
};

export default AccesosRapidos;  