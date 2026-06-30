import React, { useState } from "react";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";

const GestionDepartamentos = () => {

    const [departamento, setDepartamento] = useState("");

    // Datos temporales
    const [departamentos] = useState([
        { id: 1, nombre: "OC BOGOTA" },
        { id: 2, nombre: "OC MEDELLIN" },
        { id: 3, nombre: "OC BARRANQUILLA" },
        { id: 4, nombre: "TES APARTADO" },
        { id: 5, nombre: "CXD MEDELLIN" },
        { id: 6, nombre: "BEST MEDELLIN" },
        { id: 7, nombre: "CXD BARRANQUILLA" }
        
    ]);

    return (

        <div className="config-card">

            <div className="config-card-header">

                <Building2 size={24} />

                <h2>Gestión de Departamentos</h2>

            </div>

            <div className="config-card-body">

                <div className="config-list">

                    {departamentos.map((item) => (

                        <div
                            className="config-item"
                            key={item.id}
                        >

                            <span>{item.nombre}</span>

                            <div className="config-actions">

                                <button className="config-icon-btn">

                                    <Pencil size={16} />

                                </button>

                                <button className="config-icon-btn delete">

                                    <Trash2 size={16} />

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                <div className="config-form">

                    <input
                        type="text"
                        className="config-input"
                        placeholder="Nuevo departamento..."
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                    />

                    <button className="config-btn">

                        <Plus size={18} />

                        Agregar

                    </button>

                </div>

            </div>

        </div>

    );

};

export default GestionDepartamentos;