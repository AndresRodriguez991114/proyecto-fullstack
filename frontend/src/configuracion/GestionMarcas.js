import React, { useState } from "react";
import { Tag, Plus, Pencil, Trash2 } from "lucide-react";

const GestionMarcas = () => {

    // Temporal
    const [marca, setMarca] = useState("");

    const [marcas] = useState([
        { id: 1, nombre: "Dell" },
        { id: 2, nombre: "HP" },
        { id: 3, nombre: "Lenovo" }
    ]);

    return (

        <div className="config-card">

            <div className="config-card-header">

                <Tag size={24} />

                <h2>Gestión de Marcas</h2>

            </div>

            <div className="config-card-body">

                <div className="config-list">

                    {marcas.map((item) => (

                        <div className="config-item" key={item.id}>

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
                        className="config-input"
                        placeholder="Nueva marca..."
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
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

export default GestionMarcas;