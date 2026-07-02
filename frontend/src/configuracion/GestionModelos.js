import React, { useState } from "react";
import { Laptop, Plus, Pencil, Trash2 } from "lucide-react";

const GestionModelos = () => {

    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");

    // Datos temporales
    const [marcas] = useState([
        { id: 1, nombre: "Dell" },
        { id: 2, nombre: "HP" },
        { id: 3, nombre: "Lenovo" }
    ]);

    const [modelos] = useState([
        { id: 1, marca: "Dell", nombre: "Latitude 5420" },
        { id: 2, marca: "HP", nombre: "ProBook 440 G8" },
        { id: 3, marca: "Lenovo", nombre: "ThinkPad T14" }
    ]);

    return (

        <div className="config-card">

            <div className="config-card-header">

                <Laptop size={24} />

                <h2>Gestión de Modelos</h2>

            </div>

            <div className="config-card-body">

                <div className="config-list">

                    {modelos.map((item) => (

                        <div
                            className="config-item"
                            key={item.id}
                        >

                            <div>

                                <strong>{item.nombre}</strong>

                                <br />

                                <small>{item.marca}</small>

                            </div>

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

                <div className="config-form-column">

                    <select
                        className="config-select"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                    >

                        <option value="">
                            Seleccione una marca
                        </option>

                        {marcas.map((m) => (

                            <option
                                key={m.id}
                                value={m.id}
                            >
                                {m.nombre}
                            </option>

                        ))}

                    </select>

                    <input
                        type="text"
                        className="config-input"
                        placeholder="Nombre del modelo..."
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                    />

                    <button className="config-btn">

                        <Plus size={18} />

                        Agregar Modelo

                    </button>

                </div>

            </div>

        </div>

    );

};

export default GestionModelos;