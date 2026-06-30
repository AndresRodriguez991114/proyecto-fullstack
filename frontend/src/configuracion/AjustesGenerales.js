import React from "react";
import { Settings, Save } from "lucide-react";

const AjustesGenerales = () => {
  return (
    <div className="config-card">

      <div className="config-card-header">
        <Settings size={24} />
        <h2>Ajustes Generales</h2>
      </div>

      <div className="config-card-body">

        <div className="config-group">

          <label className="config-label">
            Idioma del Sistema
          </label>

          <select className="config-select">
            <option>Español</option>
            <option>English</option>
          </select>

          <div className="config-warning">
              🚧 Disponible próximamente.
          </div>

        </div>

        <button className="config-btn config-btn-full">

          <Save size={18} />

          Guardar Cambios

        </button>

      </div>

    </div>
  );
};

export default AjustesGenerales;