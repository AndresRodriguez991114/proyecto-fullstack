import React, { useState } from "react";
import Sidebar from "../módulos/Sidebar";
import Header from "../módulos/Header";
import "../Styles/Configuracion.css";

import AjustesGenerales from "../configuracion/AjustesGenerales";
import AccesosRapidos from "../configuracion/AccesosRapidos";
import GestionMarcas from "../configuracion/GestionMarcas";
import GestionModelos from "../configuracion/GestionModelos";
import GestionDepartamentos from "../configuracion/GestionDepartamentos";

const ConfiguracionPage = () => {

    const [menuOpen,setMenuOpen]=useState(false);

    const user=JSON.parse(localStorage.getItem("user")||"{}");

    return(

        <div className="admin-root">

            <Sidebar
                user={user}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />

            <main className="admin-main">

                <Header
                    title="Configuración"
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                />

                <div className="config-page">

                    <div className="config-left">

                        <AjustesGenerales/>

                        <AccesosRapidos/>

                    </div>

                    <div className="config-right">

                        <GestionMarcas/>

                        <GestionModelos/>

                        <GestionDepartamentos/>

                    </div>

                </div>

                <footer className="admin-legal">

                    © 2025 Cloud + Inventory. Todos los derechos reservados.

                </footer>

            </main>

        </div>

    );

}

export default ConfiguracionPage;