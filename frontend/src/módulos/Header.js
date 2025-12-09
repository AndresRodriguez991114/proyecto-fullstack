// src/módulos/Header.js
import React from "react";
import ThemeToggle from "./ThemeToggle";

const Header = ({ title, menuOpen, setMenuOpen }) => {
  return (
    <>
      <header className="admin-header">
        {/* Botón hamburguesa (solo visible en móvil) */}
        <span className="hamburger" onClick={() => setMenuOpen(true)}>
          ☰
        </span>

        <h1>{title}</h1>

        {/* Switch Dark/Light */}
        <ThemeToggle />
      </header>

      {/* Overlay global (cierra el menú al tocar afuera) */}
      <div
        className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Header;
