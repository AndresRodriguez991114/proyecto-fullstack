// src/módulos/Header.js
import React from "react";
import ThemeToggle from "./ThemeToggle";

const Header = ({ title, menuOpen, setMenuOpen }) => {
  return (
    <>
      {/* HEADER */}
      <header className="admin-header">
        <span className="hamburger" onClick={() => setMenuOpen(true)}>☰</span>

        <h1>{title}</h1>

        <ThemeToggle />
      </header>

      {/* OVERLAY GLOBAL - para cerrar menú al tocar afuera */}
      <div
        className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </>
  );
};

export default Header;
